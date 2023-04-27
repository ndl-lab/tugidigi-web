package jp.go.ndl.lab.back.batch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.primitives.Doubles;
import com.google.common.primitives.Floats;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.zip.GZIPInputStream;
import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Book.tagsummary;
import jp.go.ndl.lab.back.domain.Illustration;
import jp.go.ndl.lab.back.domain.Illustration.taginfo;
import jp.go.ndl.lab.back.infra.EsBulkIndexer;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.back.service.IllustService;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.io.IOUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
@Slf4j
@Component("index-illustration")
public class IndexIllustrationBatch extends AbstractBatch {

    public static void main(String[] args) throws Exception {
        Application.main("batch", "index-illustration", Paths.get("ignore", "data", "res.csv.gz").toString());
    }

    @Autowired
    private IllustService is;

    @Autowired
    private BookService bs;

    @Override
    public void run(String[] params) {
        //Set<String> ids = new HashSet<>();
    	HashMap<String, String>ids=new HashMap<String, String>();
    	
        /*try {
            bs.bookStore.scroll(QueryBuilders.matchAllQuery(), (book) -> {
                //ids.add(book.id);
            	ids.put(book.id, book.title);
            });
        } catch (Exception ex) {
            log.error("", ex);
        }*/
        
        log.info("book size {}", ids.size());

        //Path file = Paths.get(params[0]);
        File featureDir=new File(params[0]);
        Boolean bookupdateflag=(params.length >= 2)?Boolean.parseBoolean(params[1]):false;
        Boolean cleanindexflag=(params.length >= 3)?Boolean.parseBoolean(params[2]):false;
        Boolean expmodeflag=(params.length >= 4)?Boolean.parseBoolean(params[3]):false;
        if(cleanindexflag) {
        	is.illustStore.deleteByQuery(QueryBuilders.matchAllQuery());
        }
        ObjectMapper om = new ObjectMapper();
        Book bk=new Book();
        try (EsBulkIndexer bookindexer = new EsBulkIndexer(bs.bookStore, 100)) {
	        try (EsBulkIndexer indexer = new EsBulkIndexer(is.illustStore, 100)) {
	        	for(File featurefile :featureDir.listFiles()) {
	        		String filename=featurefile.getName();
	            	String pid=filename.substring(0,filename.lastIndexOf('.'));
	            	System.out.println("Current target PID:"+pid);
	            	if(bookupdateflag){
	            		bk=bs.bookStore.get(pid);
	            		if(bk==null)continue;
	            	}
	            	List graphictagsummary=new ArrayList<String>();
		            try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(featurefile), StandardCharsets.UTF_8));) {
		            	String jsonstr;
		                while ((jsonstr = br.readLine()) != null) {
		                	JSONObject json = new JSONObject(jsonstr);
		                    //if (ids.containsKey(pid)) {
		                	if (true) {
		                        Illustration ii = new Illustration();
		                        String illustid=json.getString("id");
		                        ii.pid = pid;
		                        ii.title=ids.get(pid);
		                        ii.page = json.getInt("page");
		                        ii.x = json.getDouble("x");
		                        ii.y = json.getDouble("y");
		                        ii.w = json.getDouble("w");
		                        ii.h = json.getDouble("h");
		                        double dfeatures[] = Arrays.stream(json.getString("feature").replaceAll("\\[|\\]", "").split(",")).mapToDouble(s -> Double.parseDouble(s)).toArray();
		                        ii.feature=Floats.toArray(Doubles.asList(dfeatures));
		                        if(expmodeflag) {
		                        	double dfeatures_txt2vec[] = Arrays.stream(json.getString("feature_txtvec").replaceAll("\\[|\\]", "").split(",")).mapToDouble(s -> Double.parseDouble(s)).toArray();
			                        ii.feature_txt2vec=Floats.toArray(Doubles.asList(dfeatures_txt2vec));
		                        }
		                        JSONArray graphictagArray=(JSONArray) json.get("graphictags");
		                        for(int ai=0; ai < graphictagArray.length(); ai++) {
		                        	String tag=graphictagArray.getJSONObject(ai).getString("tag");
		                        	double confidence=graphictagArray.getJSONObject(ai).getDouble("confidence");
		                        	if(confidence>0.9) {
			                        	ii.graphictags.add(new taginfo(tag,confidence));
			                        	graphictagsummary.add(tag);
		                        	}
		                        }
		                        System.out.println(illustid);
		                        indexer.add(illustid, om.writeValueAsString(ii));
		                    }
			                
		                }
		                if(!cleanindexflag)indexer.flush();
		            } catch (Exception e) {
		                e.printStackTrace();
		            }
		            if(bookupdateflag) {
			            Map<String, Long> graphicmap=(HashMap<String, Long>) graphictagsummary.stream().collect(Collectors.groupingBy(x->x, Collectors.counting()));
			            bk.graphictagmetrics=new ArrayList<>();
			            for(Map.Entry<String, Long> entry : graphicmap.entrySet()) {
			            	bk.graphictagmetrics.add(new tagsummary(entry.getKey(),entry.getValue()));
			            }
		            	System.out.println(bk.title);
		            	bookindexer.add(pid, om.writeValueAsString(bk));
			            bookindexer.flush();
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
