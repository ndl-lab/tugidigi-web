package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.infra.EsBulkIndexer;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.back.service.PageService;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 *
 * ItemのIndexを作成するバッチ
 *
 */
@Component(AddFulltextBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class AddFulltextBatch extends AbstractBatch {

    public static final String BATCH_NAME = "add-fullindex";

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, AddFulltextBatch.BATCH_NAME, "ignore\\data\\books");
    }

    @Autowired
    private BookService bs;

    @Autowired
    private PageService ps;

    private static final int BULK_INDEX_SIZE = 1000;

    @Override
    public void run(String[] params) {
        Path dataDir = Paths.get(params[0]);
        
        //datadir内のtarfileを数えて対象のPIDを把握する
        Map<String, Book> books = new HashMap<String, Book>();
        try (Stream<Path> list = Files.list(dataDir)) {
            list.forEach(tar -> {
                String pid = tar.getFileName().toString().replace(".tar", "");
                Book book = bs.bookStore.get(pid);
                if(book!=null)books.put(pid, book);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("PIDのロード完了");
        log.info("bookの全文index作成");
        //Index作成
        try {
            ObjectMapper om = new ObjectMapper();
        try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE/100)) {
                try (EsBulkIndexer pageIndexer = new EsBulkIndexer(ps.pageStore, BULK_INDEX_SIZE)) {
                    books.forEach((pid, book) -> {
                    	log.info("indexing {} {}", pid, book.title);
                        StringBuilder bookText = new StringBuilder();
                        try (TarArchiveInputStream tis = new TarArchiveInputStream(Files.newInputStream(dataDir.resolve(pid + ".tar")))) {
                            ArchiveEntry tarEntry = tis.getNextEntry();
                            while (tarEntry != null) {
                                String rawfileName = FilenameUtils.getName(tarEntry.getName().toString());
                                if (rawfileName.endsWith(".txt")) {
                                	String komanum=rawfileName.substring(1,8);
                                    int page = Integer.parseInt(komanum);
                                    String fileName=pid+"_"+String.valueOf(page);
                                    //System.out.println(fileName);
                                    String text = IOUtils.toString(tis, StandardCharsets.UTF_8);
                                    text=text.split("\0#-#-##-#-#\0")[0];
                                    Page p = ps.pageStore.get(fileName);
                                    p.page = page;
                                    p.contents = text;
                                    p.book = pid;
                                    bookText.append(p.contents);
                                    //pageContentMap.put(p.page, p.contents);
                                    //System.out.println(book.title);
                                    pageIndexer.add(fileName, om.writeValueAsString(p));
                                    //pageIndexer.flush();
                                }
                                tarEntry = tis.getNextEntry();
                            }
                            book.contents = bookText.toString().replaceAll("[\r\t\n\ufeff]", "");
                            bookIndexer.add(pid, om.writeValueAsString(book));
                            //bookIndexer.flush();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                }
            }
        } catch (Throwable ex) {
            log.error("", ex);
        }
    }
}
