package jp.go.ndl.lab.back.infra;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EsDataStoreFactory {

    private String host,host2;
    private int port,port2;
    private String path,path2;
    private String scheme,scheme2;
    public EsDataStoreFactory(@Value("${es.endPoint}")String endPoint,@Value("${es.endPoint2}")String endPoint2) {
    	URI uri,uri2;
		try {
			uri = new URI(endPoint);
			 this.host =uri.getHost() ;
		     this.port = uri.getPort();
		     this.scheme= uri.getScheme();
		     uri2 = new URI(endPoint2);
			 this.host2 =uri2.getHost() ;
		     this.port2 = uri2.getPort();
		     this.scheme2= uri2.getScheme();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
       
    }

    public EsDataStore build(Class clazz) {
    		return new EsDataStore(host, port, path,scheme, "jd_" + clazz.getSimpleName().toLowerCase(), clazz);
    }

}
