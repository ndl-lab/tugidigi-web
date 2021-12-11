package jp.go.ndl.lab.back.infra;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.go.ndl.lab.common.utils.LabException;
import jp.go.ndl.lab.common.utils.LabUtils;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.get.MultiGetItemResponse;
import org.elasticsearch.action.get.MultiGetRequest;
import org.elasticsearch.action.get.MultiGetRequest.Item;
import org.elasticsearch.action.get.MultiGetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
public class EsDataStore<E extends EsData> {

    private static final String TYPE = "_doc";

    private RestClient restClient;
    private ObjectMapper mapper;
    private String index;
    private Class<E> clazz;
    private UriComponentsBuilder uriBuilder;
    private RestHighLevelClient client;

    public EsDataStore(String host, int port, String path,String scheme, String index, Class<E> clazz) {
        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, scheme)).setRequestConfigCallback(c -> {
            return c.setConnectTimeout(5000).setSocketTimeout((int) TimeUnit.MINUTES.toMillis(5));
        });
        uriBuilder = UriComponentsBuilder.newInstance().scheme(scheme).host(host).port(port);
        if (StringUtils.isNotBlank(path)) {
            builder.setPathPrefix(path);
            uriBuilder.path(path);
        }
        restClient = builder.build();
        client = new RestHighLevelClient(builder);
        mapper = new ObjectMapper();
        this.index = index;
        this.clazz = clazz;
    }

    public void bulkIndex(Map<String, String> idJsonMap) {
        BulkRequest bulkRequest = new BulkRequest();
        idJsonMap.forEach((k, v) -> {
            IndexRequest ir = new IndexRequest(index);
            ir.id(k);
            ir.source(v, XContentType.JSON);
            bulkRequest.add(ir);
        });
//        log.info("bulk request {}", bulkRequest.requests().size());
        try {
            BulkResponse res = client.bulk(bulkRequest, RequestOptions.DEFAULT);
            for (BulkItemResponse b : res.getItems()) {
                if (b.isFailed()) {
                	log.info("bulk failed");
                }
            }
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    public void bulkDelete(Collection<String> ids) {
        BulkRequest bulkRequest = new BulkRequest();
        ids.forEach((k) -> {
            DeleteRequest delete = new DeleteRequest(index,k);
            bulkRequest.add(delete);
        });
//        log.info("bulk request {}", bulkRequest.requests().size());
        try {
            BulkResponse res = client.bulk(bulkRequest, RequestOptions.DEFAULT);
            for (BulkItemResponse b : res.getItems()) {
                if (b.isFailed()) {
                    log.warn("ID：{}は削除に失敗しました： {}", b.getId(), b.getFailureMessage());
                }
            }
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    public void deleteByQuery(QueryBuilder queryBuilder) {
        try {
            String query = "{\"query\":" + org.elasticsearch.common.Strings.toString(queryBuilder, false, false) + "}";
            log.info("delete query: {}", query);
            Request req=new Request("POST","/" + index + "/_delete_by_query");
            HttpEntity entity = new NStringEntity(query, ContentType.APPLICATION_JSON);
            req.setEntity(entity);
            Response r = restClient.performRequest(
                    req);
            log.info("delete {}", r);
        } catch (JsonProcessingException ex) {
            log.error("", ex);
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    public E get(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        try {
            GetRequest getRequest = new GetRequest(index, id);
            getRequest.fetchSourceContext(new FetchSourceContext(true, null, new String[]{"contents"}));
            GetResponse g = client.get(getRequest, RequestOptions.DEFAULT);
            if (g.isExists()) {
                E value = mapper.readValue(g.getSourceAsString(), clazz);
                value.setId(g.getId());
                value.setVersion(g.getVersion());
                return value;
            }
        } catch (IOException ex) {
            log.error("", ex);
        } catch (Exception ee) {
            log.error("", ee);
        }
        return null;
    }

    public E getBy(String field, String value) {
        SearchSourceBuilder src = new SearchSourceBuilder();
        src.query(QueryBuilders.termQuery(field, value));
        EsSearchResult<E> result = search(src);
        if (!result.list.isEmpty()) {
            return result.list.get(0);
        }
        return null;
    }

    public Map<String, E> multiGet(Collection<String> ids) {
        Map<String, E> map = new LinkedHashMap<>();
        try {
            MultiGetRequest mgr = new MultiGetRequest();
            FetchSourceContext fsc = new FetchSourceContext(true, null, new String[]{"feature"});
            for (String id : ids) {
                Item item = new Item(index,id);
                item.fetchSourceContext(fsc);
                mgr.add(item);
            }
            MultiGetResponse g = client.mget(mgr, RequestOptions.DEFAULT);
            for (MultiGetItemResponse r : g.getResponses()) {
                try {
                    E value = mapper.readValue(r.getResponse().getSourceAsBytes(), clazz);
                    value.setId(r.getId());
                    value.setVersion(r.getResponse().getVersion());
                    map.put(r.getId(), value);
                } catch (Exception e) {
                    log.error("error {} {}", r.getId(), r.getFailure());
                }
            }
        } catch (Exception ex) {
            log.error("", ex);
        }
        return map;
    }

    public boolean exists(String id) {
        try {
            GetRequest getRequest = new GetRequest(index,id);
            return client.exists(getRequest, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            log.error("", ex);
        } catch (Exception ee) {
            log.error("", ee);
        }
        return false;
    }

    public Map<String, E> getAll() {
        Map<String, E> map = new LinkedHashMap<>();
        try {
            SearchRequest search = new SearchRequest(index);

            SearchSourceBuilder src = new SearchSourceBuilder();
            src.version(true);
            src.query(QueryBuilders.matchAllQuery());
            src.size(1000);

            search.source(src);

            SearchResponse sr = client.search(search, RequestOptions.DEFAULT);

            SearchHits hits = sr.getHits();

            for (SearchHit hit : hits.getHits()) {
                map.put(hit.getId(), convert(hit));
            }

        } catch (IOException ex) {
            log.error("", ex);
        }

        return map;
    }

    private E convert(SearchHit hit) throws IOException {
        E value = mapper.readValue(hit.getSourceRef().streamInput(), clazz);
        value.setId(hit.getId());
        value.setVersion(hit.getVersion());
        return value;
    }

    public E update(E e, boolean waitForUpdate) {
        try {
            IndexRequest indexRequest = new IndexRequest(index);
            indexRequest.id(e.getId());
            if (e.getVersion() != null) {
                indexRequest.version(e.getVersion());
            }
            e.setVersion(null);
            e.setId(null);
            if (waitForUpdate) {
                indexRequest.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
            }
            indexRequest.source(mapper.writeValueAsString(e), XContentType.JSON);
            IndexResponse response = client.index(indexRequest, RequestOptions.DEFAULT);
            e.setId(response.getId());
            e.setVersion(response.getVersion());
            return e;
        } catch (JsonProcessingException ex) {
            log.error("", ex);
        } catch (IOException ex) {
            log.error("", ex);
        }
        return null;
    }

    public E create(E e, boolean waitForUpdate) {
        try {
            IndexRequest indexRequest = new IndexRequest(index);
            if (waitForUpdate) {
                indexRequest.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
            }
            if (e.getId() != null) {
                indexRequest.id(e.getId());
            }
            e.setVersion(null);
            e.setId(null);
            indexRequest.source(mapper.writeValueAsString(e), XContentType.JSON);
            IndexResponse response = client.index(indexRequest, RequestOptions.DEFAULT);
            e.setId(response.getId());
            e.setVersion(response.getVersion());
            return e;
        } catch (JsonProcessingException ex) {
            log.error("", ex);
        } catch (IOException ex) {
            log.error("", ex);
        }
        return null;
    }
    public E create(String id, E e, boolean waitForUpdate) {
        if (LabUtils.hasNullByte(id) || id == null) {
            throw LabException.nullInputException();
        }
        try {
            if (exists(id)) throw LabException.idDuplicateException();
            IndexRequest indexRequest = new IndexRequest(index).id(id);
            if (waitForUpdate) {
                indexRequest.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
            }
            e.setId(null);
            indexRequest.source(mapper.writeValueAsString(e), XContentType.JSON);
            IndexResponse response = client.index(indexRequest, RequestOptions.DEFAULT);
            e.setId(id);
            e.setVersion(response.getVersion());
            return e;
        } catch (JsonProcessingException ex) {
            log.error("", ex);
        } catch (IOException ex) {
            log.error("", ex);
        }
        return null;
    }
    public void delete(String id) {
        try {
            DeleteRequest deleteRequest = new DeleteRequest(index,id);
            deleteRequest.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
            client.delete(deleteRequest, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            log.error("", ex);
        }
    }
    public void deleteindex() {
        try {
            DeleteIndexRequest deleteRequest = new DeleteIndexRequest(index);
            client.indices().delete(deleteRequest, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    private static final String ContentType_NDJSON = "application/x-ndjson";

    /**
     *
     * 返ってくるEには、IDとVersionがsetされていないことに注意する。
     *
     * @param query
     * @param consumer
     * @throws Exception
     */
    public void scroll(QueryBuilder query, Consumer<E> consumer) throws Exception {
        int count = 0;
        final Scroll scroll = new Scroll(TimeValue.timeValueMinutes(1L));
        SearchRequest searchRequest = new SearchRequest(index);
        searchRequest.scroll(scroll);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.version(true);
        searchSourceBuilder.query(query);
        searchSourceBuilder.sort("_doc"); 
        FetchSourceContext fsc = new FetchSourceContext(true, null, new String[]{"contents"});
        searchSourceBuilder.fetchSource(fsc);
        searchRequest.source(searchSourceBuilder);

        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
        String scrollId = searchResponse.getScrollId();
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        //1回目書き出し
        for (SearchHit hit : searchHits) {
            consumer.accept(convert(hit));
        }
        //継続
        while (searchHits != null && searchHits.length > 0) {
            SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
            scrollRequest.scroll(scroll);
            searchResponse = client.scroll(scrollRequest, RequestOptions.DEFAULT);
            scrollId = searchResponse.getScrollId();
            searchHits = searchResponse.getHits().getHits();
            for (SearchHit hit : searchHits) {
                consumer.accept(convert(hit));
                if (++count % 100000 == 0) {
                    log.info("scroll count {}", count);
                }
            }
        }
        log.info("scrolled total {}", count);

        ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
        clearScrollRequest.addScrollId(scrollId);
        client.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
    }

    /**
     *
     * 返ってくるEには、IDとVersionがsetされていないことに注意する。
     *
     * @param query
     * @param consumer
     * @throws Exception
     */
    @SuppressWarnings("deprecation")
	public void limitedscroll(QueryBuilder query, Consumer<E> consumer, int limit) throws Exception {
        int count = 0;
        final Scroll scroll = new Scroll(TimeValue.timeValueMinutes(1L));
        SearchRequest searchRequest = new SearchRequest(index);
        searchRequest.scroll(scroll);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(query);
        searchSourceBuilder.sort("_doc"); 
        searchRequest.source(searchSourceBuilder);

        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
        String scrollId = searchResponse.getScrollId();
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        //1回目書き出し
        for (SearchHit hit : searchHits) {
            consumer.accept(convert(hit));
        }
        //継続
        while (searchHits != null && searchHits.length > 0) {
            SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
            scrollRequest.scroll(scroll);
            searchResponse = client.searchScroll(scrollRequest, RequestOptions.DEFAULT);
            scrollId = searchResponse.getScrollId();
            searchHits = searchResponse.getHits().getHits();
            for (SearchHit hit : searchHits) {
                consumer.accept(convert(hit));
                if (++count % 100000 == 0) {
                    log.info("scroll count {}", count);
                }
                if (count > limit) {
                    break;
                }
            }
            if (count > limit) {
                break;
            }
        }
        log.info("scrolled total {}", count);

        ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
        clearScrollRequest.addScrollId(scrollId);
        client.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
    }

    public EsSearchResult<E> search(SearchSourceBuilder src) {
        EsSearchResult<E> result = new EsSearchResult<>();
        try {
            SearchRequest search = new SearchRequest(index);
            src.version(true);
            src.fetchSource(new FetchSourceContext(true, null, new String[]{"contents"}));
            search.source(src);
            SearchResponse sr = client.search(search, RequestOptions.DEFAULT);
            SearchHits hits = sr.getHits();
            result.hit =hits.getTotalHits().value;
            result.from = src.from();
            result.searchResponse = sr;
            for (SearchHit hit : hits.getHits()) {
                result.list.add(convert(hit));
            }
        } catch (IOException ex) {
            log.error("", ex);
        }
        return result;
    }

}
