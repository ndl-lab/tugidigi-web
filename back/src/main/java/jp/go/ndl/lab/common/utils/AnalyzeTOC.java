package jp.go.ndl.lab.common.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Book.autoIndex;
import jp.go.ndl.lab.common.utils.SortedListMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StrBuilder;
import org.apache.lucene.search.spell.LevensteinDistance;

@Slf4j
public class AnalyzeTOC {

    static String replace = "[　\t\\s。、]";

    private int count = 0;
    private Page[] pages;
    private String indexText;

    public AnalyzeTOC(List<String> pageTexts, List<Integer> indexLocation) {//List<String> pageTextsの長さはコマ数と一致する。
        indexText = "";
        List<Page> pages = new ArrayList<>();
        for (int i = 0; i < pageTexts.size(); i++) {
            if (indexLocation.contains(i + 1)) {
                indexText += pageTexts.get(i).replaceAll(replace + "|[\n\r・.：…?]", "");
            } else {
                pages.add(new Page(pageTexts.get(i), count++, i + 1));
            }
        }
        count = pages.size();
        pages.forEach(p -> index(p));
        this.pages = pages.toArray(new Page[pages.size()]);
    }

    public List<Book.autoIndex> solve(List<String> tocs) throws LabException {
        List<WindowResult> windows = new ArrayList<>();
        for (String toc : tocs) {
            WindowResult w = new WindowResult(0, 0, toc);
            for (int j = 0; j < toc.length() - indexSize + 1; j++) {
                InvIndex ind = this.index.get(toc.substring(j, j + indexSize));
                if (ind != null) {
                    w.addArray(ind.array);
                }
            }
            System.out.println(toc);
            System.out.println(Arrays.toString(w.array));
            w.calcScore();
            windows.add(w);
        }

        List<autoIndex> result = new ArrayList<>();
        for (WindowResult w : windows) {
            result.add(new Book.autoIndex(w.title, pages[w.maxIndex].page, w.maxScore));
        }
        return result;
    }

    public List<String> solve(int width) throws LabException {
        List<WindowResult> windows = new ArrayList<>();
        for (int i = 0; i < indexText.length() - width; i++) {
            String indexCand = indexText.substring(i, i + width);
            WindowResult w = new WindowResult(i, width, indexCand);
            for (int j = 0; j < indexCand.length() - indexSize + 1; j++) {
                InvIndex ind = this.index.get(indexCand.substring(j, j + indexSize));
                if (ind != null) {
                    w.addArray(ind.array);
                }
            }
            w.calcScore();
            windows.add(w);
        }

        Collections.sort(windows, (w1, w2) -> Double.compare(w2.maxScore, w1.maxScore));

        int[] ea = new int[indexText.length()];
        Arrays.fill(ea, 1);

        List<WindowResult> last = new ArrayList<>();

        loop:
        for (WindowResult w : windows) {
            //check
            for (int i = w.start; i < w.start + w.len; i++) {
                if (ea[i] == 0) continue loop;
            }

            //print
            if (w.maxIndex != -1) {
                for (int i = w.start; i < w.start + w.len; i++) {
                    ea[i] = 0;
                }
                last.add(w);
            }

        }

        List<String> result = new ArrayList<>();

        for (WindowResult w : last) {
            //result.add(new Book.autoIndex(w.bestTitle(pages[w.maxIndex].content), pages[w.maxIndex].page, w.maxScore));
        	String indexString=w.bestTitle(pages[w.maxIndex].content)+" / "+"("+String.format("%04d", pages[w.maxIndex].page)+".jp2"+")";
        	result.add(indexString);
        }
        return result;
    }

    LevensteinDistance dis = new LevensteinDistance();

    static class WinResult {

        int docIndex;
        double score;

        public WinResult(int docIndex, double score) {
            this.docIndex = docIndex;
            this.score = score;
        }

    }

    class WindowResult {

        public WindowResult(int start, int len, String title) {
            this.start = start;
            this.len = len;
            this.title = title;
            this.array = new int[count];
            Arrays.fill(array, 0);
        }

