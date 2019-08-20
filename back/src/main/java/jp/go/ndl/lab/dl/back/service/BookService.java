package jp.go.ndl.lab.dl.back.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jp.go.ndl.lab.dl.back.domain.Book;
import jp.go.ndl.lab.dl.back.domain.Illustration;
import jp.go.ndl.lab.dl.back.infra.EsDataStore;
import jp.go.ndl.lab.dl.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.dl.back.infra.EsSearchQuery;
import jp.go.ndl.lab.dl.back.infra.EsSearchResult;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.IdsQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public EsSearchResult<Book> search(SearchSourceBuilder ssb) {

        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.encoder("html");
        highlightBuilder.field(new HighlightBuilder.Field("contents"));
        highlightBuilder.fragmentSize(100);
        highlightBuilder.boundaryScannerLocale("ja-JP");
        highlightBuilder.numOfFragments(3);
        ssb.highlighter(highlightBuilder);

        EsSearchResult<Book> result = bookStore.search(ssb);

        //ハイライト処理
        int index = 0;
        for (SearchHit hit : result.searchResponse.getHits()) {
            Map<String, HighlightField> highlightFields = hit.getHighlightFields();
            HighlightField hf = highlightFields.get("contents");
            Book book = result.list.get(index++);
            if (hf == null) {
                book.highlights = Collections.EMPTY_LIST;
            } else {
                log.info("{}", hf);
                book.highlights = Arrays.stream(hf.fragments()).map(text -> text.string()).collect(Collectors.toList());
            }
        }

        return result;
    }

    @Autowired
    private VectorSearchService vss;

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
        BoolQueryBuilder base = QueryBuilders.boolQuery();
        ssb.query(base);

        //画像検索
        if (!CollectionUtils.isEmpty(q.image)) {

            Illustration i = is.get(q.image.get(0));
            Map<String, Double> map = vss.search(i.feature, 1000);
            List<String> pids = map.keySet().stream().map(key -> key.split("_")[0]).distinct().collect(Collectors.toList());
            IdsQueryBuilder idq = QueryBuilders.idsQuery();

            for (String value : pids) {
                idq.addIds(value);
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
            base.must(idq);

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
            ssb.from(0);
            ssb.size(1000);

            EsSearchResult<Book> baseResult = search(ssb);
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

            return baseResult;

        }

        if (!CollectionUtils.isEmpty(q.keyword)) {
            BoolQueryBuilder kwq = EsSearchQuery.createKeywordBoolQuery(q.keyword, Arrays.asList("title", "contents", "responsibility"), q.keywordOR);

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
        return search(ssb);

    }

}
