package com.heikeji.common.core.domain;

import com.heikeji.common.core.constant.Constants;
import com.heikeji.common.core.constant.ErrorCode;
import java.io.Serializable;

/**
 * 统一响应结果
 */
public class R<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private String msg;
    private T data;
    private Long timestamp;
    
    // 手动添加getter和setter方法
    public Integer getCode() {
        return code;
    }
    
    public void setCode(Integer code) {
        this.code = code;
    }
    
    public String getMsg() {
        return msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public Long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public R() {
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * 判断响应是否成功
     */
    public boolean isSuccess() {
        return Constants.SUCCESS.equals(code);
    }

    /**
     * 成功返回结果
     */
    public static <T> R<T> success() {
        R<T> r = new R<>();
        r.setCode(200);
        r.setMsg("操作成功");
        r.setData(null);
        return r;
    }

    /**
     * 成功返回结果
     *
     * @param data 数据
     */
    public static <T> R<T> success(T data) {
        R<T> r = new R<>();
        r.setCode(200);
        r.setMsg("操作成功");
        r.setData(data);
        return r;
    }
    
    /**
     * 成功返回结果（别名方法）
     */
    public static <T> R<T> ok(T data) {
        return success(data);
    }
    
    /**
     * 成功返回结果（别名方法）
     */
    public static <T> R<T> ok() {
        return success();
    }

    /**
     * 成功返回结果
     */
    public static <T> R<T> success(String msg, T data) {
        R<T> r = new R<>();
        r.setCode(200); // SUCCESS的code值
        r.setMsg(msg);
        r.setData(data);
        return r;
    }

    /**
     * 错误返回结果
     */
    public static <T> R<T> error() {
        return error(ErrorCode.FAIL);
    }

    /**
     * 错误返回结果
     */
    public static <T> R<T> error(String msg) {
        R<T> r = new R<>();
        r.setCode(500); // FAIL的code值
        r.setMsg(msg);
        return r;
    }

    /**
     * 错误返回结果
     */
    public static <T> R<T> error(Integer code, String msg) {
        R<T> r = new R<>();
        r.code = code;
        r.msg = msg;
        return r;
    }
    
    /**
     * 根据错误码枚举返回错误结果
     */
    public static <T> R<T> error(ErrorCode errorCode) {
        R<T> r = new R<>();
        // 直接使用硬编码值
        int code = 500; // 默认值
        String message = "操作失败"; // 默认值
        
        // 根据枚举名称设置对应的值
        if (errorCode.name().equals("SUCCESS")) {
            code = 200;
            message = "操作成功";
        } else if (errorCode.name().equals("FAIL")) {
            code = 500;
            message = "操作失败";
        } else if (errorCode.name().equals("PARAM_ERROR")) {
            code = 10001;
            message = "参数错误";
        } else if (errorCode.name().equals("UNAUTHORIZED")) {
            code = 20001;
            message = "未授权，请先登录";
        } else if (errorCode.name().equals("PERMISSION_DENIED")) {
            code = 20004;
            message = "无权限访问此资源";
        } else if (errorCode.name().equals("RESOURCE_NOT_FOUND")) {
            code = 40001;
            message = "请求的资源不存在";
        }
        
        r.setCode(code);
        r.setMsg(message);
        return r;
    }
    
    /**
     * 根据错误码枚举返回错误结果（可自定义消息）
     */
    public static <T> R<T> error(ErrorCode errorCode, String customMessage) {
        R<T> r = new R<>();
        // 直接使用硬编码值
        int code = 500; // 默认值
        
        // 根据枚举名称设置对应的值
        if (errorCode.name().equals("SUCCESS")) {
            code = 200;
        } else if (errorCode.name().equals("FAIL")) {
            code = 500;
        } else if (errorCode.name().equals("PARAM_ERROR")) {
            code = 10001;
        } else if (errorCode.name().equals("UNAUTHORIZED")) {
            code = 20001;
        } else if (errorCode.name().equals("PERMISSION_DENIED")) {
            code = 20004;
        } else if (errorCode.name().equals("RESOURCE_NOT_FOUND")) {
            code = 40001;
        }
        
        r.setCode(code);
        r.setMsg(customMessage);
        return r;
    }
    
    /**
     * 参数错误
     */
    public static <T> R<T> badRequest(String message) {
        return error(10001, message); // PARAM_ERROR的code值
    }
    
    /**
     * 未授权错误
     */
    public static <T> R<T> unauthorized(String message) {
        return error(20001, message); // UNAUTHORIZED的code值
    }
    
    /**
     * 无权限错误
     */
    public static <T> R<T> forbidden(String message) {
        return error(20004, message); // PERMISSION_DENIED的code值
    }
    
    /**
     * 资源不存在错误
     */
    public static <T> R<T> notFound(String message) {
        return error(40001, message); // RESOURCE_NOT_FOUND的code值
    }

    /**
     * 链式调用设置数据
     */
    public R<T> setDataAndReturn(T data) {
        this.data = data;
        return this;
    }

    /**
     * 链式调用设置消息
     */
    public R<T> setMsgAndReturn(String msg) {
        this.msg = msg;
        return this;
    }

    /**
     * 链式调用设置状态码
     */
    public R<T> setCodeAndReturn(Integer code) {
        this.code = code;
        return this;
    }
}



