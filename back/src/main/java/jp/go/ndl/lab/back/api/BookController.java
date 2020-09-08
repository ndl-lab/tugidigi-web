package jp.go.ndl.lab.back.api;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.infra.EsSearchQuery;
import jp.go.ndl.lab.back.infra.EsSearchResult;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.common.utils.RESTUtils;
import jp.go.ndl.lab.common.utils.RunOuterProcess;
import jp.go.ndl.lab.common.utils.TempUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

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
        return bookService.search(EsSearchQuery.readQuery(query),false);//第二引数がfalseだと全部を使った全文検索
    }
    @GetMapping("/searchmeta")
    public EsSearchResult<Book> searchmeta(@RequestParam MultiValueMap<String, String> query) {
        return bookService.search(EsSearchQuery.readQuery(query),true);//第二引数がtrueだとメタに絞った検索
    }
    

    boolean running;

    @Value("${whiteshell}")
    private String whiteShellPath;

    @GetMapping("/download/{id}")
    public ResponseEntity<StreamingResponseBody> download(@PathVariable("id") String id, @RequestParam("page") String page) throws IOException {
        log.info("download {} {}", id, page);
        //if (running) throw new RuntimeException();
        
        if (running) {
        	return RESTUtils.streamTextResponse(new StreamingResponseBody() {
        		@Override
                public void writeTo(OutputStream outputStream) throws IOException {
        			String processnow="他の方の処理を行っています。時間を空けてもう一度お試しください。(The process is being processed by others. Give it some time and try again.)"; 
        			try (OutputStreamWriter osw = new  OutputStreamWriter(outputStream,"UTF-8")) {
        				osw.write(processnow);
        			}
        		}
        	});
        }
        return RESTUtils.streamDownloadResponse(id + "_" + page + ".zip", new StreamingResponseBody() {
            @Override
            public void writeTo(OutputStream outputStream) throws IOException {
                running = true;
                File tempDir = TempUtils.createTempFile();
                tempDir.mkdirs();
                try (ZipOutputStream zos = new ZipOutputStream(outputStream)) {
                    String url = "https://dl.ndl.go.jp/view/jpegOutput?itemId=info%3Andljp%2Fpid%2F" + id + "&contentNo=" + page + "&outputScale=2";
                    File whiteFile = FileUtils.getFile(tempDir, id + "_" + page + ".jpg");
                    log.info("path {}", whiteFile.getAbsolutePath());
                    RunOuterProcess.Result r = RunOuterProcess.run(new File(whiteShellPath), "bash", "whitening.sh", url, whiteFile.getAbsolutePath());
                    log.info("{}\n{}", r.outs, r.errors);
                    ZipEntry entry = new ZipEntry(id + "_" + page + ".jpg");
                    zos.putNextEntry(entry);
                    try (BufferedInputStream fis = new BufferedInputStream(new FileInputStream(whiteFile))) {
                        IOUtils.copy(fis, zos, 1000);
                    }
                }
                running = false;
//                FileUtils.deleteDirectory(tempDir);
            }
        });
    }
}
