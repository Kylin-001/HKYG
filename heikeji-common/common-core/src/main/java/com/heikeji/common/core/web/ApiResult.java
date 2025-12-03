package com.heikeji.common.core.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

/**
 * API统一返回结果
 * 
 * @param <T> 数据类型
 * @author Administrator
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResult<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 成功状态码
     */
    public static final Integer SUCCESS_CODE = 200;
    
    /**
     * 失败状态码
     */
    public static final Integer ERROR_CODE = 500;
    
    /**
     * 状态码
     */
    private Integer code;
    
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
    private Long timestamp;
    
    /**
     * 构造函数
     */
    public ApiResult(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }
    
    /**
     * 创建成功结果
     */
    public static <T> ApiResult<T> success() {
        return new ApiResult<>(SUCCESS_CODE, "操作成功", null);
    }
    
    /**
     * 创建成功结果（带数据）
     */
    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>(SUCCESS_CODE, "操作成功", data);
    }
    
    /**
     * 创建成功结果（带消息）
     */
    public static <T> ApiResult<T> success(String message, T data) {
        return new ApiResult<>(SUCCESS_CODE, message, data);
    }
    
    /**
     * 创建错误结果
     */
    public static <T> ApiResult<T> error() {
        return new ApiResult<>(ERROR_CODE, "操作失败", null);
    }
    
    /**
     * 创建错误结果（带消息）
     */
    public static <T> ApiResult<T> error(String message) {
        return new ApiResult<>(ERROR_CODE, message, null);
    }
    
    /**
     * 创建错误结果（带状态码）
     */
    public static <T> ApiResult<T> error(Integer code, String message) {
        return new ApiResult<>(code, message, null);
    }
    
    /**
     * 创建错误结果（带状态码和消息）
     */
    public static <T> ApiResult<T> error(Integer code, String message, T data) {
        return new ApiResult<>(code, message, data);
    }
    
    /**
     * 判断是否成功
     */
    public boolean isSuccess() {
        return SUCCESS_CODE.equals(this.code);
    }
    
    /**
     * 判断是否失败
     */
    public boolean isError() {
        return !isSuccess();
    }
}