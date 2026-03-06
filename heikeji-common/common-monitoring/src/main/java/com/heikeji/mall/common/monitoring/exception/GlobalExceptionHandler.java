package com.heikeji.mall.common.monitoring.exception;

import com.heikeji.mall.common.monitoring.service.SentryErrorTrackingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private SentryErrorTrackingService sentryErrorTrackingService;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(
            Exception ex, 
            WebRequest request) {
        
        log.error("全局异常捕获: {}", ex.getMessage(), ex);
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", System.currentTimeMillis());
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("type", ex.getClass().getSimpleName());
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));
        
        sentryErrorTrackingService.captureException(ex, errorDetails);
        
        sentryErrorTrackingService.addBreadcrumb("error", "Global exception caught", 
            Map.of("type", ex.getClass().getSimpleName(), "path", errorDetails.get("path").toString()));
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(createErrorResponse("服务器内部错误", errorDetails));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex, 
            WebRequest request) {
        
        log.error("运行时异常: {}", ex.getMessage(), ex);
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", System.currentTimeMillis());
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("type", ex.getClass().getSimpleName());
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));
        
        sentryErrorTrackingService.captureException(ex, errorDetails);
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(createErrorResponse("运行时错误", errorDetails));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex, 
            WebRequest request) {
        
        log.warn("参数异常: {}", ex.getMessage());
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", System.currentTimeMillis());
        errorDetails.put("message", ex.getMessage());
        errorDetails.put("type", ex.getClass().getSimpleName());
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));
        
        sentryErrorTrackingService.captureException(ex, errorDetails);
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(createErrorResponse("参数错误", errorDetails));
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(
            NullPointerException ex, 
            WebRequest request) {
        
        log.error("空指针异常: {}", ex.getMessage(), ex);
        
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", System.currentTimeMillis());
        errorDetails.put("message", "空指针异常");
        errorDetails.put("type", ex.getClass().getSimpleName());
        errorDetails.put("path", request.getDescription(false).replace("uri=", ""));
        
        sentryErrorTrackingService.captureException(ex, errorDetails);
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(createErrorResponse("服务器内部错误", errorDetails));
    }

    private Map<String, Object> createErrorResponse(String message, Map<String, Object> details) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 500);
        response.put("message", message);
        response.put("data", details);
        return response;
    }
}
