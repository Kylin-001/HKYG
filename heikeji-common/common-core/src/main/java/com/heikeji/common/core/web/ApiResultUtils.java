package com.heikeji.common.core.web;

/**
 * API结果工具类
 * 提供常用的API返回结果生成方法
 * 
 * @author Administrator
 */
public class ApiResultUtils {
    
    /**
     * 创建成功结果
     */
    public static <T> ApiResult<T> success() {
        return ApiResult.success();
    }
    
    /**
     * 创建成功结果（带数据）
     */
    public static <T> ApiResult<T> success(T data) {
        return ApiResult.success(data);
    }
    
    /**
     * 创建成功结果（带消息）
     */
    public static <T> ApiResult<T> success(String message, T data) {
        return ApiResult.success(message, data);
    }
    
    /**
     * 创建错误结果
     */
    public static <T> ApiResult<T> error() {
        return ApiResult.error();
    }
    
    /**
     * 创建错误结果（带消息）
     */
    public static <T> ApiResult<T> error(String message) {
        return ApiResult.error(message);
    }
    
    /**
     * 创建错误结果（带状态码）
     */
    public static <T> ApiResult<T> error(Integer code, String message) {
        return ApiResult.error(code, message);
    }
    
    /**
     * 创建错误结果（带状态码和消息）
     */
    public static <T> ApiResult<T> error(Integer code, String message, T data) {
        return ApiResult.error(code, message, data);
    }
}