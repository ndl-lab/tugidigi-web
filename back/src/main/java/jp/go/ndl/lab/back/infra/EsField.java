package jp.go.ndl.lab.back.infra;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;

/**
 * Validationの対象外となるフィールド
 */
@Target({FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EsField {

    String type() default "";

    boolean keyword() default false;

    boolean sort() default false;

    public static final String TYPE_TEXT = "text";
    public static final String TYPE_KEYWORD = "keyword";
    public static final String TYPE_BOOLEAN = "boolean";
    public static final String TYPE_INT = "long";
    public static final String TYPE_DOUBLE = "double";
    public static final String TYPE_DATE = "date";

}
