package jp.go.ndl.lab.dl.back.domain;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;


import jp.go.ndl.lab.dl.back.domain.Page;
import jp.go.ndl.lab.dl.back.infra.EsData;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Book implements EsData {

    public String id;//cid
    public Long version;

    public String title;
    public String volume;
    public String responsibility;
    public String publisher;
    public String published;

    public String bibId;
    public String callNo;
    
    public Boolean autoTOCFlag;
    

    public List<String> index= new ArrayList<>();
    public int page;
    public String contents;

    //結果を返す時のみ
    public List<String> illustrations;
    public List<String> highlights;
    
    
    public static class autoIndex {

        public String indexName;
        public int page;
        public double score;

        public autoIndex() {
        }

        @Override
        public String toString() {
            return indexName + "\t" + page + "\t" + score;
        }

        public autoIndex(String indexName, int page, double score) {
            this.indexName = indexName;
            this.page = page;
            this.score = score;
        }
    }
    

}
