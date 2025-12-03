package com.heikeji.common.api;

import lombok.Data;

import java.io.Serializable;

/**
 * 通用响应结果
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码
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
     * 成功标志
     */
    private boolean success;

    /**
     * 时间戳
     */
    private long timestamp;

    public Result() {
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * 成功
     */
    public static <T> Result<T> ok() {
        return ok(null);
    }

    /**
     * 成功
     */
    public static <T> Result<T> ok(T data) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        result.setData(data);
        result.setSuccess(true);
        return result;
    }

    /**
     * 成功
     */
    public static <T> Result<T> ok(String message) {
        return ok(null, message);
    }

    /**
     * 成功
     */
    public static <T> Result<T> ok(T data, String message) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(message);
        result.setData(data);
        result.setSuccess(true);
        return result;
    }

    /**
     * 失败
     */
    public static <T> Result<T> failed() {
        return failed(ResultCode.FAILED);
    }

    /**
     * 失败
     */
    public static <T> Result<T> failed(String message) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.FAILED.getCode());
        result.setMessage(message);
        result.setData(null);
        result.setSuccess(false);
        return result;
    }

    /**
     * 失败
     */
    public static <T> Result<T> failed(ResultCode resultCode) {
        Result<T> result = new Result<>();
        result.setCode(resultCode.getCode());
        result.setMessage(resultCode.getMessage());
        result.setData(null);
        result.setSuccess(false);
        return result;
    }

    /**
     * 失败
     */
    public static <T> Result<T> failed(ResultCode resultCode, String message) {
        Result<T> result = new Result<>();
        result.setCode(resultCode.getCode());
        result.setMessage(message);
        result.setData(null);
        result.setSuccess(false);
        return result;
    }

    /**
     * 参数错误
     */
    public static <T> Result<T> parameterFailed() {
        return failed(ResultCode.PARAM_ERROR);
    }

    /**
     * 参数错误
     */
    public static <T> Result<T> parameterFailed(String message) {
        return failed(ResultCode.PARAM_ERROR, message);
    }

    /**
     * 未授权
     */
    public static <T> Result<T> unauthorized() {
        return failed(ResultCode.UNAUTHORIZED);
    }

    /**
     * 禁止访问
     */
    public static <T> Result<T> forbidden() {
        return failed(ResultCode.FORBIDDEN);
    }

    /**
     * 接口不存在
     */
    public static <T> Result<T> notFound() {
        return failed(ResultCode.NOT_FOUND);
    }
}
