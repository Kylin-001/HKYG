package com.heikeji.mall.common;

import java.io.Serializable;

/**
 * 通用返回结果封装
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 成功状态码
     */
    public static final int SUCCESS = 200;

    /**
     * 失败状态码
     */
    public static final int FAIL = 500;

    /**
     * 未授权状态码
     */
    public static final int UNAUTHORIZED = 401;

    /**
     * 禁止访问状态码
     */
    public static final int FORBIDDEN = 403;

    /**
     * 资源不存在状态码
     */
    public static final int NOT_FOUND = 404;

    /**
     * 请求参数错误状态码
     */
    public static final int PARAM_ERROR = 400;

    private int code;
    private String message;
    private T data;
    private long timestamp;

    public Result() {
        this.timestamp = System.currentTimeMillis();
    }

    public Result(int code, String message) {
        this();
        this.code = code;
        this.message = message;
    }

    public Result(int code, String message, T data) {
        this();
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功返回
     */
    public static <T> Result<T> success() {
        return new Result<>(SUCCESS, "操作成功");
    }

    /**
     * 成功返回带数据
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(SUCCESS, "操作成功", data);
    }

    /**
     * 成功返回自定义消息和数据
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(SUCCESS, message, data);
    }

    /**
     * 失败返回
     */
    public static <T> Result<T> error() {
        return new Result<>(FAIL, "操作失败");
    }

    /**
     * 失败返回自定义消息
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(FAIL, message);
    }

    /**
     * 失败返回自定义状态码和消息
     */
    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message);
    }

    /**
     * 失败返回自定义状态码、消息和数据
     */
    public static <T> Result<T> error(int code, String message, T data) {
        return new Result<>(code, message, data);
    }

    /**
     * 未授权返回
     */
    public static <T> Result<T> unauthorized() {
        return new Result<>(UNAUTHORIZED, "未授权");
    }

    /**
     * 禁止访问返回
     */
    public static <T> Result<T> forbidden() {
        return new Result<>(FORBIDDEN, "禁止访问");
    }

    /**
     * 资源不存在返回
     */
    public static <T> Result<T> notFound() {
        return new Result<>(NOT_FOUND, "资源不存在");
    }

    /**
     * 请求参数错误返回
     */
    public static <T> Result<T> paramError() {
        return new Result<>(PARAM_ERROR, "请求参数错误");
    }

    /**
     * 请求参数错误返回自定义消息
     */
    public static <T> Result<T> paramError(String message) {
        return new Result<>(PARAM_ERROR, message);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Result{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", timestamp=" + timestamp +
                '}';
    }
}
