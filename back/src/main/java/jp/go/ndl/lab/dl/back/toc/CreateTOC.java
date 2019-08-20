package jp.go.ndl.lab.dl.back.toc;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import jp.go.ndl.lab.dl.back.domain.Book;
import jp.go.ndl.lab.dl.back.toc.AnalyzeTOC;
import lombok.extern.slf4j.Slf4j;

@Slf4j

public class CreateTOC {

    public CreateTOC() {
    }

    public List<String> MakeTOC(Book book, List<Integer> tocCand, Map<Integer, String> pageContent) throws Exception {
        log.info("start {}", book.title);
        List<String> texts = new ArrayList<>();
        for (int pg = 1; pg <= book.page; pg++) {
            if (pageContent.containsKey(pg)) texts.add(pageContent.get(pg));
            else texts.add("");
        }
        //目次ページ判定
        //判定
        Collections.sort(tocCand);
        log.info("making the table of contents! {}", tocCand);
        AnalyzeTOC analyzeTOC = new AnalyzeTOC(texts, tocCand);
        List<String> index = analyzeTOC.solve(50);
        return index;
    }

}
