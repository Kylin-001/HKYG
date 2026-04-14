package com.heikeji.mall.common.exception;

import com.heikeji.mall.common.response.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 *
 * 统一处理数据插入过程中可能出现的各类异常：
 * 1. 参数验证异常 (@Valid失败)
 * 2. 数据重复异常 (唯一约束冲突)
 * 3. 外键约束异常
 * 4. 数据类型转换异常
 * 5. 其他运行时异常
 *
 * 所有异常都会返回标准化的错误响应格式
 */
@Slf4j
@RestControllerAdvice
public class DataInsertGlobalExceptionHandler {

    /**
     * 处理参数验证异常
     * 当@Validated或@Valid校验失败时触发
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<Map<String, String>> handleValidationException(MethodArgumentNotValidException e) {
        log.warn("参数验证失败: {}", e.getMessage());

        Map<String, String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() != null ?
                                fieldError.getDefaultMessage() : "参数无效",
                        (existing, replacement) -> existing + "; " + replacement
                ));

        return R.error(400, "参数验证失败", errors);
    }

    /**
     * 处理数据重复异常
     * 当插入的数据违反UNIQUE约束时触发
     */
    @ExceptionHandler(DuplicateKeyException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public R<String> handleDuplicateKeyException(DuplicateKeyException e) {
        log.error("数据重复冲突: {}", e.getMessage());

        String message = extractDuplicateKeyMessage(e.getMessage());
        return R.error(409, message);
    }

    /**
     * 处理非法参数异常
     * 如外键不存在、数值超出范围等
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public R<String> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("非法参数: {}", e.getMessage());
        return R.error(400, e.getMessage() != null ? e.getMessage() : "参数不合法");
    }

    /**
     * 处理通用运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public R<String> handleRuntimeException(RuntimeException e) {
        log.error("运行时异常: {}", e.getMessage(), e);

        String userMessage = e.getMessage();
        if (userMessage == null || userMessage.contains("exception")) {
            userMessage = "服务器内部错误，请稍后重试";
        }

        return R.error(500, userMessage);
    }

    /**
     * 处理其他未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public R<String> handleGeneralException(Exception e) {
        log.error("未处理的异常: {}", e.getMessage(), e);
        return R.error(500, "系统繁忙，请稍后重试");
    }

    /**
     * 从异常信息中提取用户友好的重复键提示
     */
    private String extractDuplicateKeyMessage(String errorMessage) {
        if (errorMessage == null) {
            return "数据已存在";
        }

        errorMessage = errorMessage.toLowerCase();

        if (errorMessage.contains("username") || errorMessage.contains("用户名")) {
            return "用户名已存在，请使用其他用户名";
        }
        if (errorMessage.contains("student_no") || errorMessage.contains("学号")) {
            return "学号已被注册";
        }
        if (errorMessage.contains("phone") || errorMessage.contains("手机号")) {
            return "手机号已被注册";
        }
        if (errorMessage.contains("email") || errorMessage.contains("邮箱")) {
            return "邮箱已被注册";
        }
        if (errorMessage.contains("uk_") || errorMessage.contains("unique")) {
            return "数据已存在，违反唯一性约束";
        }

        return "数据冲突：" + errorMessage;
    }
}
