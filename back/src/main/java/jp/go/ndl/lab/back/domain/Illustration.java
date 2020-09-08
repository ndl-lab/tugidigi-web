package jp.go.ndl.lab.back.domain;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import jp.go.ndl.lab.back.infra.EsData;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Illustration implements EsData {
    public Long version;

    public String id;

    public String pid;
    public String title;
    
    public int page;

    public double x;
    public double y;
    public double w;
    public double h;
    
    public List<taginfo> graphictags= new ArrayList<>();
    public static class taginfo {
    	public String tagname;
        public double confidence;
        public taginfo() {
        }
        
        public taginfo(String tagName,double confidence) {
            this.tagname = tagName;
            this.confidence = confidence;
        }
    }
    
    
    public double[] feature;

}
