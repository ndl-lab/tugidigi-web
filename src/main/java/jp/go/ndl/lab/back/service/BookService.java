package jp.go.ndl.lab.back.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import jp.go.ndl.lab.back.domain.ItemFacet;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Book.keywordcounter;
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
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.atilika.kuromoji.ipadic.Token;
import com.atilika.kuromoji.ipadic.Tokenizer;
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
    
    @Autowired
    private PageService pageService;

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
        if(result!=null&&result.searchResponse!=null)for (SearchHit hit : result.searchResponse.getHits()) {
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
    public EsSearchResult<Book> searchwithouthighlights(SearchSourceBuilder ssb) {
    	EsSearchResult<Book> result = bookStore.search(ssb);
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
    public EsSearchResult<Book> ngramsearch(EsSearchQuery q) {
    	SearchSourceBuilder ssb = new SearchSourceBuilder();
        ssb.from(0);
        ssb.size(q.size);
        BoolQueryBuilder base = QueryBuilders.boolQuery();
        if(q.range!=null&&!q.range.isEmpty()){
        	for (String field : q.range.keySet()) {
                BoolQueryBuilder rangeBool = QueryBuilders.boolQuery();
                q.range.get(field).forEach(r -> {
                    RangeQueryBuilder rqb = QueryBuilders.rangeQuery(field);
                    rqb.from(r.from);
                    rqb.to(r.to);
                    rangeBool.should(rqb);
                });
                if (rangeBool.hasClauses()) {
                	base.must(rangeBool);
                }
            }
        }
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
	    for (String field : new String[]{"publishyear"}) {
	    	TermsAggregationBuilder termFacetAgg = AggregationBuilders.terms(field);
	    	termFacetAgg.size(3000);
	    	termFacetAgg.field(field);
	    	ssb.aggregation(termFacetAgg);
        }
        ssb.postFilter(base);
        ssb.trackTotalHits(true);
        EsSearchResult<Book> result = bookStore.search(ssb);
        result.from = q.from;
        result.list= Collections.EMPTY_LIST;
        Map<String,ItemFacet> facets = new LinkedHashMap<>();
        result.searchResponse.getAggregations().forEach(agg -> {
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
        		if(key.equals("0"))continue;
        		long count = b.getDocCount();
        		facet.addCount(key, count);
        	}
        });
        result.facets = new ArrayList<>(facets.values());
        return result;
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
        if(q.sort!=null&&!q.sort.isEmpty()) {
        	String[] ss = q.sort.get(0).split(":");
        	ssb.sort(ss[0], SortOrder.fromString(ss[1]));
        }
        //年代レンジクエリ
        BoolQueryBuilder base = QueryBuilders.boolQuery();
        if(q.range!=null&&!q.range.isEmpty()){
        	for (String field : q.range.keySet()) {
                BoolQueryBuilder rangeBool = QueryBuilders.boolQuery();
                q.range.get(field).forEach(r -> {
                    RangeQueryBuilder rqb = QueryBuilders.rangeQuery(field);
                    rqb.from(r.from);
                    rqb.to(r.to);
                    rangeBool.should(rqb);
                });
                if (rangeBool.hasClauses()) {
                	base.must(rangeBool);
                }
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
            if(Objects.equals(q.withouthighlight,"true"))baseResult = searchwithouthighlights(ssb);
	        else baseResult = searchwithhighlights(ssb, Arrays.asList("contents"));
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
            Map<String,ItemFacet> facets = new LinkedHashMap<>();
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
		        if(Objects.equals(q.withouthighlight,"true"))baseResult = searchwithouthighlights(ssb);
		        else baseResult = searchwithhighlights(ssb, Arrays.asList("contents"));
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
		        if(Objects.equals(q.withouthighlight,"true"))baseResult = searchwithouthighlights(ssb);
		        else baseResult = searchwithhighlights(ssb, Arrays.asList("index"));
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
		        if(Objects.equals(q.withouthighlight,"true"))baseResult = searchwithouthighlights(ssb);
		        else baseResult = searchwithhighlights(ssb, Arrays.asList("contents","index"));
	        }
        }
        
        baseResult.from = q.from;
        baseResult.list.forEach(res->{       
        	res.contents=null;
        	res.index=null;
        });
        return baseResult;
    }
    class IntegerMapComparator implements Comparator<String> {
        private Map<String, Integer> map;
        public IntegerMapComparator(Map<String, Integer>  map) {
            this.map = map;
        }
        /** key 2つが与えられたときに、その value で比較 */
        public int compare(String key1, String key2) {
            // value を取得
            int value1 = map.get(key1);
            int value2 = map.get(key2);
            // value の降順, valueが等しいときは key の辞書順
            if(value1 == value2)
                return key1.toLowerCase().compareTo(key2.toLowerCase());
            else if(value1 < value2)
                return 1;
            else
                return -1;
        }
    }

    public Book GetMetrics(String id) {
    	Book book=bookStore.get(id);
    	if(book.contents==null)return book;
    	book.contents=null;
    	EsSearchResult<Page> ps=pageService.getAllPage(id);
    	for(Page page:ps.list) {
    		String contenttext=page.contents;
    		int pagenum=page.page;
	    	Tokenizer tokenizer = new Tokenizer() ;
	        List<Token> tokens = tokenizer.tokenize(contenttext);
	        Map<String, Integer> countMap = new HashMap<>();
	        List<String>keywordslist=new ArrayList<String>();
	        for (Token token : tokens) {
	        	String keyword=token.getSurface() ;
	        	keywordslist.add(keyword);
	        }
	        for(int offset=1;offset<=5;offset++) {
	        	for(int i=0;i<=keywordslist.size()-offset;i++) {
	        		String contentkeyword=String.join(" ", keywordslist.subList(i,i+offset));
	        		if (countMap.containsKey(contentkeyword)) {
	                    int count =countMap.get(contentkeyword) + 1;
	                    countMap.put(contentkeyword, count);
	                } else {
	                	countMap.put(contentkeyword, 1);
	                }
	        	}
	        }
	        
	        TreeMap<String, Integer> treeMap =
	                new TreeMap<String, Integer>(new IntegerMapComparator(countMap));
	        treeMap.putAll(countMap);
	        Set<String> termSet = treeMap.keySet();  // ソートされている
	        Iterator<String> iterator = termSet.iterator();
	        int counter=0;
	        while(iterator.hasNext()) {
	        	if(counter>=20)break;
	        	counter++;
	            String key = iterator.next();
	            int value = treeMap.get(key);
	            book.keywordsmetrics.add(new keywordcounter(key,value));
	        }
    	}
    	return book;
    }
}
