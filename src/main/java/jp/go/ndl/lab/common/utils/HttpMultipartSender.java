package jp.go.ndl.lab.common.utils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.io.IOUtils;

public class HttpMultipartSender {

    private HttpMultipartSender() {
    } // cannot make instance

    public static void sendMultipart(HttpURLConnection connection, String filefield, File filepath) throws IOException {
        sendMultipart(connection, filefield, filepath, Collections.EMPTY_MAP);
    }

    public static void sendMultipart(HttpURLConnection connection, String filefield, File filepath, Map<String, String> textdata) throws IOException {

        final String twoHyphens = "--";
        final String boundary = "*****" + UUID.randomUUID().toString() + "*****";
        final String lineEnd = "\r\n";
        final int maxBufferSize = 1024 * 1024 * 3;

        connection.setDoInput(true);
        connection.setDoOutput(true);
        connection.setUseCaches(false);
        connection.setChunkedStreamingMode(maxBufferSize);
        connection.setConnectTimeout(0);
        connection.setReadTimeout(0);

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Connection", "Keep-Alive");
        connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

        try (BufferedOutputStream outputStream = new BufferedOutputStream(connection.getOutputStream())) {
            outputStream.write((twoHyphens + boundary + lineEnd).getBytes());
            outputStream.write(("Content-Disposition: form-data; name=\"" + filefield + "\"; filename=\"" + filepath.getName() + "\"" + lineEnd).getBytes());
//            outputStream.write(("Content-Type: application/octet-stream" + lineEnd).getBytes());
//            outputStream.write(("Content-Transfer-Encoding: binary" + lineEnd).getBytes());
            outputStream.write(lineEnd.getBytes());

            try (FileInputStream fileInputStream = new FileInputStream(filepath)) {
                int bytesAvailable = fileInputStream.available();
                int bufferSize = Math.min(bytesAvailable, maxBufferSize);
                byte[] buffer = new byte[bufferSize];

                int bytesRead = fileInputStream.read(buffer, 0, bufferSize);
                while (bytesRead > 0) {
                    outputStream.write(buffer, 0, bufferSize);
                    bytesAvailable = fileInputStream.available();
                    bufferSize = Math.min(bytesAvailable, maxBufferSize);
                    bytesRead = fileInputStream.read(buffer, 0, bufferSize);
                    outputStream.flush();
                }
            }

            outputStream.write(lineEnd.getBytes());

//        for (Map.Entry<String, String> entry : textdata.entrySet()) {
//            outputStream.writeBytes(twoHyphens + boundary + lineEnd);
//            outputStream.writeBytes("Content-Disposition: form-data; name=\"" + entry.getKey() + "\"" + lineEnd);
//            outputStream.writeBytes("Content-Type: text/plain" + lineEnd);
//            outputStream.writeBytes(lineEnd);
//            outputStream.writeBytes(entry.getValue());
//            outputStream.writeBytes(lineEnd);
//        }
            outputStream.write((twoHyphens + boundary + twoHyphens).getBytes());
            outputStream.flush();
        }
    }
}
