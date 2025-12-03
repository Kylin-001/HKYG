package com.heikeji.system.handler;

import com.heikeji.common.api.Result;
import com.heikeji.common.api.ResultCode;
import com.heikeji.system.exception.BusinessException;
import com.heikeji.system.utils.LogUtils;
import org.slf4j.Logger;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;

/**
 * 全局异常处理
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LogUtils.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理认证异常
     */
    @ExceptionHandler(AuthenticationException.class)
    public Result handleAuthenticationException(HttpServletRequest request, AuthenticationException e) {
        LogUtils.error(logger, "认证异常: {}", e.getMessage());
        if (e instanceof BadCredentialsException) {
            return Result.failed(ResultCode.USERNAME_PASSWORD_ERROR);
        }
        return Result.failed(ResultCode.UNAUTHORIZED);
    }

    /**
     * 处理授权异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Result handleAccessDeniedException(HttpServletRequest request, AccessDeniedException e) {
        LogUtils.error(logger, "授权异常: {}", e.getMessage());
        return Result.failed(ResultCode.FORBIDDEN);
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result handleMethodArgumentNotValidException(HttpServletRequest request, MethodArgumentNotValidException e) {
        String errorMsg = e.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));
        LogUtils.error(logger, "参数验证异常: {}", errorMsg);
        return Result.parameterFailed(errorMsg);
    }

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result handleBusinessException(HttpServletRequest request, BusinessException e) {
        LogUtils.error(logger, "业务异常: {}", e.getMessage());
        return Result.failed(e.getMessage());
    }

    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result handleException(HttpServletRequest request, Exception e) {
        LogUtils.error(logger, "系统异常: {}", e.getMessage(), e);
        return Result.failed(ResultCode.INTERNAL_SERVER_ERROR);
    }
}
