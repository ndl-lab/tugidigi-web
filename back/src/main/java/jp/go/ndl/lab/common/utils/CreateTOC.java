package jp.go.ndl.lab.common.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.common.utils.AnalyzeTOC;
import lombok.extern.slf4j.Slf4j;

@Slf4j

public class CreateTOC {
    public CreateTOC() {
    }
    public List<String> MakeTOC(Book book,List<Integer> tocCand,Map<Integer, String>pageContent) throws LabException {
        log.info("start {}", book.title);
        List<String> texts=new ArrayList<>();
        for(int pg=1;pg<=book.page;pg++) {
        	if(pageContent.containsKey(pg))texts.add(pageContent.get(pg));
        	else texts.add("");
        }
        //目次ページ判定
        //判定
        Collections.sort(tocCand);
        Set<Integer> tocCandfiltered=new HashSet<>();
        for(int pg=0;pg<tocCand.size()&&tocCand.get(pg)<=book.page/4&&tocCand.size()<10;pg++) {
        	tocCandfiltered.add(tocCand.get(pg));
        }
        log.info("making the table of contents! {}", tocCandfiltered);
        AnalyzeTOC analyzeTOC = new AnalyzeTOC(texts, new ArrayList<>(tocCandfiltered));
        List<String>index = analyzeTOC.solve(25);
        return index;
    }

}
