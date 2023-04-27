package jp.go.ndl.lab.common.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.util.Arrays;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;

public class AccessIIIFEndpoints {		
	
    public AccessIIIFEndpoints() {
    } 
    public  Boolean PDMChecker(String pid) {
    	Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("10.11.71.1", 8080));
    	HttpURLConnection  urlConn = null;
    	Boolean flag=false;
    	try {
    		String strUrl="https://www.dl.ndl.go.jp/api/iiif/"+pid+"/manifest.json";
    		URL url = new URL(strUrl);
    		//コネクションを取得する
    		//urlConn = (HttpURLConnection) url.openConnection(proxy);
    		urlConn = (HttpURLConnection) url.openConnection();
    		int status = urlConn.getResponseCode();
    		System.out.println(" HTTPステータス:" + status);
    		if(status== HttpURLConnection.HTTP_OK) {
    			BufferedReader br = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line+"\n");
                }
                br.close();
                String jsonStr=sb.toString();
                JSONObject jsonObj = new JSONObject(jsonStr);
                if(jsonObj.getString("@type").equals("sc:Manifest")) {
                	flag=true;
                }
    		}
    	}catch (IOException e) {
    		e.printStackTrace();
    	} finally {
			if (urlConn != null) {
				urlConn.disconnect();
			}
    	}
    	return flag;
    }
}
