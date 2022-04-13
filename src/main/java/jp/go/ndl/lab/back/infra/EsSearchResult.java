package jp.go.ndl.lab.back.infra;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import jp.go.ndl.lab.back.domain.ItemFacet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.elasticsearch.action.search.SearchResponse;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EsSearchResult<E> implements Iterable<E> {

    public EsSearchResult() {
    }

    @Override
    public Iterator<E> iterator() {
        return list.iterator();
    }

    //public Map<String, Map<String, Long>> facets = new HashMap<>();
    public List<ItemFacet>  facets;
    public List<E> list = new ArrayList<>();
    public long hit;
    public int from;

    @JsonIgnore
    public SearchResponse searchResponse;

}
