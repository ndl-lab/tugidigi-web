package jp.go.ndl.lab.back.service;

import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Illustration;
import jp.go.ndl.lab.back.domain.ItemFacet;
import jp.go.ndl.lab.back.domain.Illustration.taginfo;
import jp.go.ndl.lab.back.infra.EsDataStore;
import jp.go.ndl.lab.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.back.infra.EsSearchQuery;
import jp.go.ndl.lab.back.infra.EsSearchResult;
import jp.go.ndl.lab.back.service.BookService.Score;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.IdsQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.functionscore.ScoreFunctionBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.primitives.Floats;

@Service
public class IllustService {
	@Autowired
    private VectorSearchServiceValdImpl vss;
	
    public final EsDataStore<Illustration> illustStore;
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
    
    public IllustService(EsDataStoreFactory storeFactory) {
        illustStore = storeFactory.build(Illustration.class);
    }

    public Illustration get(String id) {
        return illustStore.get(id);
    }
    public EsSearchResult<Illustration> search(SearchSourceBuilder ssb) {
        return illustStore.search(ssb);
    }
    
    //クエリを渡すとファセットを作れる
    public EsSearchResult<Illustration> search(EsSearchQuery q) {
    	SearchSourceBuilder ssb = q.createSearchSource();
    	BoolQueryBuilder base = QueryBuilders.boolQuery();
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
                    	}
                    }
                }
                base.filter(bq);
            }
        }
        //ファセットのアグリゲーション
        for (String field : new String[]{"graphictags.tagname"}) {
            TermsAggregationBuilder termFacetAgg = AggregationBuilders.terms(field);
            termFacetAgg.size(10);
            termFacetAgg.field(field);
            ssb.aggregation(termFacetAgg);
        }
        ssb.postFilter(base);
        EsSearchResult<Illustration> baseResult = illustStore.search(ssb);
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
        return baseResult;
    }
    
    //挿絵単位画像検索。画像がない場合はタイトルキーワード検索。どっちもない場合はランダム検索。(ファセットとフィルタとソート)
    public EsSearchResult<Illustration> searcheachimage(EsSearchQuery q) {
        SearchSourceBuilder ssb = new SearchSourceBuilder();
        BoolQueryBuilder base = QueryBuilders.boolQuery();
        Map<String, Float> featureDistanceMap=new HashMap<>();
        ssb.from(0);
        ssb.size(200);
        //画像検索
        //Arrays.stream(feature.split(",")).map(s -> Float.parseFloat(s)).collect(Collectors.toList());
        if(!CollectionUtils.isEmpty(q.image)||q.imagefeature!=null) {
        	VectorSearchRequest req=new VectorSearchRequest();
	         if (!CollectionUtils.isEmpty(q.image)) {
	            Illustration i = get(q.image.get(0));
            	req.vector=Floats.asList(i.feature);req.size=200;
	        	featureDistanceMap = vss.search(req);
	        }else if(q.imagefeature!=null) {
	        	req.vector=Floats.asList(q.imagefeature);req.size=200;
	        	featureDistanceMap = vss.search(req);
	        }
	        List<String> imageids = featureDistanceMap.keySet().stream().map(key -> key).distinct().collect(Collectors.toList());
	        IdsQueryBuilder idq = QueryBuilders.idsQuery();
	
	        for (String value : imageids) idq.addIds(value);
	        base.must(idq);
        }else if(!CollectionUtils.isEmpty(q.keyword)) {
        	BoolQueryBuilder kwq = EsSearchQuery.createKeywordBoolQuery(q.keyword, Arrays.asList("title"), q.keywordOR);
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
        }else {//ランダム検索
        	QueryBuilder qb = QueryBuilders.functionScoreQuery(QueryBuilders.matchAllQuery(), ScoreFunctionBuilders.randomFunction());
        	base.must(qb);
        	if(q.size!=null)ssb.size(q.size);
        }
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
        
        //ファセットのアグリゲーション
        for (String field : new String[]{"graphictags.tagname"}) {
            TermsAggregationBuilder termFacetAgg = AggregationBuilders.terms(field);
            termFacetAgg.size(10);
            termFacetAgg.field(field);
            ssb.aggregation(termFacetAgg);
        }
        ssb.query(base);
        
        //ここで検索
        EsSearchResult<Illustration> baseResult = search(ssb);
        
        
        Map<String, Score> scores = new HashMap<>();
        Map<String, Illustration> illustMap = baseResult.list.stream().collect(Collectors.toMap(b -> b.id, b -> b));
        Boolean sortSetFlag=false;
        
        if(featureDistanceMap.isEmpty()||(q.sort!=null&&!q.sort.isEmpty()&&q.sort.contains("confidence"))) {//確信度ベースでソート
        	for (String key :  illustMap.keySet()) {
	            if (illustMap.get(key) != null) {
	                Score s = scores.computeIfAbsent(key, kk -> new Score(kk));
	                for(taginfo tag:illustMap.get(key).graphictags) {
	                	if(filterSet.contains(tag.tagname)||facetSet.contains(tag.tagname)) {
	                		if(!sortSetFlag) {
	                			s.score =1 / (tag.confidence + 0.0001);
	                		}else {
	                			s.score=Math.min(s.score, 1 / (tag.confidence + 0.0001));
	                		}
	                		sortSetFlag=true;
	                	}
	                }
	            }
        	}
        }else{//類似度ベースでソート
	        for (String key :illustMap.keySet()) {
	            if (illustMap.get(key) != null) {
	                Score s = scores.computeIfAbsent(key, kk -> new Score(kk));
	                s.score =1 / (featureDistanceMap.get(key) + 0.0001);
	            }
	        }
        }
        List<Score> scoreList = new ArrayList<>(scores.values());
        Collections.sort(scoreList);
        List<Score> subList = scoreList.subList(q.from, Math.min(q.from + q.size, scoreList.size()));
        baseResult.from = q.from;
        baseResult.list = subList.stream().map(score -> illustMap.get(score.id)).collect(Collectors.toList());
        //ファセットをマージする
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
        return baseResult;
    }

}