        public void addArray(int[] array) {
            for (int i = 0; i < array.length; i++) {
                this.array[i] += array[i];
            }
        }

        int topX = 1;

        double maxScore = 0;
        int maxIndex = -1;

        void calcScore() {
            maxScore = 0;
            maxIndex = -1;
//            System.out.println(title + "\t" + Arrays.toString(array));
            SortedListMap<Integer, Integer> slm = new SortedListMap<>();
            for (int i = 0; i < array.length; i++) {
                slm.add(array[i], i);
            }
            List<Integer> keys = slm.getSortedKeyList();
            Collections.reverse(keys);
            for (int i = 0; i < topX; i++) {
                for (Integer inedex : slm.getList(keys.get(i))) {
                    double max = 0;
                    String content = pages[inedex].content;
                    if (content.length() > title.length()) {
                        for (int j = 0; j < content.length() - title.length(); j++) {
                            double d = dis.getDistance(title, content.substring(j, j + title.length()));
                            if (d > max) max = d;
                        }
                    }
                    double score = array[inedex] * max;
                    if (maxScore < score) {
                        maxScore = score;
                        maxIndex = inedex;
                    }
                }
            }
        }

        public int[] highestDoc() {
            int max = 0;
            int maxIndex = -1;
            for (int i = 0; i < array.length; i++) {
                if (array[i] > max) {
                    max = array[i];
                    maxIndex = i;
                }
            }
            return new int[]{maxIndex, max};
        }

        int start;
        int len;
        String title;

        int array[];
        int highestPageMatch = 0;

        private String bestTitle(String content) {
            StrBuilder sb = new StrBuilder(this.title.replaceAll("[?\n\r・.：…]", ""));
            //前
            double amax = 0;
            String buf = null;
            for (int i = 0; i < 10; i++) {
                double max = 0;
                for (int j = 0; j < content.length() - sb.length(); j++) {
                    double d = dis.getDistance(sb.toString(), content.substring(j, j + sb.length()));
                    if (d > max) max = d;
                }
                max = max * sb.length();
                if (amax > max) {
                    sb = new StrBuilder(buf);
                    break;
                } else {
                    amax = max;
                    buf = sb.toString();
                    sb.delete(0, 1);
//                    System.out.println(sb + "\t" + amax);
                }
            }

            //
            amax = 0;
            buf = null;
            for (int i = 0; i < 10; i++) {
                double max = 0;
                for (int j = 0; j < content.length() - sb.length(); j++) {
                    double d = dis.getDistance(sb.toString(), content.substring(j, j + sb.length()));
                    if (d > max) max = d;
                }
                max = max * sb.length();
                if (amax > max) {
                    sb = new StrBuilder(buf);
                    break;
                } else {
                    amax = max;
                    buf = sb.toString();
                    sb.delete(sb.length() - 1, sb.length());
//                    System.out.println(sb + "\t" + amax);
                }
            }

            return sb.toString();
        }
    }

    int indexSize = 2;

    private Map<String, InvIndex> index = new HashMap<>();

    private void index(Page page) {
        for (int i = 0; i < page.content.length() - indexSize + 1; i++) {
            String esc = page.content.replaceAll("\\s", "");
            String c = page.content.substring(i, i + indexSize);
            if (c.matches("\\s")) continue;
            InvIndex ind = index.get(c);
            if (ind == null) {
                ind = new InvIndex();
                ind.c = c;
                ind.array = new int[count];
                Arrays.fill(ind.array, 0);
                index.put(c, ind);
            }
            ind.array[page.index] = 1;
        }
    }

    private static class InvIndex {

        String c;
        int[] array;

    }

    private static class Page {

        public int index;
        public String content;
        public int page;

        public Page(String content, int index, int page) {
            this.index = index;
            this.page = page;
            this.content = content.replaceAll(replace + "|[\n\r・.：…?]", "");
        }

    }
}
