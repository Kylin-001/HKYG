package com.heikeji.admin.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理类
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseBody
    public R handleBusinessException(BusinessException ex) {
        return R.error(ex.getCode(), ex.getMessage());
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public R handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return R.error(400, "参数验证失败").put("errors", errors);
    }

    /**
     * 处理认证异常
     */
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseBody
    public R handleBadCredentialsException(BadCredentialsException ex) {
        return R.error(401, "用户名或密码错误");
    }

    /**
     * 处理用户禁用异常
     */
    @ExceptionHandler(DisabledException.class)
    @ResponseBody
    public R handleDisabledException(DisabledException ex) {
        return R.error(403, "用户已被禁用");
    }

    /**
     * 处理用户锁定异常
     */
    @ExceptionHandler(LockedException.class)
    @ResponseBody
    public R handleLockedException(LockedException ex) {
        return R.error(403, "用户已被锁定");
    }

    /**
     * 处理访问拒绝异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    public R handleAccessDeniedException(AccessDeniedException ex) {
        return R.error(403, "权限不足，拒绝访问");
    }

    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseBody
    public R handleRuntimeException(RuntimeException ex) {
        // 记录异常日志
        ex.printStackTrace();
        return R.error(500, ex.getMessage() != null ? ex.getMessage() : "系统内部错误");
    }

    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public R handleAllExceptions(Exception ex) {
        // 记录异常日志
        ex.printStackTrace();
        return R.error(500, "系统内部错误");
    }

    /**
     * 处理HTTP 404异常
     */
    @ExceptionHandler(org.springframework.web.servlet.NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public R handleNotFoundError(HttpServletRequest request, Exception ex) {
        return R.error(404, "请求的资源不存在: " + request.getRequestURI());
    }

    /**
     * 处理HTTP 405异常
     */
    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ResponseBody
    public R handleMethodNotAllowedError(HttpServletRequest request, Exception ex) {
        return R.error(405, "不支持的请求方法: " + request.getMethod());
    }

    /**
     * 获取客户端IP地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理时，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
