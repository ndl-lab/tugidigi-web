package jp.go.ndl.lab.back.batch;

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
@Component(AddBookMetaBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class AddBookMetaBatch extends AbstractBatch {

    public static final String BATCH_NAME = "add-bookmeta";

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, IndexBookBatch.BATCH_NAME, "ignore\\data\\books", "ignore\\data\\export20170724174516_tsv.zip", "ignore\\data\\div", "true");
    }

    @Autowired
    private BookService bs;

    private static final int BULK_INDEX_SIZE = 100;

    @Override
    public void run(String[] params) {
    	
        Path meta= Paths.get(params[0]);
        log.info("bookの目次/メタデータ作成");
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
                ObjectMapper om = new ObjectMapper();
                try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE/100)) {
	                try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(s), StandardCharsets.UTF_8));) {
	                    parser.beginParsing(br);
	                    String[] data;
	                    while ((data = parser.parseNext()) != null) {
	                        String pid = data[0].split("/")[2];
	                        Book book = bs.bookStore.get(pid);
	                        if (book != null) {
	                            book.title = data[1];
	                            log.info("mokuji {} {}", pid, book.title);
	                            book.volume = data[7];
	                            book.responsibility = data[8];
	                            book.publisher = data[14];
	                            if(data[17].length()>=3) {
	                            	book.ndc = StringUtils.substring(data[17], 0, 3);
	                            }
	                            try {
	                            	book.published =  StringUtils.substring(data[32], 0, 4);
	                            }catch(NumberFormatException e) {
	                            	
	                            }
	                            book.bibId = data[100];
	                            book.callNo = data[107];
	
	                            book.index = Arrays.asList(data[25].split("\\|\\|")).stream().filter(i -> StringUtils.isNotBlank(i)).collect(Collectors.toList());
	                            
	                            book.page = data[182].split("\\|\\|").length;
	                            
	                            bookIndexer.add(pid, om.writeValueAsString(book));
	                        }
	                    }
	                } catch (Exception ex) {
	                    ex.printStackTrace();
	                }
                } catch (IOException e) {
					e.printStackTrace();
				}
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("bookの目次作成完了");
        
    }
}
