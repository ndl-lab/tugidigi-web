package jp.go.ndl.lab.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;

import javax.imageio.*;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.FileImageInputStream;
import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Iterator;

@Slf4j
public class LabImageUtils {

    public static void main(String[] args) {
        //http://www.library.tokushima-ec.ed.jp/digital/ezu/ezuimage/B-7.jpg
        downloadImageToJpg(new File("ignore\\http.jpg"), "http://www.library.tokushima-ec.ed.jp/digital/ezu/ezuimage/B-7.jpg");
    }

    private static CloseableHttpClient client = LabHttpClientBuilder.create(0, 500, null, null, true);

    public static final float STANDARD_QUALITY = 0.85f;

    public static boolean downloadImageToJpg(File out, String url) {
        try (CloseableHttpResponse res = client.execute(new HttpGet(url))) {
            if (res.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                BufferedImage image = ImageIO.read(res.getEntity().getContent());
                writeJpegToFile(image, out, STANDARD_QUALITY);
                return true;
            }
        } catch (Throwable exception) {
            log.error("Error Getting: {}", url, exception);
        }
        return false;
    }
    public static boolean downloadImageToJpgwithCredential(File out, String url,String uname,String passwd) {
    	CloseableHttpClient credclient = LabHttpClientBuilder.create(0, 500, uname, passwd, true);
        try (CloseableHttpResponse res = credclient.execute(new HttpGet(url))) {
            if (res.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                BufferedImage image = ImageIO.read(res.getEntity().getContent());
                writeJpegToFile(image, out, STANDARD_QUALITY);
                return true;
            }
        } catch (Throwable exception) {
            log.error("Error Getting: {}", url, exception);
        }
        return false;
    }
    public static void writeJpegToFile(BufferedImage bufferedImage, File out, float quality) throws IOException {
        try (FileImageOutputStream output = new FileImageOutputStream(out)) {
            writeJpeg(bufferedImage, output, quality);
        }
    }

