package com.heikeji.common.core.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.domain.R;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * API响应工具类，提供统一的API响应格式处理
 */
public class ApiResultUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 成功响应
     * @param data 响应数据
     * @return R 对象
     */
    public static <T> R<T> success(T data) {
        return R.ok(data);
    }

    /**
     * 成功响应，无数据
     * @return R 对象
     */
    public static <T> R<T> success() {
        return R.ok();
    }

    /**
     * 错误响应
     * @param code 错误代码
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> error(int code, String message) {
        return R.error(code, message);
    }

    /**
     * 错误响应，使用默认错误码
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> error(String message) {
        return R.error(message);
    }

    /**
     * 响应400错误
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> badRequest(String message) {
        return R.error(400, message);
    }

    /**
     * 响应401错误
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> unauthorized(String message) {
        return R.error(401, message);
    }

    /**
     * 响应403错误
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> forbidden(String message) {
        return R.error(403, message);
    }

    /**
     * 响应404错误
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> notFound(String message) {
        return R.error(404, message);
    }

    /**
     * 响应500错误
     * @param message 错误消息
     * @return R 对象
     */
    public static <T> R<T> serverError(String message) {
        return R.error(500, message);
    }

    /**
     * 将对象转换为ResponseEntity
     * @param r R对象
     * @return ResponseEntity对象
     */
    public static <T> ResponseEntity<R<T>> toResponseEntity(R<T> r) {
        HttpStatus status = r.getCode() == 200 ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;
        if (r.getCode() >= 400 && r.getCode() < 500) {
            try {
                status = HttpStatus.valueOf(r.getCode());
            } catch (IllegalArgumentException e) {
                status = HttpStatus.BAD_REQUEST;
            }
        }
        return new ResponseEntity<>(r, status);
    }

    /**
     * 直接输出JSON响应到HttpServletResponse
     * @param response HttpServletResponse
     * @param data 响应数据
     */
    public static void writeJson(HttpServletResponse response, Object data) {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter writer = response.getWriter()) {
            writer.write(objectMapper.writeValueAsString(data));
            writer.flush();
        } catch (IOException e) {
            throw new RuntimeException("输出JSON响应失败", e);
        }
    }

    /**
     * 直接输出错误JSON响应
     * @param response HttpServletResponse
     * @param code 错误代码
     * @param message 错误消息
     */
    public static void writeErrorJson(HttpServletResponse response, int code, String message) {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(code);
        writeJson(response, error(code, message));
    }
}
