import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class test_api_detailed {
    public static void main(String[] args) {
        try {
            String url = "http://localhost:8082/api/courier/dashboard";
            URL obj = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
            
            // Simulate real browser request
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            conn.setRequestProperty("Accept", "application/json, text/plain, */*");
            conn.setRequestProperty("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8");
            conn.setRequestProperty("X-Courier-Id", "1001");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Origin", "http://localhost:8080");
            conn.setRequestProperty("Referer", "http://localhost:8080/");
            
            // Set connection timeout
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            
            System.out.println("Request URL: " + url);
            System.out.println("Request Method: GET");
            System.out.println("Request Headers:");
            System.out.println("  X-Courier-Id: 1001");
            System.out.println("  Content-Type: application/json");
            
            int responseCode = conn.getResponseCode();
            System.out.println("Response Code: " + responseCode);
            System.out.println("Response Message: " + conn.getResponseMessage());
            
            // Get response headers
            System.out.println("Response Headers:");
            for (int i = 1; i <= 20; i++) {
                String headerKey = conn.getHeaderFieldKey(i);
                String headerValue = conn.getHeaderField(i);
                if (headerKey == null || headerValue == null) {
                    break;
                }
                System.out.println("  " + headerKey + ": " + headerValue);
            }
            
            // Read response content
            String content;
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                String inputLine;
                StringBuffer response = new StringBuffer();
                
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                content = response.toString();
            } else {
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
                String inputLine;
                StringBuffer errorResponse = new StringBuffer();
                
                while ((inputLine = errorReader.readLine()) != null) {
                    errorResponse.append(inputLine);
                }
                errorReader.close();
                content = errorResponse.toString();
            }
            
            System.out.println("Response Content: " + content);
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
