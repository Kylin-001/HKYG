package com.heikeji.common.core.controller;

import com.heikeji.common.core.service.FallbackDemoService;
import com.heikeji.common.core.util.ResponseUtil;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 熔断降级示例控制器
 * 演示如何在Web层使用熔断降级功能
 */
@RestController
@RequestMapping("/api/demo/fallback")
@Slf4j
public class FallbackDemoController {

    @Autowired
    private FallbackDemoService fallbackDemoService;

    /**
     * 获取商品详情示例
     * 演示使用自定义注解实现的熔断降级功能
     */
    @GetMapping("/product/{id}")
    public ResponseUtil.ApiResponse<?> getProductDetail(@PathVariable("id") Long productId) {
        try {
            log.info("请求商品详情，商品ID: {}", productId);
            Map<String, Object> productDetail = fallbackDemoService.getProductDetail(productId);
            return ResponseUtil.success("获取商品详情成功", productDetail);
        } catch (IllegalArgumentException e) {
            return ResponseUtil.error(400, e.getMessage());
        } catch (Exception e) {
            log.error("获取商品详情异常", e);
            return ResponseUtil.error("获取商品详情失败");
        }
    }

    /**
     * 创建订单示例
     * 演示使用自定义注解实现的熔断降级和限流功能
     */
    @PostMapping("/order")
    public ResponseUtil.ApiResponse<?> createOrder(@RequestBody Map<String, Object> orderData) {
        try {
            log.info("创建订单请求: {}", orderData);
            Map<String, Object> result = fallbackDemoService.createOrder(orderData);
            
            // 判断是否是降级响应
            if (result.containsKey("status") && "FAIL_BACK".equals(result.get("status"))) {
                return ResponseUtil.fallback("订单服务暂时不可用", result);
            }
            
            return ResponseUtil.success("订单创建成功", result);
        } catch (IllegalArgumentException e) {
            return ResponseUtil.error(400, e.getMessage());
        } catch (Exception e) {
            log.error("创建订单异常", e);
            return ResponseUtil.error("创建订单失败");
        }
    }

    /**
     * 获取用户信息示例
     * 演示使用自定义注解实现的熔断降级功能
     */
    @GetMapping("/user/{id}")
    public ResponseUtil.ApiResponse<?> getUserInfo(@PathVariable("id") Long userId) {
        try {
            log.info("请求用户信息，用户ID: {}", userId);
            Map<String, Object> userInfo = fallbackDemoService.getUserInfo(userId);
            
            // 判断是否是降级响应
            if (userInfo.containsKey("fallback_reason")) {
                return ResponseUtil.fallback("用户服务暂时不可用", userInfo);
            }
            
            return ResponseUtil.success("获取用户信息成功", userInfo);
        } catch (IllegalArgumentException e) {
            return ResponseUtil.error(400, e.getMessage());
        } catch (Exception e) {
            log.error("获取用户信息异常", e);
            return ResponseUtil.error("获取用户信息失败");
        }
    }

    /**
     * 直接使用Resilience4j注解的示例
     * 演示框架原生注解的使用方式
     */
    @GetMapping("/direct/{id}")
    @CircuitBreaker(name = "directService", fallbackMethod = "directFallback")
    @Retry(name = "directService", fallbackMethod = "directFallback")
    public ResponseUtil.ApiResponse<?> directResilience4j(@PathVariable("id") Long id) {
        log.info("直接使用Resilience4j注解，参数ID: {}", id);
        
        // 模拟服务调用
        if (id == 100) {
            throw new RuntimeException("模拟服务异常");
        }
        
        Map<String, Object> data = new HashMap<>();
        data.put("id", id);
        data.put("message", "服务调用成功");
        data.put("timestamp", System.currentTimeMillis());
        
        return ResponseUtil.success(data);
    }
    
    /**
     * 直接使用Resilience4j注解的降级方法
     */
    public ResponseUtil.ApiResponse<?> directFallback(Long id, Throwable throwable) {
        log.warn("Resilience4j原生注解降级触发，参数: {}, 异常: {}", id, throwable.getMessage());
        
        Map<String, Object> fallbackData = new HashMap<>();
        fallbackData.put("id", id);
        fallbackData.put("message", "使用Resilience4j原生注解的降级响应");
        fallbackData.put("fallback_reason", throwable.getMessage());
        fallbackData.put("timestamp", System.currentTimeMillis());
        
        return ResponseUtil.fallback("服务暂时不可用", fallbackData);
    }

    /**
     * 限流示例
     * 演示限流功能的使用
     */
    @GetMapping("/rate-limit")
    @RateLimiter(name = "apiRateLimiter", fallbackMethod = "rateLimitFallback")
    public ResponseUtil.ApiResponse<?> rateLimitDemo() {
        log.info("限流示例请求");
        
        Map<String, Object> data = new HashMap<>();
        data.put("message", "限流示例请求成功");
        data.put("timestamp", System.currentTimeMillis());
        data.put("service", "heikeji-mall");
        
        return ResponseUtil.success(data);
    }
    
    /**
     * 限流降级方法
     */
    public ResponseUtil.ApiResponse<?> rateLimitFallback(Throwable throwable) {
        log.warn("限流触发，请求被拒绝: {}", throwable.getMessage());
        return ResponseUtil.rateLimit("当前请求频率过高，请稍后再试");
    }

    /**
     * 健康检查接口
     * 用于监控熔断系统状态
     */
    @GetMapping("/health")
    public ResponseUtil.ApiResponse<?> healthCheck() {
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("service", "heikeji-mall-fallback-demo");
        healthData.put("timestamp", System.currentTimeMillis());
        healthData.put("version", "1.0.0");
        
        return ResponseUtil.success("熔断降级系统运行正常", healthData);
    }
}