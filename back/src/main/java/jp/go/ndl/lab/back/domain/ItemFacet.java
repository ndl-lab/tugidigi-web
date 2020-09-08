package jp.go.ndl.lab.back.domain;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jp.go.ndl.lab.back.infra.EsData;
import lombok.Data;

@Data
public class ItemFacet {
    public Map<String, Long> counts = new LinkedHashMap<>();
    public String field;
    public void addCount(String key, long count) {
        Long current = counts.get(key);
        if (current == null) {
            current = 0L;
        }
        counts.put(key, (current + count));
    }
}
