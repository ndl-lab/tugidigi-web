package jp.go.ndl.lab.common.utils;

import org.springframework.http.HttpStatus;


/**
 * 例外クラス
 */
public class LabException extends RuntimeException {

    public static LabException notFoundException() {
        return new LabException("not-found", HttpStatus.NOT_FOUND);
    }

    public static LabException nullInputException() {
        return new LabException("null-input", HttpStatus.BAD_REQUEST);
    }

    public static LabException permissionDeneidException(String id) {
        LabException ex = new LabException("permission-denied", HttpStatus.FORBIDDEN);
        ex.detail = id;
        return ex;
    }

    public static LabException permissionDeneidException() {
        return new LabException("permission-denied", HttpStatus.FORBIDDEN);
    }

    public static LabException systemErrorException() {
        return new LabException("system-error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    private String code;
    private HttpStatus status;
    private String detail;
    private String[] info;

    public LabException(String code) {
        super(code);
        this.code = code;
    }

    public LabException(String code, HttpStatus status) {
        super(code);
        this.code = code;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public String[] getInfo() {
        return info;
    }

    public HttpStatus getHttpStatus() {
        return status;
    }

    public LabException(String code, HttpStatus status, String detail, Object... infos) {
        super(code + ":" + LabUtils.format(detail, infos));
        this.code = code;
        this.status = status;
        this.info = LabUtils.obj2Str(infos);
        this.detail = LabUtils.format(detail, infos);
    }

    public LabException withInfo(String detail, Object... infos) {
        return new LabException(this.getCode(), this.getHttpStatus(), detail, infos);
    }
    public static LabException idDuplicateException() {
        return new LabException("id-duplicate", HttpStatus.BAD_REQUEST);
    }
}
