package jp.go.ndl.lab.back.batch;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;

import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;

import jp.go.ndl.lab.back.Application;
import jp.go.ndl.lab.back.service.BookService;
import jp.go.ndl.lab.back.service.IllustService;
import jp.go.ndl.lab.back.service.PageService;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component("auto-delete-book")
public class AutoDeleteBookBatch extends AbstractBatch {

    public static void main(String[] args) throws Exception {
        Application.main("batch", "auto-delete-book", "801459");
    }

    @Autowired
    private IllustService is;

    @Autowired
    private BookService bs;

    @Autowired
    private PageService ps;

    @Override
    public void run(String[] params) {
    	HashMap<String, String>ids=new HashMap<String, String>();
    	//Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("10.11.71.1", 8080));
        try {
            bs.bookStore.scroll(QueryBuilders.matchAllQuery(), (book) -> {
            	ids.put(book.id, book.title);
            });
        } catch (Exception ex) {
            log.error("", ex);
        }
        ids.forEach((pid, title) -> {
        	HttpURLConnection  urlConn = null;
        	try {
        		String strUrl="https://www.dl.ndl.go.jp/api/iiif/"+pid+"/F0000001/full/full/0/default.jpg";
        		URL url = new URL(strUrl);
        		//コネクションを取得する
        		urlConn = (HttpURLConnection) url.openConnection();
        		int status = urlConn.getResponseCode();
        		System.out.println(title+" HTTPステータス:" + status);
        		if(status==404) {
        			System.out.println("削除対象:"+title+":pid:"+pid);
        			try {
                        bs.bookStore.delete(pid);
                        ps.pageStore.deleteByQuery(QueryBuilders.termQuery("book", pid));
                        is.illustStore.deleteByQuery(QueryBuilders.termQuery("pid", pid));
                    } catch (Exception e) {
                        log.error(pid, e);
                    }
        		}
        	}catch (IOException e) {
        		e.printStackTrace();
        	} finally {
				if (urlConn != null) {
					urlConn.disconnect();
				}
        	}
        });
    }
}
