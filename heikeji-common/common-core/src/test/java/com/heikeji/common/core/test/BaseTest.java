package com.heikeji.common.core.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * 娴嬭瘯鍩虹被锛屾彁渚涢€氱敤鐨勬祴璇曟柟娉曞拰閰嶇疆
 */
@ExtendWith(MockitoExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public abstract class BaseTest {

    @Autowired
    protected MockMvc mockMvc;

    protected ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 娴嬭瘯鍓嶇殑鍑嗗宸ヤ綔
     */
    @BeforeEach
    public void setUp() {
        // 鍙互鍦ㄨ繖閲屾坊鍔犻€氱敤鐨勬祴璇曞墠鍑嗗閫昏緫
    }

    /**
     * 鎵цGET璇锋眰
     * @param url 璇锋眰URL
     * @return ResultActions
     */
    protected ResultActions getRequest(String url) throws Exception {
        return mockMvc.perform(get(url)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * 鎵ц甯﹀弬鏁扮殑GET璇锋眰
     * @param url 璇锋眰URL
     * @param params 璇锋眰鍙傛暟
     * @return ResultActions
     */
    protected ResultActions getRequest(String url, Map<String, String> params) throws Exception {
        StringBuilder urlBuilder = new StringBuilder(url);
        if (params != null && !params.isEmpty()) {
            urlBuilder.append("?");
            params.forEach((key, value) -> {
                urlBuilder.append(key).append("=").append(value).append("&");
            });
            urlBuilder.deleteCharAt(urlBuilder.length() - 1);
        }
        return getRequest(urlBuilder.toString());
    }

    /**
     * 鎵цPOST璇锋眰
     * @param url 璇锋眰URL
     * @param content 璇锋眰浣?     * @return ResultActions
     */
    protected ResultActions postRequest(String url, Object content) throws Exception {
        return mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(content)));
    }

    /**
     * 鎵цPUT璇锋眰
     * @param url 璇锋眰URL
     * @param content 璇锋眰浣?     * @return ResultActions
     */
    protected ResultActions putRequest(String url, Object content) throws Exception {
        return mockMvc.perform(put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(content)));
    }

    /**
     * 鎵цDELETE璇锋眰
     * @param url 璇锋眰URL
     * @return ResultActions
     */
    protected ResultActions deleteRequest(String url) throws Exception {
        return mockMvc.perform(delete(url)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * 鎵ц甯﹁璇佺殑璇锋眰
     * @param url 璇锋眰URL
     * @param token JWT token
     * @return ResultActions
     */
    protected ResultActions getRequestWithAuth(String url, String token) throws Exception {
        return mockMvc.perform(get(url)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token));
    }

    /**
     * 楠岃瘉鍝嶅簲鐘舵€佺爜
     * @param resultActions 鍝嶅簲缁撴灉
     * @param statusCode 鐘舵€佺爜
     * @return ResultActions
     */
    protected ResultActions verifyStatusCode(ResultActions resultActions, int statusCode) throws Exception {
        return resultActions.andExpect(MockMvcResultMatchers.status().is(statusCode));
    }

    /**
     * 楠岃瘉鍝嶅簲鍐呭鍖呭惈鎸囧畾瀛楃涓?     * @param resultActions 鍝嶅簲缁撴灉
     * @param content 瑕侀獙璇佺殑鍐呭
     * @return ResultActions
     */
    protected ResultActions verifyContentContains(ResultActions resultActions, String content) throws Exception {
        return resultActions.andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.containsString(content)));
    }

    /**
     * 妯℃嫙闈欐€佹柟娉?     * @param clazz 鍖呭惈闈欐€佹柟娉曠殑绫?     * @return MockedStatic瀵硅薄
     */
    protected <T> MockedStatic<T> mockStatic(Class<T> clazz) {
        return Mockito.mockStatic(clazz);
    }

    /**
     * 灏嗗璞¤浆鎹负JSON瀛楃涓?     * @param object 瑕佽浆鎹㈢殑瀵硅薄
     * @return JSON瀛楃涓?     */
    protected String toJson(Object object) throws Exception {
        return objectMapper.writeValueAsString(object);
    }
}
