package jp.go.ndl.lab.back.api;

import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.service.AnalyzeService;
import jp.go.ndl.lab.back.service.PageService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/analyze")
@Slf4j
@Profile(Application.MODE_WEB)
public class AnalyzeController {
	@Autowired
    private PageService pageService;
	@Autowired
    private AnalyzeService analyzeService;
    public AnalyzeController() {
    }
    @GetMapping("/page/{id}")
    public  Page normalizecoordtxt(@PathVariable("id") String id) throws Exception {
    	Page p=pageService.get(id);
        return analyzeService.normalizeCoordJson(p);
    }
    @GetMapping("/normkeyword/{keyword}")
    public  String  normalizekeyword(@PathVariable("keyword") String keyword) throws Exception {
        return analyzeService.normalizeString(keyword);
    }
}
