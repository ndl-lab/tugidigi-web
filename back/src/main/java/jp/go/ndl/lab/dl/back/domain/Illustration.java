package jp.go.ndl.lab.dl.back.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jp.go.ndl.lab.dl.back.infra.EsData;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Illustration implements EsData {

    public Long version;

    public String id;

    public String pid;
    public int page;

    public double x;
    public double y;
    public double w;
    public double h;

    public double[] feature;

}
