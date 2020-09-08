package jp.go.ndl.lab.back.domain;

import java.util.List;
import jp.go.ndl.lab.back.infra.EsData;
import lombok.Data;

@Data
public class Page implements EsData {
    public Long version;
    public String id;//pid_pg

    public String book;//id

    public int page;
    

    public double divide;
    public double rectX;
    public double rectY;
    public double rectW;
    public double rectH;

    public String contents;

    public List<String> highlights;

}
