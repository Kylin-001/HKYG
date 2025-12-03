package com.heikeji.gateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

/**
 * 服务降级控制器
 * 处理服务不可用、超时等场景的优雅降级
 */
@RestController
@Slf4j
public class FallbackController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 默认降级处理
     */
    @RequestMapping("/fallback")
    public Mono<String> defaultFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 执行默认服务降级，请求路径: {}", 
                exchange.getRequest().getURI().getPath());
        return createFallbackResponse("服务暂时不可用，请稍后重试");
    }

    /**
     * 支付服务降级处理
     */
    @RequestMapping("/fallback/payment")
    public Mono<String> paymentFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 支付服务降级，请求路径: {}", 
                exchange.getRequest().getURI().getPath());
        return createFallbackResponse("支付服务暂时不可用，您的订单已创建，请稍后再尝试支付");
    }

    /**
     * 商品服务降级处理
     */
    @RequestMapping("/fallback/product")
    public Mono<String> productFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 商品服务降级，请求路径: {}", 
                exchange.getRequest().getURI().getPath());
        return createFallbackResponse("商品服务暂时不可用，请稍后再浏览商品");
    }

    /**
     * 用户服务降级处理
     */
    @RequestMapping("/fallback/user")
    public Mono<String> userFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 用户服务降级，请求路径: {}", 
                exchange.getRequest().getURI().getPath());
        return createFallbackResponse("用户服务暂时不可用，请稍后再尝试登录或注册");
    }

    /**
     * 订单服务降级处理
     */
    @RequestMapping("/fallback/order")
    public Mono<String> orderFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 订单服务降级，请求路径: {}", 
                exchange.getRequest().getURI().getPath());
        return createFallbackResponse("订单服务暂时不可用，请稍后再尝试下单或查看订单");
    }

    /**
     * 创建统一格式的降级响应
     */
    private Mono<String> createFallbackResponse(String message) {
        Map<String, Object> fallbackResponse = new HashMap<>();
        fallbackResponse.put("code", 503);
        fallbackResponse.put("message", message);
        fallbackResponse.put("data", null);
        fallbackResponse.put("timestamp", System.currentTimeMillis());
        fallbackResponse.put("fallback", true);
        
        try {
            return Mono.just(objectMapper.writeValueAsString(fallbackResponse));
        } catch (Exception e) {
            log.error("[Gateway] 创建降级响应失败", e);
            return Mono.just("{\"code\":503,\"message\":\"服务暂时不可用\",\"data\":null}");
        }
    }

    /**
     * 限流降级处理
     */
    @RequestMapping("/fallback/rateLimit")
    public Mono<String> rateLimitFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 请求被限流，IP: {}", 
                exchange.getRequest().getRemoteAddress());
        return createFallbackResponse("请求过于频繁，请稍后再试");
    }

    /**
     * 认证失败降级处理
     */
    @RequestMapping("/fallback/auth")
    public Mono<String> authFallback(ServerWebExchange exchange) {
        log.warn("[Gateway] 认证失败降级，请求路径: {}", 
                exchange.getRequest().getURI().getPath());
        return createFallbackResponse("认证失败，请重新登录");
    }
}