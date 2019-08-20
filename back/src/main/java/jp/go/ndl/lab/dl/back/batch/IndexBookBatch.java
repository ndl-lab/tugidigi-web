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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import jp.go.ndl.lab.dl.back.Application;
import jp.go.ndl.lab.dl.back.domain.Book;
import jp.go.ndl.lab.dl.back.domain.Page;
import jp.go.ndl.lab.dl.back.infra.EsBulkIndexer;
import jp.go.ndl.lab.dl.back.service.BookService;
import jp.go.ndl.lab.dl.back.service.PageService;
import jp.go.ndl.lab.dl.back.toc.CreateTOC;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.index.query.QueryBuilders;
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
        Path indexDir = Paths.get(params[3]);

        if (params.length >= 5 && Boolean.parseBoolean(params[4])) {
            bs.bookStore.deleteByQuery(QueryBuilders.matchAllQuery());
            ps.pageStore.deleteByQuery(QueryBuilders.matchAllQuery());
        }

        //リスト作成
        Map<String, Book> books = new HashMap<>();
        try (Stream<Path> list = Files.list(dataDir)) {
            list.forEach(zip -> {
                Book book = new Book();
                String pid = zip.getFileName().toString().replace(".zip", "");
                books.put(pid, book);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            LineIterator metaReader = FileUtils.lineIterator(meta.toFile(), "UTF-8");
            ZipFile zf = new ZipFile(meta.toFile());
            zf.stream().forEach(s -> {
                CsvParserSettings settings = new CsvParserSettings();
                settings.getFormat().setDelimiter('\t');
                settings.setMaxCharsPerColumn(1000000);
                settings.getFormat().setLineSeparator("\n");  // 改行コードは CR+LF
                settings.setHeaderExtractionEnabled(true);      // 1行目はヘッダ行としてスキップする
                settings.setInputBufferSize(10000000);
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
                            book.volume = data[7];
                            book.responsibility = data[8];
                            book.publisher = data[14];
                            book.published = StringUtils.substring(data[32], 0, 4);

                            book.bibId = data[100];
                            book.callNo = data[107];

                            book.index = Arrays.asList(data[25].split("\\|\\|")).stream().filter(i -> StringUtils.isNotBlank(i)).collect(Collectors.toList());
                            if (book.index.isEmpty()) {
                                book.index = null;
                                book.autoTOCFlag = true;
                            } else {
                                book.autoTOCFlag = false;
                            }

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

        //Index作成
        try {
            ObjectMapper om = new ObjectMapper();
            try (EsBulkIndexer bookIndexer = new EsBulkIndexer(bs.bookStore, BULK_INDEX_SIZE)) {
                try (EsBulkIndexer pageIndexer = new EsBulkIndexer(ps.pageStore, BULK_INDEX_SIZE)) {
                    books.forEach((pid, book) -> {
                        log.info("indexing {} {}", pid, book.title);
                        StringBuilder bookText = new StringBuilder();
                        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(dataDir.resolve(pid + ".zip")), StandardCharsets.UTF_8)) {
                            Path splitFile = splitDir.resolve(pid + ".csv");
                            Path indexFile = indexDir.resolve(pid + ".csv");
                            Map<String, String[]> pageDivMap = Files.readAllLines(splitFile).stream().map(line -> line.split(",")).collect(Collectors.toMap(ar -> ar[0], ar -> ar));
                            List<Integer> tocCandList = Files.readAllLines(indexFile).stream().map(line -> NumberUtils.toInt(line)).collect(Collectors.toList());
                            Map<Integer, String> pageContentMap = new HashMap<>();
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
                                    p.divide = Double.parseDouble(divParams[1]);
                                    p.rectX = Double.parseDouble(divParams[2]);
                                    p.rectY = Double.parseDouble(divParams[3]);
                                    p.rectW = Double.parseDouble(divParams[4]);
                                    p.rectH = Double.parseDouble(divParams[5]);
                                    bookText.append(p.contents);
                                    pageContentMap.put(p.page, p.contents);
                                    pageIndexer.add(fileName.replace(".txt", ""), om.writeValueAsString(p));
                                }
                                zipEntry = zis.getNextEntry();
                            }
                            book.contents = bookText.toString().replaceAll("[\r\t\n\ufeff]", "");
                            if (book.autoTOCFlag) {
                                CreateTOC createTOC = new CreateTOC();
                                book.index = createTOC.MakeTOC(book, tocCandList, pageContentMap);
                            }
                            bookIndexer.add(pid, om.writeValueAsString(book));
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
