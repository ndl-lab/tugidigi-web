package jp.go.ndl.lab.common.utils;


import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.text.TextStringBuilder;
import org.slf4j.helpers.MessageFormatter;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class LabUtils {

    public static String[] obj2Str(Object... objects) {
        if (objects == null) {
            return null;
        }
        String[] str = new String[objects.length];
        for (int i = 0; i < str.length; i++) {
            str[i] = Objects.toString(objects[i], "");
        }
        return str;
    }

    public static String format(String msg, Object... parameters) {
        return MessageFormatter.arrayFormat(msg, parameters).getMessage();
    }

    public static boolean hasNullByte(String input) {
        if (StringUtils.isEmpty(input)) {
            return false;
        }
        return input.codePoints().anyMatch(i -> Character.isISOControl(i));
    }

    public static boolean hasNullByteExceptRet(String input) {
        if (StringUtils.isEmpty(input)) {
            return false;
        }
        return input.codePoints().anyMatch(i -> i != '\n' || Character.isISOControl(i));
    }

    public static String removeNullBytes(String input) {
        if (StringUtils.isEmpty(input)) {
            return "";
        }
        return input.codePoints()
                .filter(cp -> !Character.isISOControl(cp))
                .collect(
                        StringBuilder::new,
                        StringBuilder::appendCodePoint,
                        StringBuilder::append)
                .toString();
    }

    public static String removeNullBytesExceptReturn(String input) {
        if (StringUtils.isEmpty(input)) {
            return "";
        }
        return input.codePoints()
                .filter(cp -> cp == '\n' || !Character.isISOControl(cp))
                .collect(
                        StringBuilder::new,
                        StringBuilder::appendCodePoint,
                        StringBuilder::append)
                .toString();
    }

    public static boolean hasNullByte(String... inputs) {
        for (String input : inputs) {
            if (hasNullByte(input)) {
                return true;
            }
        }
        return false;
    }

    public static boolean containsJapanese(String str) {
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            Character.UnicodeBlock unicodeBlock = Character.UnicodeBlock.of(ch);

            if (Character.UnicodeBlock.HIRAGANA.equals(unicodeBlock)) {
                return true;
            }

            if (Character.UnicodeBlock.KATAKANA.equals(unicodeBlock)) {
                return true;
            }

            if (Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS.equals(unicodeBlock)) {
                return true;
            }

            if (Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS.equals(unicodeBlock)) {
                return true;
            }

            if (Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION.equals(unicodeBlock)) {
                return true;
            }
        }
        return false;
    }

    public static int intRangeCheck(int value, int min, int max) {
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        return value;
    }

    public static int parseIntWithLimit(String value, int min, int max, int defValue) {
        int parsed = NumberUtils.toInt(value, defValue);
        if (parsed < min) {
            parsed = min;
        }
        if (parsed > max) {
            parsed = max;
        }
        return parsed;
    }

    public static <T> boolean firstIs(List<T> list, Predicate<T> p) {
        if (list == null || list.isEmpty()) {
            return false;
        } else {
            T first = list.get(0);
            return p.test(first);
        }
    }

    public static Map<String, String> readKeyValues(Path path) {
        try {
            return Files.readAllLines(path).stream().map(line -> line.split("\t", 2)).collect(Collectors.toMap(data -> data[0], data -> data[1]));
        } catch (IOException ex) {
            return MapUtils.EMPTY_SORTED_MAP;
        }
    }

    public static String singleLineStackTrace(Throwable t) {
        TextStringBuilder s = new TextStringBuilder();
        for (StackTraceElement ste : t.getStackTrace()) {
//            s.appendSeparator("|").append(ste.getClassName()).append("@").append(ste.getMethodName()).append("@").append(ste.getLineNumber());
            s.appendSeparator("\n").append(ste.getClassName()).append("@").append(ste.getMethodName()).append("@").append(ste.getLineNumber());

        }
        return s.build().replaceAll("[\n\r]+", "");
    }

}
