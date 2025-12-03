package com.heikeji.mall.takeout.exception;

/**
 * 外卖服务自定义异常类
 */
public class TakeoutException extends RuntimeException {
    private Integer code;

    public TakeoutException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public TakeoutException(String message) {
        super(message);
        this.code = 500;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}