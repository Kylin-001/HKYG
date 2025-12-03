package com.heikeji.common.core.util;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

/**
 * 通用响应工具类
 * 提供统一的API响应格式，特别是在熔断降级场景下
 */
public class ResponseUtil {

    /**
     * 成功状态码
     */
    public static final int SUCCESS_CODE = 200;
    
    /**
     * 熔断降级状态码
     */
    public static final int FALLBACK_CODE = 503;
    
    /**
     * 限流状态码
     */
    public static final int RATE_LIMIT_CODE = 429;
    
    /**
     * 错误状态码
     */
    public static final int ERROR_CODE = 500;

    /**
     * 成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(SUCCESS_CODE, "success", data);
    }
    
    /**
     * 成功响应，带自定义消息
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(SUCCESS_CODE, message, data);
    }
    
    /**
     * 错误响应
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(ERROR_CODE, message, null);
    }
    
    /**
     * 错误响应，带自定义状态码
     */
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
    
    /**
     * 熔断降级响应
     */
    public static ApiResponse<Map<String, Object>> fallback(String message) {
        Map<String, Object> fallbackData = new HashMap<>();
        fallbackData.put("fallback_reason", message);
        fallbackData.put("timestamp", System.currentTimeMillis());
        fallbackData.put("service", "heikeji-mall");
        return new ApiResponse<>(FALLBACK_CODE, "服务暂时不可用，已触发熔断降级", fallbackData);
    }
    
    /**
     * 熔断降级响应，带自定义数据
     */
    public static <T> ApiResponse<T> fallback(String message, T fallbackData) {
        return new ApiResponse<>(FALLBACK_CODE, message, fallbackData);
    }
    
    /**
     * 限流响应
     */
    public static ApiResponse<Map<String, Object>> rateLimit(String message) {
        Map<String, Object> rateLimitData = new HashMap<>();
        rateLimitData.put("reason", message);
        rateLimitData.put("timestamp", System.currentTimeMillis());
        return new ApiResponse<>(RATE_LIMIT_CODE, "请求过于频繁，请稍后再试", rateLimitData);
    }
    
    /**
     * 通用API响应对象
     */
    @Data
    public static class ApiResponse<T> {
        private int code;
        private String message;
        private T data;
        private long timestamp;
        
        public ApiResponse(int code, String message, T data) {
            this.code = code;
            this.message = message;
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
        
        public boolean isSuccess() {
            return code == SUCCESS_CODE;
        }
        
        public boolean isFallback() {
            return code == FALLBACK_CODE;
        }
        
        public boolean isRateLimit() {
            return code == RATE_LIMIT_CODE;
        }
    }
}