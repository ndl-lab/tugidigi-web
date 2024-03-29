package jp.go.ndl.lab.back.infra;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.GeoDistanceQueryBuilder;
import org.elasticsearch.index.query.MatchPhraseQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.util.MultiValueMap;

@Data
@Slf4j
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EsSearchQuery {

    @ToString
    public static class Range {

        public String from;
        public String to;

        public Range() {
        }

        public Range(String from, String to) {
            this.from = from;
            this.to = to;
        }

        public static Range parse(String expression) {
            String[] split = expression.split(",", 2);
            if (split.length >= 2) {
                return new Range(split[0].trim(), split[1].trim());
            }
            return null;
        }
    }

    @ToString
    public static class GeoDistance {

        public double lat;
        public double lon;
        public String distance;

        public GeoDistance() {
        }

        public GeoDistance(double lat, double lon, String distance) {
            this.lat = lat;
            this.lon = lon;
            this.distance = distance;
        }

        public static GeoDistance parse(String expression) {
            String[] split = expression.split(",");
            if (split.length >= 3) {
                return new GeoDistance(NumberUtils.toDouble(split[0]), NumberUtils.toDouble(split[1].trim()), split[2].trim());
            }
            return null;
        }

    }

    public Integer from;
    public Integer size;
    public String searchfield;
    public String withouthighlight;
    public String keyword2vec;

    public List<String> keyword;
    public List<String> image;
    
    public float[] imagefeature;
    public float[] imagefeature_txt2vec;
    public boolean keywordOR = false;

    public Map<String, List<String>> query;

    public void addQuery(String key, String... words) {
        if (query == null) {
            query = new HashMap<>();
        }
        List<String> list = query.computeIfAbsent(key, k -> new ArrayList<>());
        for (String w : words) {
            list.add(w);
        }
    }

    public void addFilter(String key, String... words) {
        if (filter == null) {
            filter = new HashMap<>();
        }
        List<String> list = filter.computeIfAbsent(key, k -> new ArrayList<>());
        for (String w : words) {
            list.add(w);
        }
    }

    public Map<String, List<Range>> range;
    public Map<String, List<GeoDistance>> geoDistance;//filter only
    public List<String> exists;

    public Map<String, List<String>> filter;

    public Map<String, List<String>> facet;

    public List<String> sort;

    @JsonIgnore
    public boolean isEmpty() {
        return CollectionUtils.isEmpty(keyword)
                && CollectionUtils.isEmpty(sort)
                && CollectionUtils.isEmpty(exists)
                && MapUtils.isEmpty(query)
                && MapUtils.isEmpty(range)
                && MapUtils.isEmpty(geoDistance)
                && MapUtils.isEmpty(facet)
                && MapUtils.isEmpty(filter);
    }

    private static int SIZE_MAX = 1000;
    private static int SIZE_MIN = 0;

    public static EsSearchQuery readQuery(MultiValueMap<String, String> query) {
    	//log.info("Input Query:{}",query);
        EsSearchQuery esq = new EsSearchQuery();
        esq.from = NumberUtils.toInt(query.getFirst("from"));
        esq.size = NumberUtils.toInt(query.getFirst("size"));
        if (esq.size == 0) esq.size = 20;
        esq.sort = query.get("sort");
        esq.keyword = query.get("keyword");
        esq.keyword2vec=query.getFirst("keyword2vec");
        esq.searchfield = query.getFirst("searchfield");
        esq.withouthighlight = query.getFirst("withouthighlight");
        esq.image = query.get("image");
        esq.exists = query.get("exists");
        
        esq.keywordOR = getBoolean(query, "keywordOr");

        esq.range = new LinkedHashMap<>();
        esq.query = new LinkedHashMap<>();
        esq.filter = new LinkedHashMap<>();
        esq.facet = new LinkedHashMap<>();
        esq.geoDistance = new LinkedHashMap<>();
        for (String key : query.keySet()) {
            if (key.startsWith("q-")) {
                List<String> values = query.get(key);
                String trueKey = key.replace("q-", "");
                esq.query.put(trueKey, values);
            }
            if (key.startsWith("r-")) {
                List<String> values = query.get(key);
                String trueKey = key.replace("r-", "");
                esq.range.put(trueKey, values.stream().map(v -> Range.parse(v)).filter(v -> v != null).collect(Collectors.toList()));
            }
            if (key.startsWith("f-")) {
                List<String> values = query.get(key);
                String trueKey = key.replace("f-", "");
                esq.filter.put(trueKey, values);
            }
            if (key.startsWith("fc-")) {
                List<String> values = query.get(key);
                String trueKey = key.replace("fc-", "");
                esq.facet.put(trueKey, values);
            }
            if (key.startsWith("g-")) {
                List<String> values = query.get(key);
                String trueKey = key.replace("g-", "");
                esq.geoDistance.put(trueKey, values.stream().map(v -> GeoDistance.parse(v)).filter(v -> v != null).collect(Collectors.toList()));
            }
        }
        
        return esq;
    }

    public static boolean getBoolean(MultiValueMap<String, String> query, String key) {
        List<String> strs = query.get(key);
        if (CollectionUtils.isEmpty(strs)) {
            return false;
        }
        return Boolean.parseBoolean(strs.get(0));
    }

    public String getFirstQuery(String key) {
        List<String> strs = query.get(key);
        if (CollectionUtils.isEmpty(strs)) {
            return null;
        }
        return strs.get(0);
    }

    /**
     * Item以外のDomainを検索するSearchSourceを生成する
     *
     * @param additionalQuery 追加クエリ（filterで接続）
     * @return
     */
    public SearchSourceBuilder createSearchSource(QueryBuilder... additionalQueries) {
        SearchSourceBuilder ssb = new SearchSourceBuilder();
        ssb.from(from == null ? 0 : from);
        ssb.size(size == null ? 10 : size);
        BoolQueryBuilder base = QueryBuilders.boolQuery();
        ssb.query(base);

        //キーワード入力は、keywordsないしはIDのいずれかでHit
        if (!CollectionUtils.isEmpty(keyword)) {
            BoolQueryBuilder kwq = EsSearchQuery.createKeywordBoolQuery(keyword, Arrays.asList("keywords"), keywordOR);
            base.must(kwq);
        }

        if (!MapUtils.isEmpty(query)) {
            for (String field : query.keySet()) {
                List<String> values = query.get(field);
                BoolQueryBuilder bq = QueryBuilders.boolQuery();
                for (String value : values) {
                    if (StringUtils.isNotBlank(value)) {
                        if (value.startsWith("-")) {
                            MatchQueryBuilder mqb = QueryBuilders.matchQuery(field, value.replaceFirst("-", ""));
                            mqb.operator(Operator.AND);
                            bq.mustNot(mqb);
                        } else {
                            MatchQueryBuilder mqb = QueryBuilders.matchQuery(field, value);
                            mqb.operator(Operator.AND);
                            bq.must(mqb);
                        }
                    }
                }
                if (bq.hasClauses()) {
                    base.must(bq);
                }
            }
        }

        if (!MapUtils.isEmpty(range)) {
            for (String field : range.keySet()) {
                BoolQueryBuilder rangeBool = QueryBuilders.boolQuery();
                range.get(field).forEach(r -> {
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

        if (!MapUtils.isEmpty(geoDistance)) {
            for (String field : geoDistance.keySet()) {
                BoolQueryBuilder geoBool = QueryBuilders.boolQuery();
                geoDistance.get(field).forEach(g -> {
                    GeoDistanceQueryBuilder gdqb = QueryBuilders.geoDistanceQuery(field);
                    gdqb.distance(g.distance);
                    gdqb.point(g.lat, g.lon);
                    geoBool.should(gdqb);
                });
                if (geoBool.hasClauses()) {
                    base.filter(geoBool);
                }
            }
        }

        if (!MapUtils.isEmpty(filter)) {
            for (String field : filter.keySet()) {
                List<String> values = filter.get(field);
                BoolQueryBuilder bq = QueryBuilders.boolQuery();
                for (String value : values) {
                    if (StringUtils.isNotBlank(value)) {
                    	if(value.startsWith("-")) {
                    		bq.mustNot(QueryBuilders.termQuery(field, value.substring(1)));
                    	}else {
                    		bq.should(QueryBuilders.termQuery(field, value));
                    	}
                    }
                }
                base.filter(bq);
            }
        }
        if (additionalQueries != null) {
            for (QueryBuilder qb : additionalQueries) {
                base.filter(qb);
            }
        }
        if (sort != null) {
            sort.forEach(s -> {
                try {
                    String[] ss = s.split(":");
                    ssb.sort(ss[0], SortOrder.fromString(ss[1]));
                } catch (Exception e) {
//                    log.error("{}", e);
                }
            });
        }
        //log.info("ES Query:{}", ssb);
        return ssb;
    }

    public static BoolQueryBuilder createKeywordBoolQuery(List<String> keywords, List<String> keywordFields, boolean keywordOR) {
        BoolQueryBuilder keywordsBq = QueryBuilders.boolQuery();
        if (!CollectionUtils.isEmpty(keywords) && !CollectionUtils.isEmpty(keywordFields)) {
            for (String keyword : keywords) {
                BoolQueryBuilder keywordBq = QueryBuilders.boolQuery();
                if (!StringUtils.isBlank(keyword)) {
                    boolean isNotKeyword = keyword.startsWith("-");
                    if (isNotKeyword) {
                        keyword = keyword.replaceFirst("-", "");
                    }
                    for (String keywordField : keywordFields) {
                        if (isNotKeyword) {
                            MatchQueryBuilder mqb = QueryBuilders.matchQuery(keywordField, keyword);
                            mqb.operator(Operator.AND);
                            keywordBq.mustNot(mqb);
                        } else {
                            MatchPhraseQueryBuilder mqb = QueryBuilders.matchPhraseQuery(keywordField, keyword);
                            keywordBq.should(mqb);
                        }
                    }
                    if (isNotKeyword && keywordOR) {
                        //OR検索では-キーワードは無視される
                    } else if (keywordOR) {
                        keywordsBq.should(keywordBq);
                    } else {
                        keywordsBq.must(keywordBq);
                    }
                }
            }

        }
        return keywordsBq;
    }

    public SearchSourceBuilder createSearchSource() {
        return this.createSearchSource(null);
    }

}
