package jp.go.ndl.lab.common.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class FoolProofUtil {

    public static void check(String inputDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
        String proof = sdf.format(new Date());
        if (!inputDate.equals(proof)) {
            System.out.println("いともった？");
            throw new RuntimeException("誤動作を防止するため、この処理を実行するには、本日の日付をyyMMddの形式でパラメータに追加する必要があります。");
        }
    }
}
