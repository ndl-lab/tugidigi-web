package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

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
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 *
 * ItemのIndexを作成するバッチ
 *
 */
@Component(AddCoordinatesGzipBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class AddCoordinatesGzipBatch extends AbstractBatch {

    public static final String BATCH_NAME = "add-coordinfo-gzip";

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
        Boolean addemptybookflag=(params.length >= 5)?Boolean.parseBoolean(params[4]):false;
        String bookopenmeta=(params.length >= 6)?params[5]:"dummy";
        Path meta = Paths.get(bookopenmeta);
        
        if(indexWithFullText)log.info("indexing with fulltext");
        //datadir内のtarfileを数えて対象のPIDを把握する
        Map<String, String> booktitles = new HashMap<String, String>();
        List<String>emptypidlist=new ArrayList<String>();
        try (Stream<Path> list = Files.list(dataDir)) {
            list.forEach(tar -> {
                String pid = tar.getFileName().toString().replace(".tar.gz", "");
                Book book = bs.bookStore.get(pid);
                if(book!=null) {
                	if(skipalreadyindexed) {
                		if(book.contents!=null&&book.contents.length()<1)booktitles.put(pid, book.title);
                	}else{
                		booktitles.put(pid, book.title);
                	}
                }else if(addemptybookflag) {
                	emptypidlist.add(pid);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("PIDのロード完了 :{}",booktitles.size());
        if(addemptybookflag) {
        	log.info("追加するPID :{}",emptypidlist.size());
        	ZipFile zf;
			try {
				ObjectMapper om = new ObjectMapper();
		        try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE/100)) {
					zf = new ZipFile(meta.toFile());
					zf.stream().forEach(s -> {
		                CsvParserSettings settings = new CsvParserSettings();
		                settings.getFormat().setDelimiter('\t');
		                settings.setMaxCharsPerColumn(1000000);
		                settings.getFormat().setLineSeparator("\n");  // 改行コードは CR+LF
		                settings.setHeaderExtractionEnabled(true);      // 1行目はヘッダ行としてスキップする
		                settings.setInputBufferSize(100000000);
		                settings.setNullValue("");
	//	                        settings.setNumberOfRecordsToRead(1);
		                CsvParser parser = new CsvParser(settings);
		                
		                try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(s), StandardCharsets.UTF_8));) {
		                	parser.beginParsing(br);
		                    String[] data;
		                    while ((data = parser.parseNext()) != null) {
		                        String pid = data[0].split("/pid/")[1];
		                        if(!emptypidlist.contains(pid))continue;
		                        Book book = new Book();
		                        book.title = data[1];
		                        log.info("new book adding {} {}", pid, book.title);
	                            book.volume = data[2];
	                            book.responsibility = data[5];
	                            book.publisher = data[6];
	                            book.published =  StringUtils.substring(data[8], 0, 4);
	                            if(data[11].length()>=3) {
	                            	book.ndc =data[11].substring(0, 3);
	                            }
	                            if(book.published.length()==4) {
	                    			book.publishyear=Integer.parseInt(book.published);
	                    		}
	                            booktitles.put(pid, book.title);
	                            log.info( om.writeValueAsString(book));
	                            bookIndexer.add(pid, om.writeValueAsString(book));
		                    }
		                } catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
		            });
		        }
			} catch (ZipException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            
        }
        log.info("bookの全文index作成");
        //Index作成
        ObjectMapper mapper = new ObjectMapper();
        try {
            ObjectMapper om = new ObjectMapper();
                try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE/100)) {
                	try (EsBulkIndexer pageIndexer = new EsBulkIndexer(ps.pageStore, BULK_INDEX_SIZE)) {
                		booktitles.forEach((pid, booktitle) -> {
                			Book book = bs.bookStore.get(pid);
	                    	log.info("indexing {} {}", pid, booktitle);
	                    	try (TarArchiveInputStream tis = new TarArchiveInputStream(new GZIPInputStream(Files.newInputStream(dataDir.resolve(pid + ".tar.gz"))))) {
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
	                            //pageIndexer.flush();
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
