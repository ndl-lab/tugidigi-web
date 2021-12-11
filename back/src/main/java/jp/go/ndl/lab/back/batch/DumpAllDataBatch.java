package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.*;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.back.tools.GenericEsClient;
import jp.go.ndl.lab.common.utils.LabFileUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * ElasticSearchの全データをダンプするバッチ。version情報は失われる。
 */
@Slf4j
@Component("dump-data")
@Profile({Application.MODE_BATCH})
@Lazy
public class DumpAllDataBatch extends AbstractBatch {

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, "dump-data", "ignore\\dump0814", "nonitem");
    }

    @Autowired
    GenericEsClient esClient;

    private ObjectMapper mapper = new ObjectMapper();
    private Path outputDir;

    @Override
    public void run(String[] params) {

        outputDir = Paths.get(params[0]);
        if (!Files.exists(outputDir)) {
            try {
                Files.createDirectories(outputDir);
            } catch (IOException ex) {
                log.error("出力ディレクトリ作成失敗", ex);
            }
        }
        String index = params[1];

        try {
            if (index.equals("all")) {
                dumpAll();
            } else {
                dump(index);
            }
        } catch (Exception e) {
            log.error("{}", e);
        }
    }

    private void dumpAll() throws Exception {
        dump("jd_book");
        dump("jd_illustration");
        dump("jd_page");
    }

    private void dump(String indexName) throws IOException {
        log.info("start dump index {}", indexName);
        
        int count = 0;

        Path outputFile = outputDir.resolve(indexName + ".jsonl.gz");

        final Scroll scroll = new Scroll(TimeValue.timeValueMinutes(1L));
        SearchRequest searchRequest = new SearchRequest(indexName);
        searchRequest.scroll(scroll);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        searchRequest.source(searchSourceBuilder);

        SearchResponse searchResponse = esClient.highClient.search(searchRequest, RequestOptions.DEFAULT);
        String scrollId = searchResponse.getScrollId();
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        try (LabFileUtils.Writer bw = LabFileUtils.gWriter(outputFile)) {
            //1回目書き出し
            for (SearchHit hit : searchHits) {
                bw.writeDataV(hit.getId(), hit.getSourceAsString());
                count++;
            }
            //継続
            while (searchHits != null && searchHits.length > 0) {
                SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
                scrollRequest.scroll(scroll);
                searchResponse = esClient.highClient.scroll(scrollRequest, RequestOptions.DEFAULT);
                scrollId = searchResponse.getScrollId();
                searchHits = searchResponse.getHits().getHits();
                for (SearchHit hit : searchHits) {
                    bw.writeDataV(hit.getId(), hit.getSourceAsString());
                    if (++count % 100000 == 0) {
                        log.info(" count {}", count);
                    }
                }
            }
        } catch (Exception e) {
            log.error("書き込み失敗", e);
        }
        log.info(" total {}", count);

        ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
        clearScrollRequest.addScrollId(scrollId);
        ClearScrollResponse clearScrollResponse = esClient.highClient.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
    }
}
