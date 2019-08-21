package jp.go.ndl.lab.dl.back.api;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import jp.go.ndl.lab.dl.back.Application;
import jp.go.ndl.lab.dl.back.domain.Illustration;
import jp.go.ndl.lab.dl.back.infra.EsSearchQuery;
import jp.go.ndl.lab.dl.back.infra.EsSearchResult;
import jp.go.ndl.lab.dl.back.service.IllustService;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.functionscore.ScoreFunctionBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("api/illustration")
@Slf4j
@Profile(Application.MODE_WEB)
public class IllustController {

    private List<String> queryIllusts;

    public IllustController() {
        try {
            queryIllusts = Files.readAllLines(Paths.get("config", "query-image.txt"));
        } catch (IOException ex) {
            log.error("", ex);
        }
    }

    @Autowired
    private IllustService illustService;

    @GetMapping(path = "/{id}")
    public Illustration get(@PathVariable("id") String id) throws Exception {
        return illustService.get(id);
    }

    @GetMapping(path = "multi-get")
    public List<Illustration> multiGet(@RequestParam String ids) throws Exception {
        List<String> idList = Arrays.asList(ids.split(","));
        Map<String, Illustration> map = illustService.illustStore.multiGet(idList);
        return idList.stream().map(id -> map.get(id)).collect(Collectors.toList());
    }

    @GetMapping("/search")
    public EsSearchResult<Illustration> search(@RequestParam MultiValueMap<String, String> query) {
        return filter(illustService.search(EsSearchQuery.readQuery(query).createSearchSource()));
    }

    @GetMapping("/random")
    public List<Illustration> random(@RequestParam Integer size) {
        SearchSourceBuilder ssb = new SearchSourceBuilder();
        QueryBuilder qb = QueryBuilders.functionScoreQuery(QueryBuilders.matchAllQuery(), ScoreFunctionBuilders.randomFunction());
        ssb.query(qb);
        ssb.from(0);
        ssb.size(size);
        return filter(illustService.search(ssb)).list;
    }

    private EsSearchResult<Illustration> filter(EsSearchResult<Illustration> result) {
        result.forEach(r -> r.setFeature(null));
        return result;
    }

    @GetMapping("/of/{id}")
    public EsSearchResult<Illustration> book(@PathVariable String id) {
        EsSearchQuery sq = new EsSearchQuery();
        sq.addFilter("pid", id);
        sq.from = 0;
        sq.size = 5;
        return filter(illustService.search(sq.createSearchSource()));
    }

    @GetMapping("/default")
    public List<Illustration> defaultList() {
        List<String> idList = new ArrayList<>(queryIllusts);
        Collections.shuffle(idList);
        idList = idList.subList(0, 10);
        log.info("{}", idList);
        Map<String, Illustration> map = illustService.illustStore.multiGet(idList);
        return idList.stream().map(id -> map.get(id)).collect(Collectors.toList());
    }

}