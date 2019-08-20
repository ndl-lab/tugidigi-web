package jp.go.ndl.lab.dl.back.api;

import jp.go.ndl.lab.dl.back.Application;
import jp.go.ndl.lab.dl.back.domain.Book;
import jp.go.ndl.lab.dl.back.infra.EsSearchQuery;
import jp.go.ndl.lab.dl.back.infra.EsSearchResult;
import jp.go.ndl.lab.dl.back.service.BookService;
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
@RequestMapping("api/book")
@Slf4j
@Profile(Application.MODE_WEB)
public class BookController {

    public BookController() {
    }

    @Autowired
    private BookService bookService;

    @GetMapping(path = "/{id}")
    public Book get(@PathVariable("id") String id) throws Exception {
        return bookService.get(id);
    }

    @GetMapping("/search")
    public EsSearchResult<Book> search(@RequestParam MultiValueMap<String, String> query) {
        return bookService.search(EsSearchQuery.readQuery(query));
    }
}
