package jp.go.ndl.lab.back.batch;

import java.text.SimpleDateFormat;
import java.util.Date;

import jp.go.ndl.lab.common.utils.LabException;
import jp.go.ndl.lab.common.utils.LabUtils;

public abstract class AbstractBatch {

    public abstract void run(String[] params);
    protected void checkParamLen(String[] params, int len) {
        if (params.length < len)
            throw new LabException(LabUtils.format("引数が足りません {}required, got [{}]", len, String.join(" ", params)));
    }
    protected void foolProof(String inputDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
        String proof = sdf.format(new Date());
        if (!inputDate.equals(proof)) {
            throw new RuntimeException("FoolProofによりバッチの起動に失敗しました。");
        }
    }
}
