package jp.go.ndl.lab.common.alto;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.text.StrBuilder;

public class OCRParagraph {

    public String id;

    public OCRParagraph() {
    }

    public OCRParagraph(String id) {
        this.id = id;
    }

    public List<OCRChar> characters = new ArrayList<>();

    public void text(StrBuilder sb) {
        if (characters != null) {
            for (OCRChar c : characters) {
                sb.append(c.c);
            }
        }
    }

}
