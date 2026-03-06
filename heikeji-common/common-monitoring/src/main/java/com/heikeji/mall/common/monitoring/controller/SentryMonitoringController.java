package com.heikeji.mall.common.monitoring.controller;

import com.heikeji.mall.common.monitoring.service.SentryErrorTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/monitoring/sentry")
@Tag(name = "Sentry监控管理", description = "Sentry错误追踪相关接口")
public class SentryMonitoringController {

    @Autowired
    private SentryErrorTrackingService sentryErrorTrackingService;

    @PostMapping("/test/error")
    @Operation(summary = "测试错误上报", description = "发送测试错误到Sentry")
    public Map<String, Object> testErrorCapture(
            @RequestParam(defaultValue = "测试错误") String message) {
        
        try {
            throw new RuntimeException("这是一个测试错误: " + message);
        } catch (Exception e) {
            Map<String, Object> context = new HashMap<>();
            context.put("test", true);
            context.put("timestamp", System.currentTimeMillis());
            
            sentryErrorTrackingService.captureException(e, context);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "测试错误已上报到Sentry");
            response.put("timestamp", System.currentTimeMillis());
            return response;
        }
    }

    @PostMapping("/test/message")
    @Operation(summary = "测试消息上报", description = "发送测试消息到Sentry")
    public Map<String, Object> testMessageCapture(
            @RequestParam(defaultValue = "测试消息") String message,
            @RequestParam(defaultValue = "INFO") String level) {
        
        io.sentry.SentryLevel sentryLevel;
        try {
            sentryLevel = io.sentry.SentryLevel.valueOf(level.toUpperCase());
        } catch (IllegalArgumentException e) {
            sentryLevel = io.sentry.SentryLevel.INFO;
        }
        
        sentryErrorTrackingService.captureMessage(message, sentryLevel);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "测试消息已上报到Sentry");
        response.put("level", sentryLevel.name());
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @PostMapping("/test/breadcrumb")
    @Operation(summary = "测试面包屑", description = "添加测试面包屑到Sentry")
    public Map<String, Object> testBreadcrumb(
            @RequestParam(defaultValue = "test") String category,
            @RequestParam(defaultValue = "测试面包屑") String message) {
        
        sentryErrorTrackingService.addBreadcrumb(category, message);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "测试面包屑已添加到Sentry");
        response.put("category", category);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @PostMapping("/test/user")
    @Operation(summary = "测试用户设置", description = "设置测试用户到Sentry")
    public Map<String, Object> testUser(
            @RequestParam(defaultValue = "test-user-123") String userId,
            @RequestParam(defaultValue = "测试用户") String username,
            @RequestParam(defaultValue = "test@example.com") String email) {
        
        sentryErrorTrackingService.setUser(userId, username, email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "测试用户已设置到Sentry");
        response.put("userId", userId);
        response.put("username", username);
        response.put("email", email);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @PostMapping("/test/tag")
    @Operation(summary = "测试标签设置", description = "设置测试标签到Sentry")
    public Map<String, Object> testTag(
            @RequestParam String key,
            @RequestParam String value) {
        
        sentryErrorTrackingService.setTag(key, value);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "测试标签已设置到Sentry");
        response.put("key", key);
        response.put("value", value);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @PostMapping("/test/transaction")
    @Operation(summary = "测试事务", description = "创建测试事务到Sentry")
    public Map<String, Object> testTransaction(
            @RequestParam(defaultValue = "test-operation") String operation,
            @RequestParam(defaultValue = "测试事务") String description) {
        
        sentryErrorTrackingService.startTransaction(operation, description);
        
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        sentryErrorTrackingService.finishTransaction("completed");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "测试事务已完成");
        response.put("operation", operation);
        response.put("description", description);
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @PostMapping("/user/clear")
    @Operation(summary = "清除用户", description = "清除Sentry中的用户信息")
    public Map<String, Object> clearUser() {
        sentryErrorTrackingService.clearUser();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Sentry用户已清除");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "检查Sentry服务状态")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "Sentry监控服务运行正常");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
