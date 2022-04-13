package jp.go.ndl.lab.back.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.infra.EsDataStore;
import jp.go.ndl.lab.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.back.infra.EsSearchResult;

import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.stereotype.Service;

@Service
public class PageService {

    public final EsDataStore<Page> pageStore;

    public PageService(EsDataStoreFactory storeFactory) {
        pageStore = storeFactory.build(Page.class);
    }

    public Page get(String id) {
        return pageStore.get(id);
    }
    public EsSearchResult<Page> getAllPage(String pid){
    	SearchSourceBuilder ssb = new SearchSourceBuilder();
        ssb.query(QueryBuilders.termQuery("book", pid));
        ssb.size(2000);
        ssb.sort(new FieldSortBuilder("page").order(SortOrder.ASC));
        return pageStore.search(ssb);
    }
    public EsSearchResult<Page> search(SearchSourceBuilder ssb,Boolean isCrossOrigin) {
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.encoder("html");
        highlightBuilder.field(new HighlightBuilder.Field("contents"));
        highlightBuilder.fragmentSize(100);
        highlightBuilder.boundaryScannerLocale("ja-JP");
        highlightBuilder.numOfFragments(1);
        ssb.highlighter(highlightBuilder);
        ssb.sort(new FieldSortBuilder("page").order(SortOrder.ASC));
        EsSearchResult<Page> result = pageStore.search(ssb);
        int index = 0;
        for (SearchHit hit : result.searchResponse.getHits()) {
            Map<String, HighlightField> highlightFields = hit.getHighlightFields();
            HighlightField hf = highlightFields.get("contents");
            Page page = result.list.get(index++);
            if(isCrossOrigin) {
            	page.contents=null;
            	page.coordjson=null;
            }else {
	            if (hf == null) {
	                page.highlights = Collections.EMPTY_LIST;
	            } else {
	                page.highlights = Arrays.stream(hf.fragments()).map(text -> text.string()).collect(Collectors.toList());
	            }
            }
        }
        return result;
    }
    
}
