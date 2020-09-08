package jp.go.ndl.lab.back.batch;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.back.service.IllustService;
import jp.go.ndl.lab.back.service.PageService;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component("delete-book")
public class DeleteBookBatch extends AbstractBatch {

    public static void main(String[] args) throws Exception {
        Application.main("batch", "delete-book", "801459");
    }

    @Autowired
    private IllustService is;

    @Autowired
    private BookService bs;

    @Autowired
    private PageService ps;

    @Override
    public void run(String[] params) {
        try {
            for (String id : Files.readAllLines(Paths.get(params[0]))) {
                try {
                    bs.bookStore.delete(id);
                    ps.pageStore.deleteByQuery(QueryBuilders.termQuery("book", id));
                    is.illustStore.deleteByQuery(QueryBuilders.termQuery("pid", id));
                } catch (Exception e) {
                    log.error(id, e);
                }
            }
        } catch (IOException ex) {
            log.error("", ex);
        }
    }
}
