package jp.go.ndl.lab.back.batch;

import org.apache.commons.lang3.math.NumberUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.primitives.Floats;

import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.domain.Illustration;
import jp.go.ndl.lab.back.domain.Illustration.taginfo;
import jp.go.ndl.lab.back.service.IllustService;
import jp.go.ndl.lab.back.service.ImageFeatureService;
import jp.go.ndl.lab.back.service.VectorSearchService;
import jp.go.ndl.lab.back.service.VectorSearchServiceValdImpl;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component("image-feature-full-index-idlist")
public class ImageFeatureFullIndexFromIdListBatch extends AbstractBatch {

    public static void main(String[] args) throws Exception {
        Application.main(Application.MODE_BATCH, BATCH_NAME, "100", "20", "200715","--spring.profiles.active=vald");
    }

    public static final String BATCH_NAME = "image-feature-full-index-idlist";
    
    @Autowired
    private IllustService is;

    @Autowired
    private VectorSearchServiceValdImpl vectorSearchService;

    long count = 0;
    long skipcount=0;
    @Override
    public void run(String[] params) {
        //checkParamLen(params, 3);
        int num = NumberUtils.toInt(params[0]);
        long wait = NumberUtils.toLong(params[1], 0);
    	String filepath=params[2];
    	foolProof(params[3]);
    	try (VectorSearchServiceValdImpl.VectorSearchIndexer indexer = vectorSearchService.getIndexer(wait)) {
    		 try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(filepath), StandardCharsets.UTF_8));) {
    			String idstr="";
                while ((idstr = br.readLine()) != null) {
                	Illustration imageFeature=is.get(idstr);
                	if(imageFeature==null)continue;
                	List<taginfo> graphictags= imageFeature.getGraphictags();
                	indexer.upsert(imageFeature.id, Floats.asList(imageFeature.feature));
                }
    		 }
        } catch (Exception e) {
            log.error("unknown", e);
        }
    }
}