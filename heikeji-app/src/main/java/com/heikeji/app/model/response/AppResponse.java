package com.heikeji.app.model.response;

import lombok.Data;

import java.io.Serializable;

/**
 * APP统一响应模型
 * 用于APP端API的统一响应格式
 */
@Data
public class AppResponse<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 状态码
     * 200: 成功
     * 其他: 失败
     */
    private int code;
    
    /**
     * 消息
     */
    private String message;
    
    /**
     * 数据
     */
    private T data;
    
    /**
     * 时间戳
     */
    private long timestamp;
    
    public AppResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    /**
     * 成功响应
     */
    public static <T> AppResponse<T> success(T data) {
        AppResponse<T> response = new AppResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        return response;
    }
    
    /**
     * 成功响应（无数据）
     */
    public static <T> AppResponse<T> success() {
        return success(null);
    }
    
    /**
     * 失败响应
     */
    public static <T> AppResponse<T> error(int code, String message) {
        AppResponse<T> response = new AppResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
    
    /**
     * 失败响应（默认错误码）
     */
    public static <T> AppResponse<T> error(String message) {
        return error(500, message);
    }
}