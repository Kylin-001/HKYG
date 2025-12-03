package com.heikeji.mall.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;
import com.heikeji.mall.common.exception.AuthenticationException;
import com.heikeji.mall.user.exception.PasswordStrengthException;

/**
 * 全局异常处理器
 * 用于统一处理应用程序中的异常
 */
@ControllerAdvice
public class UserGlobalExceptionHandler {

    /**
     * 处理业务异常
     *
     * @param ex 业务异常
     * @return 响应实体
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", ex.getCode());
        response.put("message", ex.getMessage());
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 处理认证异常
     *
     * @param ex 认证异常
     * @return 响应实体
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleAuthException(AuthenticationException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", ex.getErrorCode() != null ? ex.getErrorCode() : "401");
        response.put("message", ex.getMessage());
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /**
     * 处理锁定异常
     *
     * @param ex 锁定异常
     * @return 响应实体
     */
    @ExceptionHandler(LockException.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleLockException(LockException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", ex.getCode());
        response.put("message", ex.getMessage());
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.LOCKED).body(response);
    }

    /**
     * 处理外部服务异常
     *
     * @param ex 外部服务异常
     * @return 响应实体
     */
    @ExceptionHandler(ExternalServiceException.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleExternalServiceException(ExternalServiceException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", ex.getCode());
        response.put("message", ex.getMessage());
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    /**
     * 处理密码强度异常
     *
     * @param ex 密码强度异常
     * @return 响应实体
     */
    @ExceptionHandler(PasswordStrengthException.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handlePasswordStrengthException(PasswordStrengthException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", "400");
        response.put("message", ex.getMessage());
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * 处理所有其他异常
     *
     * @param ex 异常
     * @return 响应实体
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", "500");
        response.put("message", "系统内部错误：" + ex.getMessage());
        response.put("data", null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}