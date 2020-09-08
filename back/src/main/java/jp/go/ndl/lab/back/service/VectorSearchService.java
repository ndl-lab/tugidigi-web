package jp.go.ndl.lab.back.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class VectorSearchService {

    @Value("${ngt}")
    private String ngtUrl;

    private ObjectMapper mapper = new ObjectMapper();
    private RestTemplate restTemplate = new RestTemplate();

    public Map<String, Double> searchbyfeature(double[] feature, int size) {
        HashMap<String, Double> resultmap = new HashMap<>();
        Map<String, Object> params = new HashMap<>();
        params.put("vector", feature);
        params.put("size", size);
        try {
            ResponseEntity<String> result = restTemplate.postForEntity(ngtUrl, params, String.class);
            String responsejson = result.getBody();
            JsonNode node = mapper.readTree(responsejson);
            for (JsonNode data : node.get("result")) {
                String id = data.get("id").asText();
                double distance = NumberUtils.toDouble(data.get("distance").asText());
                resultmap.put(id, distance);
            }
        } catch (IOException e) {
            log.error("NGT-ERROR", e);
        }
        return resultmap;
    }
    public Map<String, Double> searchbyid(String id, int size) {
        HashMap<String, Double> resultmap = new HashMap<>();
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("size", size);
        try {
            ResponseEntity<String> result = restTemplate.postForEntity(ngtUrl+"byid", params, String.class);
            String responsejson = result.getBody();
            JsonNode node = mapper.readTree(responsejson);
            for (JsonNode data : node.get("result")) {
                String resid = data.get("id").asText();
                double distance = NumberUtils.toDouble(data.get("distance").asText());
                resultmap.put(resid, distance);
            }
        } catch (IOException e) {
            log.error("NGT-ERROR", e);
        }
        return resultmap;
    }

}
