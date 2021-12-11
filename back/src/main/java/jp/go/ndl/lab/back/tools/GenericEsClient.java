package jp.go.ndl.lab.back.tools;

import com.fasterxml.jackson.core.JsonProcessingException;



import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class GenericEsClient {
	
    public RestClient restClient;
    public RestHighLevelClient highClient;
    private RestClientBuilder createClient(String endPoint) throws URISyntaxException {
        URI uri = new URI(endPoint);
        RestClientBuilder builder = RestClient.builder(new HttpHost(uri.getHost(), uri.getPort(), uri.getScheme())).setRequestConfigCallback(c -> c.setConnectTimeout(5000).setSocketTimeout((int) TimeUnit.MINUTES.toMillis(5)));
        if (StringUtils.isNotBlank(uri.getPath())) {
            builder.setPathPrefix(uri.getPath());
        }
        return builder;
    }
    public GenericEsClient(@Value("${es.endPoint}")String endPoint) {
    	try {
    		RestClientBuilder builder= createClient(endPoint);
    		restClient = builder.build();
            highClient = new RestHighLevelClient(builder);
        } catch (URISyntaxException e) {
            log.error("ElasticsearchのURLに誤りがあります", e);
        }
    }
    /*public GenericEsClient(@Value("${es.host}") String host, @Value("${es.port}") int port, @Value("${es.path}") String path) {
        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, "http")).setRequestConfigCallback(c -> {
            return c.setConnectTimeout(5000).setSocketTimeout(60000);
        });
        if (StringUtils.isNotBlank(path)) {
            builder.setPathPrefix(path);
        }
        restClient = builder.build();
        highClient = new RestHighLevelClient(builder);
    }*/

    public String issueGet(String command) throws Exception {
        log.info("GET {}", command);
        Response r = restClient.performRequest(new Request(
                "GET",
                "/" + command));
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    public String issuePut(String command) throws Exception {
        log.info("PUT {}", command);
        Response r = restClient.performRequest(new Request(
                "PUT",
                "/" + command));
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    public String issueDelete(String command) throws Exception {
        log.info("DELETE {}", command);
        Response r = restClient.performRequest(new Request(
                "DELETE",
                "/" + command));
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    /*
    1行目にパスとメソッド、二行目以降にJSONを記入した命令ファイルでコマンドを実行する
     */
    public String issue(String method, String path, String json) throws Exception {
    	Request req=new Request( method,"/" + path);
        HttpEntity entity = new NStringEntity(json, ContentType.APPLICATION_JSON);
        req.setEntity(entity);
        Response r = restClient.performRequest(req);
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    /*
    1行目にパスとメソッド、二行目以降にJSONを記入した命令ファイルでコマンドを実行する
     */
    public String issue(String method, String path, Path commandFile) throws Exception {
        List<String> file = Files.readAllLines(commandFile, StandardCharsets.UTF_8);
        Request req=new Request( method,"/" + path);
        HttpEntity entity = new NStringEntity(String.join("", file), ContentType.APPLICATION_JSON);
        req.setEntity(entity);
        Response r = restClient.performRequest(req);
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    /*
    1行目にパスとメソッド、二行目以降にJSONを記入した命令ファイルでコマンドを実行する
     */
    public String issue(Path commandFile) throws Exception {
        List<String> file = Files.readAllLines(commandFile, StandardCharsets.UTF_8);
        String[] order = file.get(0).split(" ");
        Response r = null;
        if (file.size() > 1) {
            file.remove(0);
            Request req=new Request(order[0],
                    "/" + order[1]);
            HttpEntity entity = new NStringEntity(String.join("", file), ContentType.APPLICATION_JSON);
            req.setEntity(entity);
            r = restClient.performRequest(req);
        } else {
        	Request req=new Request(order[0],
                    "/" + order[1]);
            r = restClient.performRequest(req);
        }
        String content = null;
        try (InputStream is = r.getEntity().getContent()) {
            content = IOUtils.toString(is, StandardCharsets.UTF_8);
        }
        return content;
    }

    public void deleteByQuery(String index, QueryBuilder queryBuilder) {
        try {
            String query = "{\"query\":" + org.elasticsearch.common.Strings.toString(queryBuilder, false, false) + "}";
            log.info("delete query: {}", query);
            HttpEntity entity = new NStringEntity(query, ContentType.APPLICATION_JSON);
            Request req=new Request("POST",
                    "/" + index + "/_delete_by_query");
            req.setEntity(entity);
            restClient.performRequest(req);
        } catch (JsonProcessingException ex) {
            log.error("", ex);
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    public void bulkIndex(String index, Map<String, String> idJsonMap) {
        BulkRequest bulkRequest = new BulkRequest();
        idJsonMap.forEach((k, v) -> {
            IndexRequest ir = new IndexRequest(index);
            ir.id(k);
            ir.source(v, XContentType.JSON);
            bulkRequest.add(ir);
        });
//        log.info("bulk request {}", bulkRequest.requests().size());
        try {
            BulkResponse res = highClient.bulk(bulkRequest, RequestOptions.DEFAULT);
            for (BulkItemResponse b : res.getItems()) {
                if (b.isFailed())
                    log.warn("ID：{}はインデックスに失敗しました： {}", b.getId(), b.getFailureMessage());
            }
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    public void deleteIndex(String index) throws IOException {
        DeleteRequest req = new DeleteRequest(index);
        highClient.delete(req, RequestOptions.DEFAULT);
    }

    public void close() throws IOException {
        restClient.close();
    }

}
