package jp.go.ndl.lab.back.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jp.go.ndl.lab.back.infra.EsData;
import jp.go.ndl.lab.back.infra.EsField;
import lombok.Data;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImageFeature implements EsData {

    public String id;

    public Long version;
    private Long seqNo;
    @EsField
    public String database;

    public enum ImageType {
        /**
         * 外部データ
         */
        e
    }

    @EsField
    public ImageType type;
    @EsField
    public String feature;

    @JsonIgnore
    public List<Float> getFloatList() {
        return Arrays.stream(feature.split(",")).map(s -> Float.parseFloat(s)).collect(Collectors.toList());
    }

}
