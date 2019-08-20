package jp.go.ndl.lab.dl.back.service;

import jp.go.ndl.lab.dl.back.domain.Illustration;
import jp.go.ndl.lab.dl.back.infra.EsDataStore;
import jp.go.ndl.lab.dl.back.infra.EsDataStoreFactory;
import jp.go.ndl.lab.dl.back.infra.EsSearchResult;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

@Service
public class IllustService {

    public final EsDataStore<Illustration> illustStore;

    public IllustService(EsDataStoreFactory storeFactory) {
        illustStore = storeFactory.build(Illustration.class);
    }

    public Illustration get(String id) {
        return illustStore.get(id);
    }

    public EsSearchResult<Illustration> search(SearchSourceBuilder ssb) {
        return illustStore.search(ssb);
    }

}
