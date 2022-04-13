package jp.go.ndl.lab.back.batch;

import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.tools.GenericEsClient;
import jp.go.ndl.lab.common.utils.LabFileUtils;
import lombok.extern.slf4j.Slf4j;

import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.reindex.DeleteByQueryRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component("restore-data")
@Profile({Application.MODE_BATCH})
@Lazy
public class RestoreDataBatch extends AbstractBatch {

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, "restore-data", "ignore\\data0801\\es-check", "jps_collecting", "200816");
    }

    @Autowired
    GenericEsClient esClient;

    @Override
    public void run(String[] params) {
        foolProof(params[3]);
        Path inputDir = Paths.get(params[0]);
        String indexName = params[1];
        Boolean clearflag=Boolean.parseBoolean(params[2]);
        try {
            if (indexName.equals("all")) {
                restoreAll(inputDir,clearflag);
            } else {
                restore(indexName, inputDir.resolve(indexName + ".jsonl.gz"),clearflag);
            }
        } catch (IOException ex) {
            log.error("{}", ex);
        }
    }

    private void restore(String indexName, Path jsonl,Boolean clearflag) throws IOException {
        log.info("index {}", indexName);
//        Request r = new Request("PUT", "_all/_settings");
//        r.setJsonEntity("{\"index.blocks.read_only_allow_delete\": null}");
//        esClient.restClient.performRequest(r);
        if(clearflag)esClient.highClient.deleteByQuery(new DeleteByQueryRequest(indexName).setQuery(QueryBuilders.matchAllQuery()), RequestOptions.DEFAULT);
        int count = 0;
        try (LabFileUtils.DataReader reader = LabFileUtils.gDataReader(jsonl)) {
            Map<String, String> idJsonMap = new HashMap<>();
            for (String[] data : reader) {
                String id = data[0];
                String json = data[1];
                idJsonMap.put(id, json);
                count++;
                if (idJsonMap.size() == 100) {
                    esClient.bulkIndex(indexName, idJsonMap);
                    idJsonMap.clear();
                    log.info(" count {}", count);
                }
            }
            if (!idJsonMap.isEmpty())
                esClient.bulkIndex(indexName, idJsonMap);
            log.info(" total {}", count);
        } catch (Exception e) {
            log.error("{}", e);
        }
    }

    private void restoreAll(Path inputDir,Boolean clearflag) throws IOException {
        for (Path jsonl : Files.list(inputDir).collect(Collectors.toList())) {
            String indexName = jsonl.getFileName().toString().replace(".jsonl.gz", "");
            restore(indexName, jsonl,clearflag);
        }
    }

}
