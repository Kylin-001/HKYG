package com.heikeji.common.core.exception;

import com.heikeji.common.core.constant.ErrorCode;
import com.heikeji.common.core.domain.R;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 * 统一处理所有异常，返回标准格式的API响应
 *
 * @author: zky
 * @date: 2024-01-01
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public R<?> handleBusinessException(BusinessException ex) {
        log.warn("业务异常: {}", ex.getMessage());
        return R.error(ex.getCode(), ex.getMessage());
    }

    /**
     * 处理空指针异常
     */
    @ExceptionHandler(NullPointerException.class)
    public R<?> handleNullPointerException(NullPointerException ex, HttpServletRequest request) {
        log.error("空指针异常: {} {}", request.getMethod(), request.getRequestURI(), ex);
        return R.error(ErrorCode.SYSTEM_ERROR);
    }

    /**
     * 处理参数验证异常（@Validated 方法参数验证）
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        String errorMsg = fieldErrors.stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        log.warn("参数验证异常: {}", errorMsg);
        return R.badRequest(errorMsg);
    }

    /**
     * 处理参数绑定异常（表单参数验证）
     */
    @ExceptionHandler(BindException.class)
    public R<?> handleBindException(BindException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        String errorMsg = fieldErrors.stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        log.warn("参数绑定异常: {}", errorMsg);
        return R.badRequest(errorMsg);
    }

    /**
     * 处理请求参数缺失异常
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public R<?> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        String errorMsg = "缺少必需的参数: " + ex.getParameterName() + "(" + ex.getParameterType() + ")";
        log.warn("{}", errorMsg);
        return R.badRequest(errorMsg);
    }

    /**
     * 处理请求体解析异常
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public R<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        log.warn("请求体解析异常: {}", ex.getMessage());
        return R.badRequest("请求数据格式错误，请检查JSON格式是否正确");
    }

    /**
     * 处理请求方法不支持异常
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public R<?> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        log.warn("请求方法不支持: {}", ex.getMessage());
        return R.error(405, "不支持的请求方法: " + ex.getMethod());
    }

    /**
     * 处理404异常
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public R<?> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpServletRequest request) {
        log.warn("请求的资源不存在: {} {}", request.getMethod(), request.getRequestURI());
        return R.notFound("请求的资源不存在: " + request.getRequestURI());
    }

    /**
     * 处理约束违反异常（方法级参数验证）
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public R<?> handleConstraintViolationException(ConstraintViolationException ex) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        String errorMsg = violations.stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        
        log.warn("约束违反异常: {}", errorMsg);
        return R.badRequest(errorMsg);
    }

    /**
     * 处理所有其他未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    public R<?> handleAllExceptions(Exception ex, HttpServletRequest request) {
        log.error("未处理的异常: {} {}", request.getMethod(), request.getRequestURI(), ex);
        return R.error(ErrorCode.SYSTEM_ERROR);
    }

    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public R<?> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        // 区分不同类型的运行时异常
        if (ex instanceof NullPointerException) {
            return handleNullPointerException((NullPointerException) ex, request);
        }
        
        log.error("运行时异常: {} {}", request.getMethod(), request.getRequestURI(), ex);
        // 如果是业务相关的运行时异常，可以返回更具体的错误信息
        return R.error(ErrorCode.SYSTEM_ERROR);
    }
}