    public static byte[] writeJpegToByteArray(BufferedImage bufferedImage, float quality) throws IOException {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(byteArrayOutputStream)) {
            writeJpeg(bufferedImage, imageOutputStream, quality);
            return byteArrayOutputStream.toByteArray();
        }
    }

    public static byte[] writeImageToPNGByteArray(BufferedImage bufferedImage, float quality) throws IOException {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(byteArrayOutputStream)) {
            ImageIO.write(bufferedImage, "png", imageOutputStream);
            return byteArrayOutputStream.toByteArray();
        }
    }

    public static void writeJpeg(BufferedImage bufferedImage, ImageOutputStream outputStream, float quality) throws IOException {
        ImageWriter imageWriter = ImageIO.getImageWritersByFormatName("jpeg").next();
        JPEGImageWriteParam writeParam = (JPEGImageWriteParam) imageWriter.getDefaultWriteParam();
        writeParam.setProgressiveMode(ImageWriteParam.MODE_DEFAULT);
        writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        writeParam.setCompressionQuality(quality);
        writeParam.setOptimizeHuffmanTables(true);
        imageWriter.setOutput(outputStream);
        imageWriter.write(null, new IIOImage(bufferedImage, null, null), writeParam);
        imageWriter.dispose();
    }


    public static Dimension getImageDimension(Path jpgFile) {
        Iterator<ImageReader> iter = ImageIO.getImageReadersBySuffix("jpg");
        while (iter.hasNext()) {
            ImageReader reader = iter.next();
            try {
                ImageInputStream stream = new FileImageInputStream(jpgFile.toFile());
                reader.setInput(stream);
                int width = reader.getWidth(reader.getMinIndex());
                int height = reader.getHeight(reader.getMinIndex());
                return new Dimension(width, height);
            } catch (IOException e) {
                log.error("Error reading: " + jpgFile, e);
            } finally {
                reader.dispose();
            }
        }
        return null;
    }

    public static BufferedImage getHorizontalFlipImage(BufferedImage image) {
        AffineTransform tx = AffineTransform.getScaleInstance(-1, 1);
        tx.translate(-image.getWidth(), 0);
        AffineTransformOp op = new AffineTransformOp(tx, AffineTransformOp.TYPE_NEAREST_NEIGHBOR);
        return op.filter(image, null);
    }

    public static BufferedImage getRotatedImage(BufferedImage image, int rotation, boolean horizontalFlip) {
        AffineTransform tx = new AffineTransform();
        tx.rotate(Math.toRadians(rotation), 0, 0);
        if (rotation == 90) {
            tx.translate(0, -image.getHeight());
        } else if (rotation == 180) {
            tx.translate(-image.getWidth(), -image.getHeight());
        } else if (rotation == 270) {
            tx.translate(-image.getWidth(), 0);
        }
        if (horizontalFlip) {
            AffineTransform flip = AffineTransform.getScaleInstance(-1, 1);
            flip.translate(-image.getWidth(), 0);
            tx.concatenate(flip);
        }
        AffineTransformOp op = new AffineTransformOp(tx, AffineTransformOp.TYPE_NEAREST_NEIGHBOR);
        return op.filter(image, null);
    }


    /**
     * TargetWidthやTargetHeightが-1の時には、もう片方の値を基準に元の画像と同じ比率を保って拡大縮小
     */
    public static BufferedImage getScaledInstance(BufferedImage img, int srcX, int srcY, int srcW, int srcH, int dstW, int dstH) {
        int type = (img.getTransparency() == Transparency.OPAQUE) ? BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
        BufferedImage srcImg = img;
        BufferedImage dstImg = null;

        if (dstW <= 0) {
            dstW = (int) (1.0d * dstH / srcH * srcW);
        }

        if (dstH <= 0) {
            dstH = (int) (1.0d * dstW / srcW * srcH);
        }

        int w = srcW;
        int h = srcH;

        boolean isWidthExpand = srcW < dstW;
        boolean isHeightExpand = srcH < dstH;

        while (w != dstW || h != dstH) {
            if (isWidthExpand) {
                if (w < dstW) {
                    w *= 2;
                    if (w > dstW) {
                        w = dstW;
                    }
                }
            } else {
                if (w > dstW) {
                    w /= 2;
                    if (w < dstW) {
                        w = dstW;
                    }
                }
            }
            if (isHeightExpand) {
                if (h < dstH) {
                    h *= 2;
                    if (h > dstH) {
                        h = dstH;
                    }
                }
            } else {
                if (h > dstH) {
                    h /= 2;
                    if (h < dstH) {
                        h = dstH;
                    }
                }
            }
            dstImg = new BufferedImage(w, h, type);
            Graphics2D g2 = dstImg.createGraphics();
            g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g2.drawImage(srcImg, 0, 0, w, h, srcX, srcY, srcX + srcW, srcY + srcH, null);
            srcX = 0;
            srcY = 0;
            srcW = w;
            srcH = h;
            g2.dispose();
            srcImg.flush();
            srcImg = dstImg;
        }

        if (dstImg == null) {
            dstImg = new BufferedImage(dstW, dstH, type);
            Graphics2D g2 = dstImg.createGraphics();
            g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g2.drawImage(srcImg, 0, 0, w, h, srcX, srcY, srcX + srcW, srcY + srcH, null);
        }

        return dstImg;
    }

    public static BufferedImage getScaledInstance(BufferedImage img, int dstW, int dstH) {
        return getScaledInstance(img, 0, 0, img.getWidth(), img.getHeight(), dstW, dstH);
    }

    public static BufferedImage getGreyScaledImage(BufferedImage img) {
        for (int x = 0; x < img.getWidth(); x++) {
            for (int y = 0; y < img.getHeight(); y++) {
                int rgb = img.getRGB(x, y);
                Color c = new Color(rgb);
                int p = (int) (0.29891 * c.getRed() +
                        0.58661 * c.getBlue() +
                        0.11448 * c.getGreen());
                c = new Color(p, p, p);
                img.setRGB(x, y, c.getRGB());
            }
        }
        return img;
    }


    public static int getOTSUThreshold(BufferedImage img) {
        // histogram作成
        int[] hist = new int[256];
        for (int x = 0; x < img.getWidth(); x++) {
            for (int y = 0; y < img.getHeight(); y++) {
                int rgb = img.getRGB(x, y);
                Color c = new Color(rgb);
                int p = (int) (c.getRed() +
                        c.getBlue() +
                        c.getGreen()) / 3;
                hist[p]++;
            }
        }

        double totalPiexels = img.getWidth() * img.getHeight();
        double brightnessSum = 0;
        for (int i = 0; i < hist.length; i++) {
            brightnessSum += i * hist[i];
        }

        double bestVariance = Double.NEGATIVE_INFINITY;
        int threshold = 0;

        double blackPixelCount = 0;
        double blackBrightnessSum = 0;
        double whitePixelCount = totalPiexels;
        double whiteBrightnessSum = brightnessSum;

        for (int t = 0; t < 256; t++) {
            blackPixelCount += hist[t];
            blackBrightnessSum += hist[t] * t;
            whitePixelCount -= hist[t];
            whiteBrightnessSum -= hist[t] * t;
            double variance = blackPixelCount * whitePixelCount * Math.pow(blackBrightnessSum / blackPixelCount - whiteBrightnessSum / whitePixelCount, 2);

            if (variance > bestVariance) {
                bestVariance = variance;
                threshold = t;
            }
        }
        return threshold;
    }

    public static BufferedImage getBWImage(BufferedImage img, int threshold) {
        for (int x = 0; x < img.getWidth(); x++) {
            for (int y = 0; y < img.getHeight(); y++) {
                int rgb = img.getRGB(x, y);
                Color c = new Color(rgb);
                int p = (int) (c.getRed() +
                        c.getBlue() +
                        c.getGreen()) / 3;
                if (p > threshold) {
                    c = Color.WHITE;
                } else {
                    c = Color.BLACK;
                }
                img.setRGB(x, y, c.getRGB());
            }
        }
        return img;
    }


}