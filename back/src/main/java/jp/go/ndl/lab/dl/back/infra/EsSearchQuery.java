package jp.go.ndl.lab.dl.back.infra;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchPhraseQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
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

    public Integer from;
    public Integer size;

    public List<String> keyword;
    public List<String> image;
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

    public Map<String, List<String>> filter;

    public Map<String, List<String>> facet;

    public List<String> sort;

    @JsonIgnore
    public boolean isEmpty() {
        return CollectionUtils.isEmpty(keyword)
                && CollectionUtils.isEmpty(sort)
                && MapUtils.isEmpty(query)
                && MapUtils.isEmpty(facet)
                && MapUtils.isEmpty(filter);
    }

    private static int SIZE_MAX = 1000;
    private static int SIZE_MIN = 0;

    public static EsSearchQuery readQuery(MultiValueMap<String, String> query) {
        EsSearchQuery esq = new EsSearchQuery();
        esq.from = NumberUtils.toInt(query.getFirst("from"));
        esq.size = NumberUtils.toInt(query.getFirst("size"));
        if (esq.size == 0) esq.size = 20;
        esq.sort = query.get("sort");
        esq.keyword = query.get("keyword");
        esq.image = query.get("image");

        esq.keywordOR = getBoolean(query, "keywordOr");

        esq.query = new LinkedHashMap<>();
        esq.filter = new LinkedHashMap<>();
        esq.facet = new LinkedHashMap<>();
        for (String key : query.keySet()) {
            if (key.startsWith("q-")) {
                List<String> values = query.get(key);
                String trueKey = key.replace("q-", "");
                esq.query.put(trueKey, values);
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
        }
        log.info("Input Query:{}", esq);
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

        if (!MapUtils.isEmpty(filter)) {
            for (String field : filter.keySet()) {
                List<String> values = filter.get(field);
                BoolQueryBuilder bq = QueryBuilders.boolQuery();
                for (String value : values) {
                    if (StringUtils.isNotBlank(value)) {
                        bq.should(QueryBuilders.termQuery(field, value));
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
        log.info("ES Query:{}", ssb);
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
