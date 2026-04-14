package com.heikeji.common.core.domain;

import java.io.Serializable;

/**
 * 通用返回结果封装
 */
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final int SUCCESS = 200;
    public static final int FAIL = 500;
    public static final int UNAUTHORIZED = 401;
    public static final int FORBIDDEN = 403;
    public static final int NOT_FOUND = 404;
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

    public static <T> Result<T> success() {
        return new Result<>(SUCCESS, "操作成功");
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(SUCCESS, "操作成功", data);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(SUCCESS, message, data);
    }

    public static <T> Result<T> error() {
        return new Result<>(FAIL, "操作失败");
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(FAIL, message);
    }

    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message);
    }

    public static <T> Result<T> error(int code, String message, T data) {
        return new Result<>(code, message, data);
    }

    public static <T> Result<T> unauthorized() {
        return new Result<>(UNAUTHORIZED, "未授权");
    }

    public static <T> Result<T> forbidden() {
        return new Result<>(FORBIDDEN, "禁止访问");
    }

    public static <T> Result<T> notFound() {
        return new Result<>(NOT_FOUND, "资源不存在");
    }

    public static <T> Result<T> paramError() {
        return new Result<>(PARAM_ERROR, "请求参数错误");
    }

    public static <T> Result<T> paramError(String message) {
        return new Result<>(PARAM_ERROR, message);
    }

    public boolean isSuccess() {
        return this.code == SUCCESS;
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
