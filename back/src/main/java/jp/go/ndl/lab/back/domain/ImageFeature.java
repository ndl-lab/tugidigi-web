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
    private Long primaryTerm;
    @EsField
    public String database;
    @EsField
    public String item;

    public Date itemDate;

    public enum ImageType {
        /**
         * 外部データ
         */
        e
    }

    @EsField
    public ImageType type;
    public Integer seq;
    public Integer page;
    public String feature;

    @JsonIgnore
    public List<Float> getFloatList() {
        return Arrays.stream(feature.split(",")).map(s -> Float.parseFloat(s)).collect(Collectors.toList());
    }

    public static String createId(ImageFeature ift) {
        return ift.type + "-" + ift.item + "-" + String.format("%05d", ift.seq);
    }


    public static String defaultId(String itemId) {
        return "t-" + itemId + "-00000";
    }

    public static String getItem(String id) {
        if (id.startsWith("jpsxt")) return id;
        String[] values = id.split("-");
        return values[1] + "-" + values[2];
    }

}
