package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.zip.ZipFile;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.infra.EsBulkIndexer;
import jp.go.ndl.lab.back.service.BookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 *
 * ItemのIndexを作成するバッチ
 *
 */
@Component(AddClassicInfoBatch.BATCH_NAME)
@Profile({Application.MODE_BATCH})
@Lazy
@Slf4j
public class AddClassicInfoBatch extends AbstractBatch {

    public static final String BATCH_NAME = "add-classicinfo";

    public static void main(String[] args) throws Throwable {
        Application.main(Application.MODE_BATCH, IndexBookBatch.BATCH_NAME, "ignore\\data\\books", "ignore\\data\\export20170724174516_tsv.zip", "ignore\\data\\div", "true");
    }
    
    @Autowired
    private BookService bs;

    private static final int BULK_INDEX_SIZE = 100;

    @Override
    public void run(String[] params) {
    	
        Path meta= Paths.get(params[0]);
        Boolean classicflag=Boolean.parseBoolean(params[1]);
        log.info("bookの古典籍フラグ追加:{}",classicflag);
        try {
            @SuppressWarnings("resource")
			ZipFile zf = new ZipFile(meta.toFile());
            zf.stream().forEach(s -> {
                CsvParserSettings settings = new CsvParserSettings();
                settings.getFormat().setDelimiter('\t');
                settings.setMaxCharsPerColumn(1000000);
                settings.getFormat().setLineSeparator("\n");  // 改行コードは CR+LF
                settings.setHeaderExtractionEnabled(true);      // 1行目はヘッダ行としてスキップする
                settings.setInputBufferSize(100000000);
                settings.setNullValue("");
                CsvParser parser = new CsvParser(settings);
                ObjectMapper om = new ObjectMapper();
                try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE/100)) {
	                try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(s), StandardCharsets.UTF_8));) {
	                    parser.beginParsing(br);
	                    String[] data;
	                    while ((data = parser.parseNext()) != null) {
	                        String pid = data[0].split("/")[5];
	                        log.info("PID:{}",pid);
	                        Book book = bs.bookStore.get(pid);
	                        if (book != null) {
	                        	book.isClassic=classicflag;
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
        log.info("bookの古典籍フラグ追加完了");
        
    }
}
