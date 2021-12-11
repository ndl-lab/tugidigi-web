package jp.go.ndl.lab.back.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import jp.go.ndl.lab.back.domain.ItemFacet;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Illustration;
import jp.go.ndl.lab.back.infra.EsDataStore;
import jp.go.ndl.lab.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.back.infra.EsSearchQuery;
import jp.go.ndl.lab.back.infra.EsSearchResult;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.IdsQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.primitives.Floats;

@Service
@Slf4j
public class BookService {

    public final EsDataStore<Book> bookStore;

    public BookService(EsDataStoreFactory storeFactory) {
        bookStore = storeFactory.build(Book.class);
    }

    public Book get(String id) {
        return bookStore.get(id);
    }

    @Autowired
    private IllustService illustService;

    public EsSearchResult<Book> searchwithhighlights(SearchSourceBuilder ssb,List<String>highlightTargets) {
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.encoder("html");
        for(String highlight:highlightTargets)highlightBuilder.field(new HighlightBuilder.Field(highlight));
        highlightBuilder.fragmentSize(100);
        highlightBuilder.boundaryScannerLocale("ja-JP");
        highlightBuilder.numOfFragments(3);
        ssb.highlighter(highlightBuilder);
        EsSearchResult<Book> result = bookStore.search(ssb);
        //ハイライト処理
        int index = 0;
        for (SearchHit hit : result.searchResponse.getHits()) {
        	if(index>=result.list.size())break;//中身が無いのに参照しない
            Map<String, HighlightField> highlightFields = hit.getHighlightFields();
            for(String highlight:highlightTargets) {
	            HighlightField hf = highlightFields.get(highlight);
	            Book book = result.list.get(index);
	            if (hf == null) {
	                if(book.highlights==null)book.highlights = Collections.EMPTY_LIST;
	            } else {
	                log.info("{}", hf);
	                book.highlights = Arrays.stream(hf.fragments()).map(text -> text.string()).collect(Collectors.toList());
	            }
            }
            index++;
        }
        return result;
    }

    @Autowired
    private VectorSearchServiceValdImpl vss;

    @Autowired
    private IllustService is;

    class Score implements Comparable<Score> {

        String id;

        public Score(String id) {
            this.id = id;
        }

        double score;

