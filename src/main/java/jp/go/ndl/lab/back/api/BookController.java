package jp.go.ndl.lab.back.api;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.infra.EsSearchQuery;
import jp.go.ndl.lab.back.infra.EsSearchResult;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.back.service.PageService;
import jp.go.ndl.lab.common.utils.AccessIIIFEndpoints;
import jp.go.ndl.lab.common.utils.RESTUtils;
import jp.go.ndl.lab.common.utils.RunOuterProcess;
import jp.go.ndl.lab.common.utils.TempUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@CrossOrigin
@RestController
@RequestMapping("/api/book")
@Slf4j
@Profile(Application.MODE_WEB)
public class BookController {

    public BookController() {
    }

    @Autowired
    private BookService bookService;
    @Autowired
    private PageService pageService;

    @GetMapping(path = "/{id}")
    public Book get(@PathVariable("id") String id) throws Exception {
    	Book b=bookService.get(id);
    	b.contents=null;
        return b;
    }
    @GetMapping(path = "/fulltext/{id}")
    public ResponseEntity<StreamingResponseBody> getfulltext(@PathVariable("id") String pid) throws Exception {
    	AccessIIIFEndpoints ae=new AccessIIIFEndpoints();
    	if(ae.PDMChecker(pid)) { 
    	//if(true) { 
    		return RESTUtils.streamDownloadResponse(pid+".zip",new StreamingResponseBody() {
    			@Override
                public void writeTo(OutputStream outputStream) throws IOException {
                    try (ZipOutputStream zos = new ZipOutputStream(outputStream)) {
                    	EsSearchResult<Page> ps=pageService.getAllPage(pid);
                    	StringBuilder bookText = new StringBuilder();
                    	StringBuilder bookJson = new StringBuilder();
                    	for(Page page:ps.list) {
                    		if(page.contents!=null) {
		                        ZipEntry entry = new ZipEntry(pid+ "_" + String.format("%07d",page.page)+ ".txt");
		                        zos.putNextEntry(entry);
		                        try (InputStream fis =  new ByteArrayInputStream(page.contents.getBytes(StandardCharsets.UTF_8))) {
		                            //IOUtils.copy(fis, zos, 1000);
		                            String steamToString = IOUtils.toString(fis, "UTF-8");
		                            IOUtils.write(steamToString,zos,"UTF-8");
		                            bookText.append(steamToString+"\n");
		                        }
                    		}
                    		if(page.coordjson!=null) {
		                        ZipEntry entry = new ZipEntry(pid+ "_" + String.format("%07d",page.page)+ ".json");
		                        zos.putNextEntry(entry);
		                        try (InputStream fis =  new ByteArrayInputStream(page.coordjson.getBytes(StandardCharsets.UTF_8))) {
		                        	String steamToString = IOUtils.toString(fis, "UTF-8");
		                            IOUtils.write(steamToString,zos,"UTF-8");
		                            bookJson.append(steamToString+"\n");
		                        }
                    		}
                    	}
                    	ZipEntry entrytxt = new ZipEntry(pid+ ".txt");
                        zos.putNextEntry(entrytxt);
                        IOUtils.write(bookText.toString(),zos,"UTF-8");
                        
                        ZipEntry entryjson = new ZipEntry(pid+ ".jsonl");
                        zos.putNextEntry(entryjson);
                        IOUtils.write(bookJson.toString(),zos,"UTF-8");
                    }
    			}
    		});
    	}
    	return new ResponseEntity<StreamingResponseBody>(new StreamingResponseBody() {
    		String notallow="This PID is not allowed";
			@Override
            public void writeTo(OutputStream outputStream) throws IOException {
				try (OutputStreamWriter osw = new  OutputStreamWriter(outputStream,"UTF-8")) {
    				osw.write(notallow);
    			}
			}
		},new HttpHeaders(),HttpStatus.FORBIDDEN);
    }
    @GetMapping(path = "/fulltext-json/{id}")
    public ResponseEntity<StreamingResponseBody> getfulltextjson(@PathVariable("id") String pid) throws Exception {
    	AccessIIIFEndpoints ae=new AccessIIIFEndpoints();
    	ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);;
    	if(ae.PDMChecker(pid)) { 
    		return RESTUtils.streamDownloadResponse(pid+".json",new StreamingResponseBody() {
    			@Override
                public void writeTo(OutputStream outputStream) throws IOException {
    				try (OutputStreamWriter osw = new  OutputStreamWriter(outputStream,"UTF-8")) {
        				osw.write(mapper.writeValueAsString(pageService.getAllPage(pid)));
        			}
    			}
    		});
    	}
    	return new ResponseEntity<StreamingResponseBody>(new StreamingResponseBody() {
    		String notallow="This PID is not allowed";
			@Override
            public void writeTo(OutputStream outputStream) throws IOException {
				try (OutputStreamWriter osw = new  OutputStreamWriter(outputStream,"UTF-8")) {
    				osw.write(notallow);
    			}
			}
		},new HttpHeaders(),HttpStatus.FORBIDDEN);
    }
    @GetMapping(path = "/metrics/{id}")
    public Book getMetrics(@PathVariable("id") String id) throws Exception {
        return bookService.GetMetrics(id);
    }

    @GetMapping("/search")
    public EsSearchResult<Book> search(@RequestParam MultiValueMap<String, String> query) {
    	//log.info("Input Query:{}", query);
    	return bookService.search(EsSearchQuery.readQuery(query));
    }
    
    @GetMapping("/ngram-search")
    public EsSearchResult<Book> ngramsearch(@RequestParam MultiValueMap<String, String> query) {
        return bookService.ngramsearch(EsSearchQuery.readQuery(query));
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
                    RunOuterProcess.Result r = RunOuterProcess.run(new File(whiteShellPath), "bash", "./whitening/whitening.sh", url, whiteFile.getAbsolutePath());
                    log.info("{}\n{}", r.outs, r.errors);
                    ZipEntry entry = new ZipEntry(id + "_" + page + ".jpg");
                    zos.putNextEntry(entry);
                    try (BufferedInputStream fis = new BufferedInputStream(new FileInputStream(whiteFile))) {
                        IOUtils.copy(fis, zos, 1000);
                    }
                    running = false;
                }
//                FileUtils.deleteDirectory(tempDir);
            }
        });
    }
}
