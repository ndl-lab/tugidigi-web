package jp.go.ndl.lab.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CookieStore;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.HttpClient;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.protocol.HttpContext;
import org.apache.http.ssl.SSLContextBuilder;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.ConnectException;
import java.net.UnknownHostException;

@Slf4j
public class LabHttpClientBuilder {

    private LabHttpClientBuilder() {

    }

    public static HttpClient create() {
        return create(10, 10000, null, null, false);
    }

    public static CloseableHttpClient create(int retry, int timeout, String userName, String password, boolean followRedirect) {
        SSLContext sslContext = null;
        try {
            sslContext = new SSLContextBuilder()
                    .loadTrustMaterial((chain, authType) -> true)
                    .build();
        } catch (Exception e) {
            log.error("{}", e);
        }

        SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, (String string, SSLSession ssls) -> true);
        CookieStore cs = new BasicCookieStore();
        Registry<ConnectionSocketFactory> registry
                = RegistryBuilder.<ConnectionSocketFactory>create()
                .register("http", PlainConnectionSocketFactory.getSocketFactory())
                .register("https", sslsf)
                .build();
        RequestConfig requestConfig = RequestConfig
                .custom()
                .setConnectTimeout(timeout)
                .setSocketTimeout(timeout)
                .build();
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(registry);
        connectionManager.setMaxTotal(1);
        connectionManager.setDefaultMaxPerRoute(1);
        HttpRequestRetryHandler retryHandler = new HttpRequestRetryHandler() {
            @Override
            public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
                if (exception instanceof java.net.SocketTimeoutException) {
                    return executionCount <= retry;
                } else if (exception instanceof InterruptedIOException
                        || exception instanceof UnknownHostException
                        || exception instanceof ConnectException
                        || exception instanceof SSLException) {
                    return false;
                }
                return executionCount <= retry;
            }
        };

        HttpClientBuilder builder = HttpClientBuilder.create()
                .useSystemProperties()
                .setDefaultCookieStore(cs)
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .setRetryHandler(retryHandler);
        if (!followRedirect) builder.disableRedirectHandling();
//        else builder.setRedirectStrategy(new LaxRedirectStrategy());

        if (!StringUtils.isBlank(userName)) {
            CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(userName, password));
            builder = builder.setDefaultCredentialsProvider(credentialsProvider);
        }

        return builder.build();
    }
}
