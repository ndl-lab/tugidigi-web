package jp.go.ndl.lab.common.utils;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.hashids.Hashids;

import java.security.SecureRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class IDUtils {

    public static String md5HashId(String input) {
        return HASH_IDS.encodeHex(DigestUtils.md5Hex(input));
    }

    /**
     * [0-9a-zA-Z_]以外の文字をBase62でエンコードする。
     *
     * @param s
     * @return
     */
    public static String idEncode(String s) {
        s = s.replaceAll("[\\-\\.,\\s　]", "_");
        Pattern p = Pattern.compile("[^0-9a-zA-Z_]+");
        Matcher m = p.matcher(s);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, HASH_IDS.encode(m.group().chars().mapToLong(c -> c).toArray()));
        }
        m.appendTail(sb);

        return sb.toString();
    }

    public static String idEncodeOld(String s) {
        Pattern p = Pattern.compile("[^0-9a-zA-Z_]");
        Matcher m = p.matcher(s);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, HASH_IDS.encodeHex(Long.toHexString(m.group().charAt(0))));
        }
        m.appendTail(sb);
        return sb.toString();
    }
    /**
     * 接頭辞として
     */
    public static String genidOf(String of) {
        return of + "-" + genid();
    }

    public static String hashId(String input) {
        return HASH_IDS.encodeHex(input);
    }

    private static SecureRandom RAND = new SecureRandom();

    public static String genid() {
        return HASH_IDS.encode(Math.abs(nextLong(9007199254740992L)));
    }

    public static String randomIdForKube() {
        return RandomStringUtils.randomAlphabetic(10).toLowerCase();
    }

    public static long nextLong(long n) {
        long bits, value;
        do {
            bits = RAND.nextLong();
            if (bits < 0) bits -= Long.MIN_VALUE;
            value = bits % n;
        } while (bits - value + (n - 1) < 0);
        return value;
    }

    private static Hashids HASH_IDS = new Hashids("japan-search");
}
