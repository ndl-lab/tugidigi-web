package jp.go.ndl.lab.common.alto;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.text.StrBuilder;

public class OCRPage {

    public int w;
    public int h;
    public int page;

    public OCRPage(int page, int width, int height) {
        this.w = width;
        this.h = height;
    }

    public OCRPage() {
    }

    public List<OCRParagraph> paragraphs = new ArrayList<>();

    public void text(StrBuilder sb) {
        if (paragraphs != null) {
            for (OCRParagraph p : paragraphs) {
                p.text(sb);
            }
        }
    }
    
    public String text(){
        StrBuilder sb = new StrBuilder();
        text(sb);
        return sb.toString();
    }

}
