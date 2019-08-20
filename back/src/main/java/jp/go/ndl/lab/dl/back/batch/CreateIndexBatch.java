package jp.go.ndl.lab.dl.back.batch;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import jp.go.ndl.lab.dl.back.Application;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * ElasticSearchのIndexを初期化するバッチ
 *
 */
@Slf4j
@Component("create-index")
@Profile({Application.MODE_BATCH})
@Lazy
public class CreateIndexBatch extends AbstractBatch {

    public RestClient restClient;
    public RestHighLevelClient highClient;

    public CreateIndexBatch(@Value("${es.host}") String host, @Value("${es.port}") int port, @Value("${es.path}") String path) {
        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, "http")).setMaxRetryTimeoutMillis(100000).setRequestConfigCallback(c -> {
            return c.setConnectTimeout(5000).setSocketTimeout(60000);
        });
        if (StringUtils.isNotBlank(path)) {
            builder.setPathPrefix(path);
        }
        restClient = builder.build();
        highClient = new RestHighLevelClient(builder);
    }

    private String issueDelete(String command) throws Exception {
        log.info("DELETE {}", command);
        Response r = restClient.performRequest(
                "DELETE",
                "/" + command);
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    private String issue(String method, String path, Path commandFile) throws Exception {
        List<String> file = Files.readAllLines(commandFile, StandardCharsets.UTF_8);
        HttpEntity entity = new NStringEntity(String.join("", file), ContentType.APPLICATION_JSON);
        Response r = restClient.performRequest(
                method,
                "/" + path,
                Collections.<String, String>emptyMap(), entity);
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    private Path base = Paths.get("config", "index");

    @Override
    public void run(String[] params) {
        try {
            if (params[0].equals("all")) {
                createAllIndex();
            } else {
                createIndex(params[0], base.resolve(params[0] + ".json"), true);
            }
        } catch (Exception e) {
            log.error("{}", e);
        }

    }

    private void createAllIndex() throws IOException {
        try {
            log.info("try delete all");
            issueDelete("jd*");
        } catch (Exception e) {
            log.error("{}", e);
        }
        Files.list(base).forEach(path -> {
            try {
                createIndex(path.getFileName().toString().replace(".json", ""), path, false);
            } catch (Exception ex) {
                log.error("error {} {}", path);
                log.error("", ex);
            }
        });
    }

    private void createIndex(String indexName, Path file, boolean delete) {
        try {
            if (delete) {
                log.info("try delete {}", indexName);
                issueDelete(indexName);
            }
        } catch (Exception e) {
//            log.error("{}", e);
        }
        try {
            log.info("try create {}", indexName);
            String result = issue("PUT", indexName, file);
            log.info("{}->{}", file, result);
        } catch (Exception e) {
            log.error("{}", e);
        }
    }

}
