package jp.go.ndl.lab.dl.back.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.GZIPInputStream;
import jp.go.ndl.lab.dl.back.Application;
import jp.go.ndl.lab.dl.back.domain.Illustration;
import jp.go.ndl.lab.dl.back.infra.EsBulkIndexer;
import jp.go.ndl.lab.dl.back.service.BookService;
import jp.go.ndl.lab.dl.back.service.IllustService;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Slf4j
@Component("index-illustration")
@Profile({Application.MODE_BATCH})
@Lazy
public class IndexIllustrationBatch extends AbstractBatch {

    @Autowired
    private IllustService is;

    @Autowired
    private BookService bs;

    @Override
    public void run(String[] params) {
        Set<String> ids = new HashSet<>();

        try {
            bs.bookStore.scroll(QueryBuilders.matchAllQuery(), (book) -> {
                ids.add(book.id);
            });
        } catch (Exception ex) {
            log.error("", ex);
        }

        log.info("book size {}", ids.size());

        Path file = Paths.get(params[0]);
        CsvParserSettings settings = new CsvParserSettings();
        settings.getFormat().setDelimiter(',');
        settings.getFormat().setQuote('"');
        settings.getFormat().setLineSeparator("\r\n");
        settings.setMaxCharsPerColumn(1000000);
        settings.setHeaderExtractionEnabled(true);
        settings.setInputBufferSize(10000000);
        settings.setNullValue("");
        CsvParser parser = new CsvParser(settings);
        ObjectMapper om = new ObjectMapper();

        is.illustStore.deleteByQuery(QueryBuilders.matchAllQuery());

        try (EsBulkIndexer indexer = new EsBulkIndexer(is.illustStore, 100)) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(new GZIPInputStream(Files.newInputStream(file)), StandardCharsets.UTF_8));) {
                parser.beginParsing(br);
                String[] data;
                while ((data = parser.parseNext()) != null) {
                    String a[] = data[1].split("/");
                    if (ids.contains(a[0])) {
                        Illustration ii = new Illustration();
                        ii.pid = a[0];
                        ii.page = Integer.parseInt(a[1].substring(1));
                        String[] zahyo = a[2].substring(4).split(",");
                        ii.x = Double.parseDouble(zahyo[0]);
                        ii.y = Double.parseDouble(zahyo[1]);
                        ii.w = Double.parseDouble(zahyo[2]);
                        ii.h = Double.parseDouble(zahyo[3]);

                        ii.feature = Arrays.stream(data[2].replaceAll("\\[|\\]", "").split(",")).mapToDouble(s -> Double.parseDouble(s)).toArray();
                        indexer.add(data[0], om.writeValueAsString(ii));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
