package jp.go.ndl.lab.common.utils;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class LabFileUtils {

    public static void assureDirectoryExists(Path path) throws IOException {
        if (!Files.exists(path)) Files.createDirectories(path);
    }

    public static InputStream pathToGZIPStream(Path path) throws IOException {
        return new GZIPInputStream(Files.newInputStream(path));
    }

    public static int writeStreamToGZipFile(InputStream input, Path output) throws IOException {
        GZIPOutputStream out = new GZIPOutputStream(Files.newOutputStream(output));
        int size = IOUtils.copy(input, out);
        out.close();
        input.close();
        return size;
    }

    public static DataReader dataReader(Path txtFile) throws IOException {
        return new DataReader(txtFile, false);
    }

    public static Reader reader(Path txtFile) throws IOException {
        return new Reader(txtFile, false);
    }

    public static Writer writer(Path txtFile) throws IOException {
        return new Writer(txtFile, false);
    }

    public static DataReader gDataReader(Path gzipFile) throws IOException {
        return new DataReader(gzipFile, true);
    }

    public static Reader gReader(Path gzipFile) throws IOException {
        return new Reader(gzipFile, true);
    }

    public static Writer gWriter(Path gzipFile) throws IOException {
        return new Writer(gzipFile, true);
    }

    public static class Writer implements AutoCloseable {

        private BufferedWriter writer;

        @Override
        public void close() throws IOException {
            writer.close();
        }

        private Writer(Path gzip, boolean isGZipped) throws IOException {
            if (isGZipped) {
                writer = new BufferedWriter(new OutputStreamWriter(new GZIPOutputStream(Files.newOutputStream(gzip)), StandardCharsets.UTF_8));
            } else {
                writer = new BufferedWriter(new OutputStreamWriter(Files.newOutputStream(gzip), StandardCharsets.UTF_8));
            }
        }

        public void writeData(Object[] data) throws IOException {
            writeLine(Arrays.stream(data).map(o -> Objects.toString(o).replaceAll("\t", " ")).collect(Collectors.joining("\t")));
        }

        public void writeDataV(Object... data) throws IOException {
            writeLine(Arrays.stream(data).map(o -> Objects.toString(o).replaceAll("\t", " ")).collect(Collectors.joining("\t")));
        }

        public void writeLine(String line) throws IOException {
            writer.append(line).append("\n");
        }

        public void writeLines(List<String> lines) throws IOException {
            for (String line : lines) {
                writeLine(line);
            }
        }

    }

    public static class DataReader implements Iterator<String[]>, Iterable<String[]>, AutoCloseable {

        private Reader reader;

        private DataReader(Path gz, boolean isGzipped) throws IOException {
            reader = new Reader(gz, isGzipped);
        }

        @Override
        public boolean hasNext() {
            return reader.hasNext();
        }

        public String[] nextLine() {
            return reader.nextLine().split("\t");
        }

        @Override
        public void close() throws IOException {
            reader.close();
        }

        @Override
        public Iterator<String[]> iterator() {
            return this;
        }

        @Override
        public String[] next() {
            return nextLine();
        }

        public int getLineCount() {
            return reader.getLineCount();
        }

        public boolean isFirstLine() {
            return reader.isFirstLine();
        }

    }

    public static class Reader implements Iterator<String>, Iterable<String>, AutoCloseable {

        private LineIterator it;
        private int lineCount = 0;

        private Reader(Path path, boolean gzipped) throws IOException {
            if (gzipped) {
                it = new LineIterator(new BufferedReader(new InputStreamReader(new GZIPInputStream(Files.newInputStream(path)), StandardCharsets.UTF_8)));
            } else {
                it = new LineIterator(new BufferedReader(new InputStreamReader(Files.newInputStream(path), StandardCharsets.UTF_8)));
            }
        }

        @Override
        public boolean hasNext() {
            return it.hasNext();
        }

        public String nextLine() {
            lineCount++;
            return it.nextLine();
        }

        @Override
        public void close() throws IOException {
            it.close();
        }

        @Override
        public Iterator<String> iterator() {
            return this;
        }

        @Override
        public String next() {
            return nextLine();
        }

        public int getLineCount() {
            return lineCount;
        }

        public boolean isFirstLine() {
            return lineCount <= 1;
        }

    }

}
