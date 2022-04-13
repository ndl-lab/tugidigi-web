package jp.go.ndl.lab.back.domain;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

import jp.go.ndl.lab.back.infra.EsData;
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
    public int publishyear;
    public String ndc;

    public String bibId;
    public String callNo;
    
    public Boolean autoTOCFlag;
    public String contrastparam;
    public Boolean leftopen;//falseが右開きtrueが左開き

    public List<String> index= new ArrayList<>();
    public List<String> autoTOCindex= new ArrayList<>();
    public List<tagsummary> graphictagmetrics= new ArrayList<>();
    
    public int page;
    public String contents;
    

    //結果を返す時のみ
    public List<String> illustrations;
    public List<String> highlights;
    public List<keywordcounter>keywordsmetrics= new ArrayList<>();
    
    
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
    public static class tagsummary {
    	public String tagname;
        public long count;
        public tagsummary() {
        }
        public tagsummary(String tagName,long count) {
            this.tagname = tagName;
            this.count = count;
        }
    }
    public static class keywordcounter{
    	public String keyword;
    	public int count;
    	public keywordcounter() {
    	}
    	public keywordcounter(String keyword,int count) {
            this.keyword = keyword;
            this.count = count;
        }
    }

}
