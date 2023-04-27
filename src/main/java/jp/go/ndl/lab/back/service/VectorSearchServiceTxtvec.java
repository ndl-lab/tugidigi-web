
package jp.go.ndl.lab.back.service;

import java.io.Closeable;
import java.util.LinkedHashMap;
import java.util.List;


public interface VectorSearchServiceTxtvec {

    LinkedHashMap<String,Float> search(VectorSearchRequest req);
    LinkedHashMap<String,Float> searchbyid(VectorSearchRequest req);
    VectorSearchIndexer getIndexer(long wait);

    public interface VectorSearchIndexer extends Closeable {
        void upsert(String id, List<Float> vector);
        void insert(String id, List<Float> vector);

        void delete(String id);

        @Override
        void close();
    }


}
