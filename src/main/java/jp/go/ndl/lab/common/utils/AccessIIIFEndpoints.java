package jp.go.ndl.lab.common.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
@Slf4j
public class AccessIIIFEndpoints {		
	
    public AccessIIIFEndpoints() {
    } 
    public ArrayList<String> getimageList(String pid) {
    	ArrayList<String>urlList=new ArrayList<String>();
    	HttpURLConnection  urlConn = null;
    	try {
    		String strUrl="https://www.dl.ndl.go.jp/api/iiif/"+pid+"/manifest.json";
    		URL url = new URL(strUrl);
    		//コネクションを取得する
    		//urlConn = (HttpURLConnection) url.openConnection(proxy);
    		urlConn = (HttpURLConnection) url.openConnection();
    		urlConn.setReadTimeout(10000);
    		urlConn.setConnectTimeout(10000);
    		int status = urlConn.getResponseCode();
    		log.info(" HTTPステータス:" + status);
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
                	JSONObject jsonSequence = jsonObj.getJSONArray("sequences").getJSONObject(0);
                	JSONArray jsonCanvases=jsonSequence.getJSONArray("canvases");
                	for (int i=0; i <  jsonCanvases.length(); i++) {
                		JSONObject canvas=jsonCanvases.getJSONObject(i);
                		String targeturl= canvas.getJSONArray("images").getJSONObject(0).getJSONObject("resource").getString("@id");
                		urlList.add(targeturl);
                	}
                }
    		}
    	}catch (IOException e) {
    		e.printStackTrace();
    	} finally {
			if (urlConn != null) {
				urlConn.disconnect();
			}
    	}
    	return urlList;
    }
    public  Boolean PDMChecker(String pid) {
    	HttpURLConnection  urlConn = null;
    	try {
    		String strUrl="https://www.dl.ndl.go.jp/api/iiif/"+pid+"/manifest.json";
    		URL url = new URL(strUrl);
    		//コネクションを取得する
    		//urlConn = (HttpURLConnection) url.openConnection(proxy);
    		urlConn = (HttpURLConnection) url.openConnection();
    		urlConn.setReadTimeout(10000);
    		urlConn.setConnectTimeout(10000);
    		int status = urlConn.getResponseCode();
    		log.info(" HTTPステータス:" + status);
    		if(status== HttpURLConnection.HTTP_OK) {
    			return true;
    		}
    	}catch (IOException e) {
    		e.printStackTrace();
    		return false;
    	} finally {
			if (urlConn != null) {
				urlConn.disconnect();
			}
    	}
    	return false;
    }
    public Boolean PDMCheckerLight(String pid) {
    	HttpURLConnection  urlConn = null;
        try {
        	//https://dl.ndl.go.jp/api/iiif/1463527/R0000099/full/full/0/default.jpg
        	//https://dl.ndl.go.jp/api/iiif/1463527/R0000099/full/full/0/default.jpg
            //https://www.dl.ndl.go.jp/api/iiif/969510/R0000001/info.json
        	//String strUrl="https://www.dl.ndl.go.jp/api/iiif/"+pid+"/T0000001/full/full/0/default.jpg";
        	String strUrl="https://www.dl.ndl.go.jp/api/iiif/"+pid+"/R0000001/info.json";
            URL url = new URL(strUrl);
            urlConn = (HttpURLConnection) url.openConnection();
            int status = urlConn.getResponseCode();
            if(status==200) {
                return true;
            }
        }catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (urlConn != null) {
                urlConn.disconnect();
            }
        }
        return false;
    }
}
