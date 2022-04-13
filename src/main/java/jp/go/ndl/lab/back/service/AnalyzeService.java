package jp.go.ndl.lab.back.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.LineCoordFormat;
import jp.go.ndl.lab.back.domain.Page;
import jp.go.ndl.lab.back.infra.EsDataStore;
import jp.go.ndl.lab.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.back.infra.EsSearchResult;

import org.elasticsearch.client.indices.AnalyzeRequest;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AnalyzeService {
	public final EsDataStore<Book> bookStore;
	
    public AnalyzeService(EsDataStoreFactory storeFactory) {
        bookStore = storeFactory.build(Book.class);
    }
    public String normalizeString(String querystr) {
		AnalyzeRequest request = AnalyzeRequest.buildCustomAnalyzer("jd_book","whitespace")
    		    .addCharFilter("normalize_char_filter") 
    		    .build(querystr);
		List<String> response=bookStore.normalize(request);
    	return response.get(0);
    	
    }
    public Page normalizeCoordJson(Page p) {
    	ObjectMapper mapper = new ObjectMapper();
    	String resval="";
    	try {
    		List<LineCoordFormat>CoordList=mapper.readValue(p.coordjson, new TypeReference<List<LineCoordFormat>>(){});
			List<String>coordcontent=new ArrayList<>();
			for(LineCoordFormat wlc:CoordList) {
				String tmp=wlc.contenttext.replaceAll(" ","");
				if(tmp==null||tmp.length()==0)coordcontent.add("〓");
				else coordcontent.add(tmp);
			}
			AnalyzeRequest request = AnalyzeRequest.buildCustomAnalyzer("jd_book","whitespace")
	    		    .addCharFilter("normalize_char_filter") 
	    		    .build(coordcontent.stream().toArray(String[]::new ));
			List<String> response=bookStore.normalize(request);
			for(int i=0;i<Math.min(CoordList.size(),response.size());i++) {
				CoordList.get(i).contenttext=response.get(i);
			}
			p.coordjson=mapper.writeValueAsString(CoordList);
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return p;
    }
}
