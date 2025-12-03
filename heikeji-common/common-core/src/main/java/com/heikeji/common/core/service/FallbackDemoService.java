package com.heikeji.common.core.service;

import com.heikeji.common.core.annotation.EnableCircuitBreaker;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 熔断降级示例服务
 * 演示如何在实际业务中使用熔断降级功能
 */
@Service
public class FallbackDemoService {

    /**
     * 示例方法：获取商品详情
     * 演示基本的熔断降级功能
     */
    @EnableCircuitBreaker(
            name = "productDetailService",
            failureRateThreshold = 40,
            maxRetryAttempts = 2,
            retryWaitTime = 500,
            fallbackMethod = "getProductDetailFallback"
    )
    public Map<String, Object> getProductDetail(Long productId) {
        if (productId == null || productId <= 0) {
            throw new IllegalArgumentException("商品ID无效");
        }
        
        // 模拟服务调用
        // 在实际应用中，这里会调用商品服务或数据库查询
        if (productId == 999) {
            // 模拟服务异常，触发熔断
            throw new RuntimeException("商品服务暂时不可用");
        }
        
        // 正常返回商品信息
        Map<String, Object> product = new HashMap<>();
        product.put("id", productId);
        product.put("name", "测试商品" + productId);
        product.put("price", 99.99);
        product.put("stock", 100);
        product.put("status", 1);
        product.put("description", "这是一个测试商品描述信息");
        
        return product;
    }
    
    /**
     * 商品详情的降级方法
     */
    public Map<String, Object> getProductDetailFallback(Long productId, Throwable throwable) {
        Map<String, Object> fallbackData = new HashMap<>();
        fallbackData.put("id", productId);
        fallbackData.put("name", "[降级] 商品信息暂不可用");
        fallbackData.put("price", 0.0);
        fallbackData.put("stock", 0);
        fallbackData.put("status", 0);
        fallbackData.put("description", "商品服务暂时不可用，我们正在紧急处理中");
        fallbackData.put("fallback_reason", throwable.getMessage());
        fallbackData.put("timestamp", System.currentTimeMillis());
        
        return fallbackData;
    }

    /**
     * 示例方法：创建订单
     * 演示限流功能和自定义重试
     */
    @EnableCircuitBreaker(
            name = "createOrderService",
            failureRateThreshold = 50,
            maxRetryAttempts = 3,
            retryWaitTime = 1000,
            enableRateLimit = true,
            rateLimitThreshold = 50,
            fallbackMethod = "createOrderFallback"
    )
    public Map<String, Object> createOrder(Map<String, Object> orderData) {
        if (orderData == null || orderData.isEmpty()) {
            throw new IllegalArgumentException("订单数据不能为空");
        }
        
        // 模拟订单创建逻辑
        // 在实际应用中，这里会调用订单服务创建订单
        if (orderData.containsKey("triggerError") && Boolean.TRUE.equals(orderData.get("triggerError"))) {
            // 模拟服务异常，触发重试和熔断
            throw new RuntimeException("订单服务暂时不可用");
        }
        
        // 正常创建订单
        Map<String, Object> result = new HashMap<>();
        result.put("order_id", "ORD" + System.currentTimeMillis());
        result.put("status", "SUCCESS");
        result.put("message", "订单创建成功");
        result.put("create_time", System.currentTimeMillis());
        result.put("order_data", orderData);
        
        return result;
    }
    
    /**
     * 创建订单的降级方法
     */
    public Map<String, Object> createOrderFallback(Map<String, Object> orderData, Throwable throwable) {
        Map<String, Object> fallbackData = new HashMap<>();
        fallbackData.put("order_id", null);
        fallbackData.put("status", "FAIL_BACK");
        fallbackData.put("message", "订单服务暂时不可用，您的请求已加入队列，稍后将为您处理");
        fallbackData.put("fallback_reason", throwable.getMessage());
        fallbackData.put("timestamp", System.currentTimeMillis());
        
        // 可以在这里实现消息队列持久化，后续异步处理
        // 例如：将订单数据保存到数据库或消息队列中
        
        return fallbackData;
    }

    /**
     * 示例方法：获取用户信息
     * 演示不同的熔断策略
     */
    @EnableCircuitBreaker(
            name = "getUserInfoService",
            failureRateThreshold = 30,
            maxRetryAttempts = 2,
            retryWaitTime = 300,
            waitDurationInOpenState = 30,
            fallbackMethod = "getUserInfoFallback"
    )
    public Map<String, Object> getUserInfo(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("用户ID无效");
        }
        
        // 模拟用户服务调用
        if (userId == 888) {
            // 模拟服务超时
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            throw new RuntimeException("用户服务响应超时");
        }
        
        // 正常返回用户信息
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", userId);
        userInfo.put("username", "user" + userId);
        userInfo.put("nickname", "用户" + userId);
        userInfo.put("status", 1);
        userInfo.put("level", "普通用户");
        
        return userInfo;
    }
    
    /**
     * 获取用户信息的降级方法
     */
    public Map<String, Object> getUserInfoFallback(Long userId, Throwable throwable) {
        Map<String, Object> fallbackData = new HashMap<>();
        fallbackData.put("id", userId);
        fallbackData.put("username", "[降级] 用户信息加载中");
        fallbackData.put("nickname", "游客用户");
        fallbackData.put("status", 0);
        fallbackData.put("level", "未知");
        fallbackData.put("fallback_reason", throwable.getMessage());
        fallbackData.put("timestamp", System.currentTimeMillis());
        
        return fallbackData;
    }
}