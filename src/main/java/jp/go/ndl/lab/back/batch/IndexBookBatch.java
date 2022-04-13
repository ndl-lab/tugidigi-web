package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
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
@Component(IndexBookBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class IndexBookBatch extends AbstractBatch {

    public static final String BATCH_NAME = "index-book";

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, IndexBookBatch.BATCH_NAME, "ignore\\data\\books", "ignore\\data\\export20170724174516_tsv.zip", "ignore\\data\\div", "true");
    }

    @Autowired
    private BookService bs;

    @Autowired
    private PageService ps;

    private static final int BULK_INDEX_SIZE = 100;

    @Override
    public void run(String[] params) {

        Path dataDir = Paths.get(params[0]);
        Path meta = Paths.get(params[1]);
        Path splitDir = Paths.get(params[2]);
        Path autoindexDir = Paths.get(params[3]);
        Path rightleftDir = Paths.get(params[4]);
        Boolean cleanindexflag=(params.length >= 5)?Boolean.parseBoolean(params[5]):false;
        log.info("bookの目次作成");
        if (cleanindexflag) {
            bs.bookStore.deleteByQuery(QueryBuilders.matchAllQuery());
            ps.pageStore.deleteByQuery(QueryBuilders.matchAllQuery());
        }
        //　全文index作成
        Map<String, Book> books = new HashMap<String, Book>();
        try (Stream<Path> list = Files.list(dataDir)) {
            list.forEach(zip -> {
                Book book = new Book();
                String pid = zip.getFileName().toString().replace(".zip", "");
                books.put(pid, book);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("PIDのロード完了");
        try {
            ZipFile zf = new ZipFile(meta.toFile());
            zf.stream().forEach(s -> {
                CsvParserSettings settings = new CsvParserSettings();
                settings.getFormat().setDelimiter('\t');
                settings.setMaxCharsPerColumn(1000000);
                settings.getFormat().setLineSeparator("\n");  // 改行コードは CR+LF
                settings.setHeaderExtractionEnabled(true);      // 1行目はヘッダ行としてスキップする
                settings.setInputBufferSize(100000000);
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
                            log.info("mokuji {} {}", pid, book.title);
                            book.volume = data[7];
                            book.responsibility = data[8];
                            book.publisher = data[14];
                            book.ndc = data[17].split(".")[0];
                            book.published =  StringUtils.substring(data[32], 0, 4);
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
                        log.info("indexing {} {}", pid, book.title);
                        StringBuilder bookText = new StringBuilder();
                        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(dataDir.resolve(pid + ".zip")), StandardCharsets.UTF_8)) {
                            Path splitFile = splitDir.resolve(pid + ".csv");
                            Path autoindexFile = autoindexDir.resolve(pid + ".csv");
                            //Path contrastFile = contrastDir.resolve(pid + ".csv");
                            Path rightleftFile=rightleftDir.resolve(pid+".csv");
                            Map<String, String[]> pageDivMap = Files.readAllLines(splitFile).stream().map(line -> line.split(",")).collect(Collectors.toMap(ar -> ar[0], ar -> ar));
                            List<Integer> tocCandList=new ArrayList<>();
                            
                            if(Files.exists(autoindexFile)) {
                            	book.autoTOCFlag=true;
                            	tocCandList = Files.readAllLines(autoindexFile).stream().map(line -> Integer.parseInt(line)).collect(Collectors.toList());
                            }else {
                            	book.autoTOCFlag=false;
                            }
                            if(Files.exists(rightleftFile)) {
                            	List<String> rightleftList = Files.readAllLines(rightleftFile);
                            	if(rightleftList.get(0).equals("left"))book.leftopen=true;
                            	else book.leftopen=false;
                            }else {
                            	book.leftopen=false;
                            }
                            //List<String> contrastList = Files.readAllLines(contrastFile).stream().map(line -> line).collect(Collectors.toList());
                            Map<Integer, String>pageContentMap=new HashMap<>();
                            ZipEntry zipEntry = zis.getNextEntry();
                            while (zipEntry != null) {
                                String fileName = zipEntry.getName().toString();
                                if (fileName.endsWith(".txt")) {
                                    String[] spl = fileName.replace(".txt", "").split("_");
                                    int page = Integer.parseInt(spl[1]);
                                    String text = IOUtils.toString(zis, StandardCharsets.UTF_16LE);
                                    Page p = new Page();
                                    p.page = page;
                                    p.contents = text;
                                    p.book = pid;
                                    String[] divParams = pageDivMap.get(Integer.toString(p.page));
                                    if(divParams!=null&&divParams.length>=6) {
                                    	p.divide = Double.parseDouble(divParams[1]);
                                    	p.rectX = Double.parseDouble(divParams[2]);
                                    	p.rectY = Double.parseDouble(divParams[3]);
                                    	p.rectW = Double.parseDouble(divParams[4]);
                                    	p.rectH = Double.parseDouble(divParams[5]);
                                    }
                                    bookText.append(p.contents);
                                    pageContentMap.put(p.page, p.contents);
                                    pageIndexer.add(fileName.replace(".txt", ""), om.writeValueAsString(p));
                                    
                                }
                                zipEntry = zis.getNextEntry();
                            }
                            book.contents = bookText.toString().replaceAll("[\r\t\n\ufeff]", "");
                            if(book.autoTOCFlag) {
	                        	CreateTOC createTOC=new CreateTOC();
	                        	book.autoTOCindex=createTOC.MakeTOC(book, tocCandList,pageContentMap);
	                            //book.contrastparam=contrastList.get(0);
                            }
                            bookIndexer.add(pid, om.writeValueAsString(book));
                            if(!cleanindexflag)pageIndexer.flush();
                            if(!cleanindexflag)bookIndexer.flush();
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
