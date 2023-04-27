package jp.go.ndl.lab.back.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jp.go.ndl.lab.common.utils.LabException;

import java.net.URI;

@Service
@Slf4j
public class CLIPTextService {

    private URI endPointURI;

    public CLIPTextService(@Value("${clipTextEndPoint}") String endPoint) throws Exception {
        endPointURI = URI.create(endPoint);
    }

    public static class VectorizeQuery {
        public VectorizeQuery(String keyword) {
            this.keyword = keyword;
        }

        public String keyword;
    }

    public static class VectorizeResult {
        public double[] body;
    }


    private RestTemplate restTemplate = new RestTemplate();

    public double[] vectorizeString(String keyword) {
        ResponseEntity<VectorizeResult> result = restTemplate.exchange(RequestEntity.post(endPointURI).contentType(MediaType.APPLICATION_JSON).body(new VectorizeQuery(keyword)), VectorizeResult.class);
        if (result.getStatusCode() == HttpStatus.OK) {
            return result.getBody().body;
        }
        log.error("cliptext api error {}", result);
        throw LabException.systemErrorException();
    }


}
