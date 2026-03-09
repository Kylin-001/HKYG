import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class test_courier_api {
    public static void main(String[] args) {
        System.out.println("=== Testing Courier API ===");
        
        // Test if server is responding
        testHealthEndpoint();
        
        // Test courier API
        testCourierAPI();
    }
    
    private static void testHealthEndpoint() {
        try {
            System.out.println("\n--- Testing Health Endpoint ---");
            String url = "http://localhost:8082/api/health";
            URL obj = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "TestClient/1.0");
            
            int responseCode = conn.getResponseCode();
            System.out.println("Health Check - Response Code: " + responseCode);
            
            if (responseCode == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                System.out.println("Health Check Response: " + response.toString());
            } else {
                System.out.println("Health Check Failed");
            }
        } catch (Exception e) {
            System.out.println("Health Check Error: " + e.getMessage());
        }
    }
    
    private static void testCourierAPI() {
        try {
            System.out.println("\n--- Testing Courier API Endpoints ---");
            
            // Test 1: Basic API call (without X-Courier-Id)
            testApiCall("http://localhost:8082/api/courier/dashboard", null, "Basic API Call");
            
            // Test 2: API call with X-Courier-Id
            testApiCall("http://localhost:8082/api/courier/dashboard", "1001", "API Call with X-Courier-Id");
            
            // Test 3: Test other endpoint
            testApiCall("http://localhost:8082/api/courier/profile", "1001", "Profile Endpoint");
            
        } catch (Exception e) {
            System.out.println("Courier API Test Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void testApiCall(String urlString, String courierId, String testName) {
        try {
            System.out.println("\nTest: " + testName);
            System.out.println("URL: " + urlString);
            
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("User-Agent", "CourierApp/1.0");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            
            if (courierId != null) {
                conn.setRequestProperty("X-Courier-Id", courierId);
                System.out.println("X-Courier-Id: " + courierId);
            }
            
            int responseCode = conn.getResponseCode();
            System.out.println("Response Code: " + responseCode);
            System.out.println("Response Message: " + conn.getResponseMessage());
            
            // Show response headers
            System.out.println("Response Headers:");
            for (int i = 1; i <= 20; i++) {
                String headerKey = conn.getHeaderFieldKey(i);
                String headerValue = conn.getHeaderField(i);
                if (headerKey == null || headerValue == null) break;
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
                System.out.println("Response Content: " + content);
            } else {
                System.out.println("Request failed, trying to read error response...");
                try {
                    BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "UTF-8"));
                    String inputLine;
                    StringBuffer errorResponse = new StringBuffer();
                    while ((inputLine = errorReader.readLine()) != null) {
                        errorResponse.append(inputLine);
                    }
                    errorReader.close();
                    content = errorResponse.toString();
                    if (content.isEmpty()) {
                        content = "No error content";
                    }
                    System.out.println("Error Content: " + content);
                } catch (Exception e) {
                    System.out.println("Cannot read error response: " + e.getMessage());
                }
            }
            
        } catch (Exception e) {
            System.out.println("API Call Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
