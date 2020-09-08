package jp.go.ndl.lab.common.utils;

import jp.go.ndl.lab.common.utils.TempUtils;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;

@Slf4j
public class RunOuterProcess {

    public static class Result {

        public List<String> errors;
        public List<String> outs;
        public int result;
    }

    public static Result run(File wd, String... command) {
        Result r = new Result();
        File tempErrorLog = TempUtils.createTempFile();
        File tempInfoLog = TempUtils.createTempFile();
        log.info("start outer process = {}", String.join(" ", command));
        try {
            Process process = new ProcessBuilder(command)
                    .directory(wd)
                    .redirectError(ProcessBuilder.Redirect.to(tempErrorLog))
                    .redirectOutput(ProcessBuilder.Redirect.to(tempInfoLog))
                    .start();

            r.result = process.waitFor();
            r.errors = FileUtils.readLines(tempErrorLog, "UTF-8");
            r.outs = FileUtils.readLines(tempInfoLog, "UTF-8");
        } catch (IOException ex) {
            r.errors = Arrays.asList(ex.getMessage());
            r.outs = Collections.EMPTY_LIST;
        } catch (InterruptedException ex) {
            r.errors = Arrays.asList(ex.getMessage());
            r.outs = Collections.EMPTY_LIST;
            r.result = -2;
        }

        FileUtils.deleteQuietly(tempErrorLog);
        FileUtils.deleteQuietly(tempInfoLog);
        return r;
    }

    public static Result run(String... command) {
        return run(new File("."), command);
    }

}
