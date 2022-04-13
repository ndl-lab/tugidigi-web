package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.domain.LineCoordFormat;
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
@Component(AddCoordinatesBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class AddCoordinatesBatch extends AbstractBatch {

    public static final String BATCH_NAME = "add-coordinfo";

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, AddCoordinatesBatch.BATCH_NAME, "ignore\\data\\books");
    }

    @Autowired
    private BookService bs;

    @Autowired
    private PageService ps;

    private static final int BULK_INDEX_SIZE = 200;

    @Override
    public void run(String[] params) {
    	Path dataDir = Paths.get(params[0]);
        Boolean indexWithFullText=Boolean.parseBoolean(params[1]);
        Boolean isSleep=Boolean.parseBoolean(params[2]);
        Boolean skipalreadyindexed=Boolean.parseBoolean(params[3]);
        if(indexWithFullText)log.info("indexing with fulltext");
        //datadir内のtarfileを数えて対象のPIDを把握する
        Map<String, Book> books = new HashMap<String, Book>();
        try (Stream<Path> list = Files.list(dataDir)) {
            list.forEach(tar -> {
                String pid = tar.getFileName().toString().replace(".tar", "");
                Book book = bs.bookStore.get(pid);
                if(book!=null) {
                	if(skipalreadyindexed) {
                		if(book.contents!=null&&book.contents.length()<1)books.put(pid, book);
                	}else{
                		books.put(pid, book);
                	}
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("PIDのロード完了 {}",books.size());
        log.info("bookの全文index作成");
        //Index作成
        ObjectMapper mapper = new ObjectMapper();
        try {
            ObjectMapper om = new ObjectMapper();
                try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE/100)) {
                	try (EsBulkIndexer pageIndexer = new EsBulkIndexer(ps.pageStore, BULK_INDEX_SIZE)) {
	                    books.forEach((pid, book) -> {
	                    	log.info("indexing {} {}", pid, book.title);
	                        try (TarArchiveInputStream tis = new TarArchiveInputStream(Files.newInputStream(dataDir.resolve(pid + ".tar")))) {
	                            ArchiveEntry tarEntry = tis.getNextEntry();
	                            StringBuilder bookText = new StringBuilder();
	                            while (tarEntry != null) {
	                                String rawfileName = FilenameUtils.getName(tarEntry.getName().toString());
	                                if (rawfileName.endsWith(".json")) {
	                                	String komanum=rawfileName.substring(1,8);
	                                    int page = Integer.parseInt(komanum);
	                                    String fileName=pid+"_"+String.valueOf(page);
	                                    Page p=null;
	                                    if(ps.pageStore.exists(fileName)) {
	                                    	p = ps.pageStore.get(fileName);
	                                    }else {
	                                    	p = new Page();
		                                    p.page = page;
		                                    p.book = pid;
	                                    }
	                                    String jsontext = IOUtils.toString(tis, StandardCharsets.UTF_8);
	                                    JsonNode node = mapper.readTree(jsontext);
	                                    JsonNode wordlist=node.get("words");
	                                   List<LineCoordFormat>CoordList=new ArrayList<>();
	                                   StringBuilder pageText = new StringBuilder();
	                                    for(JsonNode eachWord :wordlist) {
	                                    	Boolean istextline=eachWord.get("isTextline").asBoolean();
	                                    	if(!istextline)continue;
	                                    	LineCoordFormat wlc=new LineCoordFormat();
	                                    	wlc.id=eachWord.get("id").asInt();
	                                    	wlc.contenttext=eachWord.get("text").asText();
	                                    	double xmin=1000000,ymin=1000000,xmax=0,ymax=0;
	                                    	for(JsonNode paircoord:eachWord.get("boundingBox")) {
	                                    		double tmpx=paircoord.get(0).asDouble();
	                                    		double tmpy=paircoord.get(1).asDouble();
	                                    		xmin  =Math.min(xmin,tmpx);
	                                    		xmax =Math.max(xmax,tmpx);
	                                    		ymin  =Math.min(ymin,tmpy);
	                                    		ymax =Math.max(ymax,tmpy);
	                                    	}
	                                    	wlc.xmin=xmin;
	                                    	wlc.ymin=ymin;
	                                    	wlc.xmax=xmax;
	                                    	wlc.ymax=ymax;
	                                    	if(indexWithFullText) {
	                                    		if(wlc.contenttext.length()>0&&pageText.length()>0&&
	                                    				String.valueOf(wlc.contenttext.charAt(0)).getBytes().length <= 1&&
	                                    				String.valueOf(pageText.charAt(pageText.length()-1)).getBytes().length <= 1) {
	                                    			pageText.append(" "+wlc.contenttext);
	                                    		}else {
	                                    			pageText.append(wlc.contenttext);
	                                    		}
	                                    	}
	                                    	CoordList.add(wlc);
	                                    }
	                                    p.coordjson=mapper.writeValueAsString(CoordList);
	                                    if(indexWithFullText) {
	                                    	p.contents=pageText.toString();
	                                    	bookText.append(p.contents);
	                                    }
	                                    pageIndexer.add(fileName, om.writeValueAsString(p));
	                                }
	                                tarEntry = tis.getNextEntry();
	                            }
	                            pageIndexer.flush();
	                            if(isSleep)Thread.sleep(500);
	                            if(indexWithFullText) {
	                            	book.contents = bookText.toString().replaceAll("[\r\t\n\ufeff]", "");
	                                bookIndexer.add(pid, om.writeValueAsString(book));
	                                bookIndexer.flush();
	                                if(isSleep)Thread.sleep(500);
	                            }
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
