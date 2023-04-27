package jp.go.ndl.lab.back.service;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jp.go.ndl.lab.back.domain.ImageFeature;
import jp.go.ndl.lab.back.infra.EsDataStore;
import jp.go.ndl.lab.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.common.utils.IDUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ImageFeatureService {

    @Autowired
    private IllustService is;
    private final EsDataStore<ImageFeature> featureStore;
    public ImageFeatureService(EsDataStoreFactory storeFactory) {
        featureStore = storeFactory.build(ImageFeature.class);
    }

    /**
     * cglib経由で直接フィールドにアクセスするとnullになるので、getterからアクセスする。
     */
    public EsDataStore<ImageFeature> getFeatureStore() {
        return featureStore;
    }

    public static final String EXT_PREFIX = "jdxt";

    public static boolean isExteranlFeature(String id) {
        return id.startsWith(EXT_PREFIX);
    }
    public String putExternalFeature(float[] feature,String hashID) {
        /*if (feature.length != FEATURE_LEN)
            throw new LabException("illegal-feature-length", HttpStatus.BAD_REQUEST);*/
        ImageFeature imf = new ImageFeature();
        imf.id = EXT_PREFIX + "-" + hashID;
        imf.database = EXT_PREFIX;
        imf.feature = StringUtils.join(feature, ',');
        imf.type = ImageFeature.ImageType.e;
        featureStore.create(imf.id, imf, true);
        return imf.id;
    }
    public String putExternalFeatureRand(float[] feature) {
        /*if (feature.length != FEATURE_LEN)
            throw new LabException("illegal-feature-length", HttpStatus.BAD_REQUEST);*/
        ImageFeature imf = new ImageFeature();
        imf.id = EXT_PREFIX + "-" + IDUtils.genid();
        imf.database = EXT_PREFIX;
        imf.feature = StringUtils.join(feature, ',');
        imf.type = ImageFeature.ImageType.e;
        featureStore.create(imf.id, imf, true);
        return imf.id;
    }


    @Autowired
    private  VectorSearchServiceValdImpl  vectorSearchService;

    @Cacheable("jd-imgfeature-search")
    public LinkedHashMap<String, Float> searchById(String id, int size) {
        long start = System.currentTimeMillis();
        try {
            ImageFeature ift = featureStore.get(id);
            if (ift == null) return new LinkedHashMap<>();
            return execute(Arrays.stream(ift.feature.split(",")).map(NumberUtils::toFloat).collect(Collectors.toList()), size);
        } finally {
            log.info("image search {}ms for {}", (System.currentTimeMillis() - start), size);
        }
    }
    
    public boolean existsurlhash(String id) {
    	return featureStore.exists(EXT_PREFIX + "-" +id);
    }
    public float [] getfeatureurlhash(String id) {
    	ImageFeature ift=featureStore.get(EXT_PREFIX + "-" +id);
    	List<Float>listFloat=Arrays.stream(ift.feature.split(",")).map(NumberUtils::toFloat).collect(Collectors.toList());
    	return ArrayUtils.toPrimitive(listFloat.toArray(new Float[0]), 0.0F); 
    }

    private LinkedHashMap<String, Float> execute(List<Float> feature, int size) {
        VectorSearchRequest nsr = new VectorSearchRequest();
        nsr.vector = feature;
        nsr.size = size;
        return vectorSearchService.search(nsr);
    }


}
