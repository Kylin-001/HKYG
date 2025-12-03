package com.heikeji.mall.takeout.utils;

import com.heikeji.common.core.domain.R;

/**
 * 结果工具类
 */
public class ResultUtil {
    /**
     * 成功响应
     */
    public static <T> R<T> ok(T data) {
        return R.success(data);
    }

    /**
     * 成功响应
     */
    public static R ok() {
        return R.success();
    }
    
    /**
     * 成功响应 - 布尔值
     */
    public static R<Boolean> success(boolean data) {
        return R.success(data);
    }
    
    /**
     * 成功响应 - 通用类型
     */
    public static <T> R<T> success(T data) {
        return R.success(data);
    }

    /**
     * 失败响应
     */
    public static R<?> error(Integer code, String message) {
        return R.error(code, message);
    }

    /**
     * 失败响应（默认错误码）
     */
    public static R<?> error(String message) {
        return R.error(message);
    }
}