package jp.go.ndl.lab.common.alto;

public class OCRChar {

    public OCRChar() {
    }
    
    public int x;
    public int y;
    public int w;
    public int h;
      public String c;

    public OCRChar(String c, int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.c = c;
    }
      
      
}
