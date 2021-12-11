package jp.go.ndl.lab.back.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class VectorSearchServiceNgtdImpl implements VectorSearchService{

    @Value("${ngtEndPoint}")
    private String ngtUrl;

    private ObjectMapper mapper = new ObjectMapper();
    private RestTemplate restTemplate = new RestTemplate();
    
    @Override
    public LinkedHashMap<String, Float> search(VectorSearchRequest req) {
    	LinkedHashMap<String, Float> resultmap = new LinkedHashMap<>();
        Map<String, Object> params = new HashMap<>();
        params.put("vector", req.vector);
        params.put("size",req.size);
        try {
            ResponseEntity<String> result = restTemplate.postForEntity(ngtUrl+"/search", params, String.class);
            String responsejson = result.getBody();
            JsonNode node = mapper.readTree(responsejson);
            for (JsonNode data : node.get("result")) {
                String id = data.get("id").asText();
                float distance = NumberUtils.toFloat(data.get("distance").asText());
                resultmap.put(id, distance);
            }
        } catch (IOException e) {
            log.error("NGT-ERROR", e);
        }
        return resultmap;
    }
    public LinkedHashMap<String, Float> searchbyid(VectorSearchRequest req) {
    	LinkedHashMap<String, Float> resultmap = new LinkedHashMap<>();
        Map<String, Object> params = new HashMap<>();
        params.put("id", req.id);
        params.put("size", req.size);
        try {
            ResponseEntity<String> result = restTemplate.postForEntity(ngtUrl+"/searchbyid", params, String.class);
            String responsejson = result.getBody();
            JsonNode node = mapper.readTree(responsejson);
            for (JsonNode data : node.get("result")) {
                String resid = data.get("id").asText();
                float distance = NumberUtils.toFloat(data.get("distance").asText());
                resultmap.put(resid, distance);
            }
        } catch (IOException e) {
            log.error("NGT-ERROR", e);
        }
        return resultmap;
    }
	@Override
	public VectorSearchIndexer getIndexer(long wait) {
		// TODO Auto-generated method stub
		return null;
	}

}