        @Override
        public int compareTo(Score o) {
            return Double.compare(o.score, score);
        }

    }
    public EsSearchResult<Book> search(EsSearchQuery q) {
        SearchSourceBuilder ssb = new SearchSourceBuilder();
        ssb.from(q.from == null ? 0 : q.from);
        ssb.size(q.size == null ? 20 : q.size);
        for (String field : new String[]{"graphictagmetrics.tagname"}) {
            TermsAggregationBuilder termFacetAgg = AggregationBuilders.terms(field);
            termFacetAgg.size(10);
            termFacetAgg.field(field);
            ssb.aggregation(termFacetAgg);
        }
        
        BoolQueryBuilder base = QueryBuilders.boolQuery();
      //フィルタ関係
        Set<String>filterSet=new HashSet<String>();
        if (!MapUtils.isEmpty(q.filter)) {
            for (String field : q.filter.keySet()) {
                List<String> values = q.filter.get(field);
                BoolQueryBuilder bq = QueryBuilders.boolQuery();
                for (String value : values) {
                    if (StringUtils.isNotBlank(value)) {
                    	if(value.startsWith("-")) {
                    		bq.mustNot(QueryBuilders.termQuery(field, value.substring(1)));
                    	}else {
                    		bq.should(QueryBuilders.termQuery(field, value));
                    		filterSet.add(value);
                    	}
                    }
                }
                base.filter(bq);
            }
        }
        //ファセット関係
        Set<String>facetSet=new HashSet<String>();
        if (!MapUtils.isEmpty(q.facet)) {
            for (String field : q.facet.keySet()) {
                List<String> values = q.facet.get(field);
                BoolQueryBuilder bq = QueryBuilders.boolQuery();
                for (String value : values) {
                	if (StringUtils.isNotBlank(value)) {
                    	if(value.startsWith("-")) {
                    		bq.mustNot(QueryBuilders.termQuery(field, value.substring(1)));
                    	}else{
                    		bq.should(QueryBuilders.termQuery(field, value));
                    		facetSet.add(value);
                    	}
                    }
                }
                base.filter(bq);
            }
        }
        
        EsSearchResult<Book> baseResult;
        //画像検索
        if (!CollectionUtils.isEmpty(q.image)) {
        	VectorSearchRequest req=new VectorSearchRequest();
            Illustration i = is.get(q.image.get(0));
            req.vector=Floats.asList(i.feature);req.size=200;
            Map<String, Float> map = vss.search(req);
            List<String> pids = map.keySet().stream().map(key -> key.split("_")[0]).distinct().collect(Collectors.toList());
            IdsQueryBuilder idq = QueryBuilders.idsQuery();

            for (String value : pids) {
                idq.addIds(value);
            }
            base.must(idq);
            ssb.query(base);
            ssb.from(0);
            ssb.size(1000);

            baseResult = searchwithhighlights(ssb, Arrays.asList("contents"));
            Map<String, Book> bookMap = baseResult.list.stream().collect(Collectors.toMap(b -> b.id, b -> b));

            Map<String, Score> scores = new HashMap<>();
            for (String key : map.keySet()) {
                String pid = key.split("_")[0];
                if (bookMap.get(pid) != null) {
                    Score s = scores.computeIfAbsent(pid, kk -> new Score(kk));
                    s.score += 1 / (map.get(key) + 0.0001);
                }
            }
            List<Score> scoreList = new ArrayList<>(scores.values());
            Collections.sort(scoreList);

            List<Score> subList = scoreList.subList(q.from, Math.min(q.from + q.size, scoreList.size()));
            baseResult.from = q.from;
            baseResult.list = subList.stream().map(score -> bookMap.get(score.id)).collect(Collectors.toList());

            baseResult.list.forEach(book -> {
                book.illustrations = map.keySet().stream().filter(id -> id.startsWith(book.id)).collect(Collectors.toList());
            });
        }else {//キーワード検索
        	if (!MapUtils.isEmpty(q.filter)) {
	            for (String field : q.filter.keySet()) {
	                List<String> values = q.filter.get(field);
	                BoolQueryBuilder bq = QueryBuilders.boolQuery();
	                for (String value : values) {
	                    if (StringUtils.isNotBlank(value)) {
	                        bq.should(QueryBuilders.termQuery(field, value));
	                    }
	                }
	                base.filter(bq);
	            }
	        }
	        if(Objects.equals(q.searchfield,"contentonly")) {
	        	log.info("contentonly");
	        	if (!CollectionUtils.isEmpty(q.keyword)) {
		            BoolQueryBuilder kwq = EsSearchQuery.createKeywordBoolQuery(q.keyword, Arrays.asList("contents"), q.keywordOR);
		            IdsQueryBuilder idq = QueryBuilders.idsQuery();//IDクエリー
		            idq.boost(10);
		            for (String value : q.keyword) {
		                idq.addIds(value);
		            }
		            BoolQueryBuilder keywordsOrId = QueryBuilders.boolQuery();
		            if (kwq.hasClauses()) {
		                keywordsOrId.should(kwq);
		            }
		            keywordsOrId.should(idq);
		            base.must(keywordsOrId);
		        }
		        ssb.query(base);
		        baseResult =searchwithhighlights(ssb, Arrays.asList("contents"));
	        }else if(Objects.equals(q.searchfield,"metaonly")){
	        	//メタデータに対するキーワード検索
	        	log.info("metaonly");
	        	if (!CollectionUtils.isEmpty(q.keyword)) {
		            BoolQueryBuilder kwq = EsSearchQuery.createKeywordBoolQuery(q.keyword, Arrays.asList("title", "index", "responsibility"), q.keywordOR);
		
		            IdsQueryBuilder idq = QueryBuilders.idsQuery();//IDクエリー
		            idq.boost(10);
		            for (String value : q.keyword) {
		                idq.addIds(value);
		            }
		
		            BoolQueryBuilder keywordsOrId = QueryBuilders.boolQuery();
		            if (kwq.hasClauses()) {
		                keywordsOrId.should(kwq);
		            }
		            keywordsOrId.should(idq);
		            base.must(keywordsOrId);
		        }
		        ssb.query(base);
		        baseResult =searchwithhighlights(ssb, Arrays.asList("index"));
	        }else {
	        	log.info("content and meta");
	        	//本文+メタデータに対するキーワード検索
		        if (!CollectionUtils.isEmpty(q.keyword)) {
		            BoolQueryBuilder kwq = EsSearchQuery.createKeywordBoolQuery(q.keyword, Arrays.asList("title", "contents", "responsibility","index"), q.keywordOR);
		            IdsQueryBuilder idq = QueryBuilders.idsQuery();//IDクエリー
		            idq.boost(10);
		            for (String value : q.keyword) {
		                idq.addIds(value);
		            }
		
		            BoolQueryBuilder keywordsOrId = QueryBuilders.boolQuery();
		            if (kwq.hasClauses()) {
		                keywordsOrId.should(kwq);
		            }
		            keywordsOrId.should(idq);
		
		            base.must(keywordsOrId);
		        }
		        ssb.query(base);
		        baseResult =searchwithhighlights(ssb, Arrays.asList("contents","index"));
	        }
        }
        Map<String,ItemFacet> facets = new LinkedHashMap<>();
        baseResult.from = q.from;
        baseResult.searchResponse.getAggregations().forEach(agg -> {
        	Terms terms = (Terms) agg;
        	String field = agg.getName();
        	ItemFacet facet = facets.get(field);
        	if (facet == null) {
                facet = new ItemFacet();
                facet.field= field;
                facets.put(field, facet);
        	}
        	for (Terms.Bucket b : terms.getBuckets()) {
        		String key = b.getKeyAsString();
        		long count = b.getDocCount();
        		facet.addCount(key, count);
        	}
        });
        baseResult.facets = new ArrayList<>(facets.values());
        return baseResult;
    }

}
