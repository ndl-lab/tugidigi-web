package jp.go.ndl.lab.dl.back.api;

import jp.go.ndl.lab.dl.back.Application;
import jp.go.ndl.lab.dl.back.domain.Page;
import jp.go.ndl.lab.dl.back.infra.EsSearchQuery;
import jp.go.ndl.lab.dl.back.infra.EsSearchResult;
import jp.go.ndl.lab.dl.back.service.PageService;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("api/page")
@Slf4j
@Profile(Application.MODE_WEB)
public class PageController {

    public PageController() {
    }

    @Autowired
    private PageService pageService;

    @GetMapping(path = "/{id}")
    public Page get(@PathVariable("id") String id) throws Exception {
        Page p = pageService.get(id);
        p.contents = null;
        return p;
    }

    @GetMapping("/search")
    public EsSearchResult<Page> search(@RequestParam MultiValueMap<String, String> query) {
        return pageService.search(EsSearchQuery.readQuery(query).createSearchSource());
    }

}
