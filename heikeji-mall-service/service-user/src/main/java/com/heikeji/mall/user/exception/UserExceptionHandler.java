package com.heikeji.mall.user.exception;

import com.heikeji.mall.common.exception.BusinessException;

import com.heikeji.mall.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户模块全局异常处理类
 * 用于处理系统中的各种异常
 *
 * @author heikeji
 * @date 2024-12-19
 */
@RestControllerAdvice
@Slf4j
public class UserExceptionHandler {

    /**
     * 处理自定义业务异常
     *
     * @param e BusinessException
     * @return Result
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Result<?>> handleBusinessException(BusinessException e) {
        log.error("业务异常: {}", e.getMessage(), e);
        Result<?> result = Result.error(e.getCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理验证码异常
     *
     * @param e CaptchaException
     * @return Result
     */
    @ExceptionHandler(CaptchaException.class)
    public ResponseEntity<Result<?>> handleCaptchaException(CaptchaException e) {
        log.error("验证码异常: {}", e.getMessage(), e);
        Result<?> result = Result.error(e.getErrorCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理密码强度异常
     *
     * @param e PasswordStrengthException
     * @return Result
     */
    @ExceptionHandler(PasswordStrengthException.class)
    public ResponseEntity<Result<?>> handlePasswordStrengthException(PasswordStrengthException e) {
        log.error("密码强度异常: {}", e.getMessage(), e);
        Result<?> result = Result.error(e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理用户安全异常
     *
     * @param e UserSecurityException
     * @return Result
     */
    @ExceptionHandler(UserSecurityException.class)
    public ResponseEntity<Result<?>> handleUserSecurityException(UserSecurityException e) {
        log.error("用户安全异常: {}", e.getMessage(), e);
        Result<?> result = Result.error(e.getCode(), e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理参数校验异常
     *
     * @param e MethodArgumentNotValidException
     * @return Result
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        Map<String, String> errors = new HashMap<>();
        
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        
        log.error("参数校验异常: {}", errors, e);
        Result<?> result = Result.error(Result.PARAM_ERROR, "参数校验失败");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理404异常
     *
     * @param e NoHandlerFoundException
     * @return Result
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Result<?>> handleNoHandlerFoundException(NoHandlerFoundException e) {
        log.error("资源不存在: {}", e.getMessage(), e);
        Result<?> result = Result.error(Result.NOT_FOUND, "请求的资源不存在");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }

    /**
     * 处理通用异常
     *
     * @param e Exception
     * @return Result
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<?>> handleException(Exception e) {
        log.error("系统异常: {}", e.getMessage(), e);
        Result<?> result = Result.error(Result.FAIL, "系统内部错误");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
