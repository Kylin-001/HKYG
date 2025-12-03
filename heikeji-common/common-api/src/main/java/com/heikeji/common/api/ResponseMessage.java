package com.heikeji.common.api;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一响应消息体
 * 用于API接口返回标准格式的数据
 */
@Data
public class ResponseMessage<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    private Integer code;

    /**
     * 消息内容
     */
    private String message;

    /**
     * 数据对象
     */
    private T data;

    /**
     * 时间戳
     */
    private long timestamp;

    public ResponseMessage() {
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * 成功响应
     */
    public static <T> ResponseMessage<T> success(T data) {
        ResponseMessage<T> response = new ResponseMessage<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        return response;
    }

    /**
     * 成功响应（无数据）
     */
    public static <T> ResponseMessage<T> success() {
        return success(null);
    }

    /**
     * 错误响应
     */
    public static <T> ResponseMessage<T> error(Integer code, String message) {
        ResponseMessage<T> response = new ResponseMessage<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    /**
     * 错误响应（默认错误码）
     */
    public static <T> ResponseMessage<T> error(String message) {
        return error(500, message);
    }
}
