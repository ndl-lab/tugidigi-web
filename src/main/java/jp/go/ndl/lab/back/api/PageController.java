package jp.go.ndl.lab.back.api;

import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.infra.EsSearchQuery;
import jp.go.ndl.lab.back.infra.EsSearchResult;
import jp.go.ndl.lab.back.service.PageService;
import jp.go.ndl.lab.common.utils.AccessIIIFEndpoints;
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
@RequestMapping("/api/page")
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
    
    /*@CrossOrigin
    @GetMapping(path = "/co/{id}")
    public Page getco(@PathVariable("id") String id) throws Exception {
        Page p = pageService.get(id);
        p.contents = null;
        p.coordjson=null;
        return p;
    }*/

    @GetMapping("/search")
    public EsSearchResult<Page> search(@RequestParam MultiValueMap<String, String> query) {
    	AccessIIIFEndpoints ae=new AccessIIIFEndpoints();
    	if(query.containsKey("f-book")) {
    		return pageService.search(EsSearchQuery.readQuery(query).createSearchSource(),false);
    	}else {
    		return null;
    	}
    }
    
    /*@CrossOrigin
    @GetMapping("/co/search")
    public EsSearchResult<Page> searchco(@RequestParam MultiValueMap<String, String> query) {
        return pageService.search(EsSearchQuery.readQuery(query).createSearchSource(),true);
    }*/
}
