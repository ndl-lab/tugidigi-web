package jp.go.ndl.lab.common.alto;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.text.StrBuilder;

public class OCRBook {

    public OCRBook() {
    }
    

    public List<OCRPage> pages = new ArrayList();

    public String text() {
        StrBuilder sb = new StrBuilder();
        if (pages != null) {
            for (OCRPage page : pages) {
                page.text(sb);
            }
        }
        return sb.toString();
    }

}
