package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import java.awt.Stroke;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.infra.EsBulkIndexer;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.back.service.PageService;
import jp.go.ndl.lab.common.utils.CreateTOC;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.support.ValuesSource.Numeric;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 *
 * ItemのIndexを作成するバッチ
 *
 */
@Component(IndexBookWithoutFulltextBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class IndexBookWithoutFulltextBatch extends AbstractBatch {

    public static final String BATCH_NAME = "index-book-notftext";

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, IndexBookWithoutFulltextBatch.BATCH_NAME, "ignore\\data\\books", "ignore\\data\\export20170724174516_tsv.zip", "ignore\\data\\div", "true");
    }

    @Autowired
    private BookService bs;

    @Autowired
    private PageService ps;

    private static final int BULK_INDEX_SIZE = 100;

    @Override
    public void run(String[] params) {
    	Path filelisttxt=Paths.get(params[0]);
        Path meta = Paths.get(params[1]);
        Path splitDir = Paths.get(params[2]);
        Path rightleftDir = Paths.get(params[3]);
        Boolean cleanindexflag=(params.length >= 5)?Boolean.parseBoolean(params[4]):false;
        if (cleanindexflag) {
            bs.bookStore.deleteByQuery(QueryBuilders.matchAllQuery());
            ps.pageStore.deleteByQuery(QueryBuilders.matchAllQuery());
        }
        //　全文作成
        Map<String, Book> books = new HashMap<String, Book>();
        try {
        	List<String> pidlist =Files.readAllLines(filelisttxt).stream().collect(Collectors.toList());
        	for(String pid :pidlist) {
	            Book book = new Book();
	            books.put(pid, book);
        	}
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("bookの目次作成");
        
        try {
            ZipFile zf = new ZipFile(meta.toFile());
            zf.stream().forEach(s -> {
                CsvParserSettings settings = new CsvParserSettings();
                settings.getFormat().setDelimiter('\t');
                settings.setMaxCharsPerColumn(1000000);
                settings.getFormat().setLineSeparator("\n");  // 改行コードは CR+LF
                settings.setHeaderExtractionEnabled(true);      // 1行目はヘッダ行としてスキップする
                settings.setInputBufferSize(1000000000);
                settings.setNullValue("");
//                        settings.setNumberOfRecordsToRead(1);
                CsvParser parser = new CsvParser(settings);
                
                try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(s), StandardCharsets.UTF_8));) {
                	parser.beginParsing(br);
                    String[] data;
                    while ((data = parser.parseNext()) != null) {
                        String pid = data[0].split("/")[2];
                        Book book = books.get(pid);
                        if (book != null) {
                            book.title = data[1];
                            //log.info("mokuji {} {}", pid, book.title);
                            book.volume = data[7];
                            book.responsibility = data[8];
                            book.publisher = data[14];
                            book.published = StringUtils.substring(data[32], 0, 4);
                            book.bibId = data[100];
                            book.callNo = data[107];
                            book.index = Arrays.asList(data[25].split("\\|\\|")).stream().filter(i -> StringUtils.isNotBlank(i)).collect(Collectors.toList());
                            book.page = data[182].split("\\|\\|").length;
                        }
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("bookの目次作成完了");
        log.info("bookのindex作成");
        //Index作成
        try {
            ObjectMapper om = new ObjectMapper();
            try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE)) {
                try (EsBulkIndexer pageIndexer = new EsBulkIndexer(ps.pageStore, BULK_INDEX_SIZE)) {
                    books.forEach((pid, book) -> {
                    	//if(bs.bookStore.exists(pid)&&!cleanindexflag) {
                    	if(false) {
                    		log.info("skip indexing {} {}", pid, book.title);
                    	}else{
	                        StringBuilder bookText = new StringBuilder();
	                        try  {
	                            Path splitFile = splitDir.resolve(pid + ".csv");
	                            //Path autoindexFile = autoindexDir.resolve(pid + ".csv");
	                            //Path contrastFile = contrastDir.resolve(pid + ".csv");
	                            Path rightleftFile=rightleftDir.resolve(pid+".csv");
	                            
	                            List<Integer> tocCandList=new ArrayList<>();
	                            
	                            book.autoTOCFlag=false;
	                            if(Files.exists(rightleftFile)) {
	                            	List<String> rightleftList = Files.readAllLines(rightleftFile);
	                            	if(rightleftList.get(0).equals("left"))book.leftopen=true;
	                            	else book.leftopen=false;
	                            }else {
	                            	book.leftopen=false;
	                            }
	                            //List<String> contrastList = Files.readAllLines(contrastFile).stream().map(line -> line).collect(Collectors.toList());
	                            Map<Integer, String>pageContentMap=new HashMap<>();
	                            if(Files.exists(splitFile)) {
	                            	log.info("indexing {} {}", pid, book.title);
		                            Map<String, String[]> pageDivMap = Files.readAllLines(splitFile).stream().map(line -> line.split(",")).collect(Collectors.toMap(ar -> ar[0], ar -> ar));
		                            pageDivMap.forEach((pageStr,divParams)->{
		                            	
		                            	int page = (int) Double.parseDouble(pageStr);
		                            	Page p = new Page();
	                                    p.page = page;
	                                    p.contents = "";
	                                    p.book = pid;
	                                    if(divParams!=null&&divParams.length>=6) {
	                                    	p.divide = Double.parseDouble(divParams[1]);
	                                    	p.rectX = Double.parseDouble(divParams[2]);
	                                    	p.rectY = Double.parseDouble(divParams[3]);
	                                    	p.rectW = Double.parseDouble(divParams[4]);
	                                    	p.rectH = Double.parseDouble(divParams[5]);
	                                    }
	                                    bookText.append(p.contents);
	                                    pageContentMap.put(p.page, p.contents);
	                                    try {
											pageIndexer.add(pid+"_"+page, om.writeValueAsString(p));
											//System.out.println(pid+"_"+pageStr);
										} catch (JsonProcessingException e) {
											// TODO Auto-generated catch block
											e.printStackTrace();
										}
		                            });
		                            if(!cleanindexflag)pageIndexer.flush();
		                            book.contents = bookText.toString().replaceAll("[\r\t\n\ufeff]", "");
		                            if(book.autoTOCFlag) {
			                        	CreateTOC createTOC=new CreateTOC();
			                        	book.autoTOCindex=createTOC.MakeTOC(book, tocCandList,pageContentMap);
			                            //book.contrastparam=contrastList.get(0);
		                            }
		                            bookIndexer.add(pid, om.writeValueAsString(book));
		                            if(!cleanindexflag)bookIndexer.flush();
	                            }
	                        } catch (Exception e) {
	                            e.printStackTrace();
	                        }
                    	}
                    });
                }
            }
        } catch (Throwable ex) {
            log.error("", ex);
        }
    }
}
