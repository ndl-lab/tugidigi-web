package jp.go.ndl.lab.common.alto;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.awt.Rectangle;
import java.awt.Shape;
import java.awt.geom.AffineTransform;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.fontbox.util.BoundingBox;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType3Font;
import org.apache.pdfbox.pdmodel.interactive.pagenavigation.PDThreadBead;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;

@Slf4j
public class PDF2JSONConverter extends PDFTextStripper {

    private AffineTransform flipAT;
    private AffineTransform rotateAT;
    private AffineTransform transAT;
    static final int SCALE = 4;

    private final PDDocument document;

    private int dx;
    private int dy;
    private double sx;
    private double sy;

    private PDF2JSONConverter(PDDocument document, int dx, int dy, double sx, double sy) throws IOException {
        this.document = document;
        this.dx = dx;
        this.dy = dy;
        this.sx = sx;
        this.sy = sy;
        book = new OCRBook();
    }

    public static void main(String[] args) throws IOException {
        File pdfFile = new File("1201700446214.pdf");
        File xmlDir = new File("1201700446214.json");
        convert(pdfFile, xmlDir);
    }

    public static OCRBook convert(File pdfFile, File jsonDir) throws IOException {
        try (PDDocument document = PDDocument.load(pdfFile)) {
            log.info("start converting {}", pdfFile.getName());
            PDF2JSONConverter stripper = new PDF2JSONConverter(document, 0, 0, 1, 1);
            for (int page = 0; page < document.getNumberOfPages(); ++page) {
                try {
                    stripper.stripPage(page);
                } catch (Throwable t) {
                    log.error("Unexpected error", t);
                }
            }
            log.info("finished converting");
            om.writeValue(jsonDir, stripper.book);
            return stripper.book;
        }
    }

    private OCRBook book;
    private OCRPage ocrPage;

    private static ObjectMapper om = new ObjectMapper();
    private int pCount = 0;

    private void stripPage(int page) throws IOException {
        log.debug("start converting page {}", page);
        PDFRenderer pdfRenderer = new PDFRenderer(document);
        BufferedImage image = pdfRenderer.renderImage(page, SCALE);
        log.debug("{}x{}", image.getWidth(), image.getHeight());

        ocrPage = new OCRPage(page, image.getWidth(), image.getHeight());
        pCount = 1;

        PDPage pdPage = document.getPage(page);
        PDRectangle cropBox = pdPage.getCropBox();

        flipAT = new AffineTransform();
        // flip y-axis
        flipAT.translate(0, pdPage.getBBox().getHeight());
        flipAT.scale(1, -1);

        // page may be rotated
        rotateAT = new AffineTransform();
        int rotation = pdPage.getRotation();
        if (rotation != 0) {
            PDRectangle mediaBox = pdPage.getMediaBox();
            switch (rotation) {
                case 90:
                    rotateAT.translate(mediaBox.getHeight(), 0);
                    break;
                case 270:
                    rotateAT.translate(0, mediaBox.getWidth());
                    break;
                case 180:
                    rotateAT.translate(mediaBox.getWidth(), mediaBox.getHeight());
                    break;
                default:
                    break;
            }
            rotateAT.rotate(Math.toRadians(rotation));
        }

        // cropbox
        transAT = AffineTransform.getTranslateInstance(-cropBox.getLowerLeftX(), cropBox.getLowerLeftY());

        setStartPage(page + 1);
        setEndPage(page + 1);

        Writer dummy = new OutputStreamWriter(new ByteArrayOutputStream());
        writeText(document, dummy);

        // beads in green
        List<PDThreadBead> pageArticles = pdPage.getThreadBeads();
        for (PDThreadBead bead : pageArticles) {
            PDRectangle r = bead.getRectangle();
            Shape s = r.toGeneralPath().createTransformedShape(transAT);
            s = flipAT.createTransformedShape(s);
            s = rotateAT.createTransformedShape(s);
        }
        book.pages.add(ocrPage);
    }

    public static OCRBook read(File json) {
        try {
            return om.readValue(json, OCRBook.class);
        } catch (IOException ex) {
            log.error("json-read-error", ex);
            throw new RuntimeException("JSON読み取りエラー");
        }
    }

    private OCRParagraph paragraph;
    private int lineCount = 1;

    @Override
    protected void writeParagraphStart() throws IOException {
        log.debug("Paragraph start");
        paragraph = new OCRParagraph(ocrPage.page + "-" + (pCount++));
        ocrPage.paragraphs.add(paragraph);
        super.writeParagraphStart();
    }

    @Override
    protected void writeParagraphEnd() throws IOException {
        log.debug("Paragraph End");
        super.writeParagraphEnd();
    }

    private int charCount = 1;

    @Override
    protected void writeString(String string, List<TextPosition> textPositions) throws IOException {
        for (TextPosition text : textPositions) {
            Rectangle2D.Float rect = new Rectangle2D.Float(
                    text.getXDirAdj(),
                    (text.getYDirAdj() - text.getHeightDir()),
                    text.getWidthDirAdj(),
                    text.getHeightDir());

            PDFont font = text.getFont();
            BoundingBox bbox = font.getBoundingBox();

            float xadvance = font.getWidth(text.getCharacterCodes()[0]);
            rect = new Rectangle2D.Float(0, bbox.getLowerLeftY(), xadvance, bbox.getHeight());

            AffineTransform at = text.getTextMatrix().createAffineTransform();
            if (font instanceof PDType3Font) {
                at.concatenate(font.getFontMatrix().createAffineTransform());
            } else {
                at.scale(1 / 1000f, 1 / 1000f);
            }
            Shape s = at.createTransformedShape(rect);

            s = flipAT.createTransformedShape(s);
            s = rotateAT.createTransformedShape(s);

            AffineTransform sc = AffineTransform.getScaleInstance(SCALE, SCALE);
            s = sc.createTransformedShape(s);
            Rectangle r = s.getBounds();
//            log.info("{} {} {} {} {}", text.getUnicode(), (int) (r.x * sx + dx), (int) (r.y * sy + dy), (int) (r.height * sy), (int) (r.width * sx));
            paragraph.characters.add(new OCRChar(text.getUnicode(), (int) (r.x * sx + dx), (int) (r.y * sy + dy), (int) (r.height * sy), (int) (r.width * sx)));
        }
    }

}
