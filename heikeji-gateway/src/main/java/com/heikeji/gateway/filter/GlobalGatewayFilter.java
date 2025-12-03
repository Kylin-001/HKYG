package com.heikeji.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * 全局网关过滤器
 * 处理请求日志、认证检查、参数校验等
 */
@Component
@Slf4j
public class GlobalGatewayFilter implements GlobalFilter, Ordered {

    // 白名单路径
    private static final List<String> WHITE_LIST = Arrays.asList(
            "/admin/login",
            "/api/user/login",
            "/api/user/register",
            "/api/product/public",
            "/fallback"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod() != null ? request.getMethod().name() : "unknown";
        String clientIp = request.getRemoteAddress() != null ? 
                          request.getRemoteAddress().getHostString() : "unknown";
        
        // 记录请求开始日志
        log.info("[Gateway] 收到请求: {} {} 来自IP: {}", method, path, clientIp);
        
        // 检查白名单
        boolean isWhiteList = WHITE_LIST.stream().anyMatch(whitePath -> 
                path.startsWith(whitePath) || path.equals(whitePath)
        );
        
        // 非白名单路径进行认证检查
        if (!isWhiteList) {
            String token = extractToken(request);
            if (StringUtils.isBlank(token)) {
                return handleUnauthorized(exchange, "未提供认证令牌");
            }
            
            // 这里可以添加token验证逻辑
            // 暂时跳过具体验证，仅打印token信息
            log.debug("[Gateway] 验证token: {}", maskToken(token));
        }
        
        // 记录请求参数（GET请求）
        if ("GET".equals(method)) {
            Map<String, String> queryParams = request.getQueryParams().toSingleValueMap();
            log.debug("[Gateway] 请求参数: {}", queryParams);
        } 
        // 对于POST等请求，可以读取请求体，但需要注意不影响后续处理
        else if (Arrays.asList("POST", "PUT", "PATCH").contains(method)) {
            // 这里可以根据需要读取请求体
            // 注意：读取请求体需要特殊处理，避免流被消费后无法再次读取
            log.debug("[Gateway] 检测到非GET请求，如需记录请求体请实现相应逻辑");
        }
        
        // 继续过滤器链
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long endTime = System.currentTimeMillis();
            ServerHttpResponse response = exchange.getResponse();
            int statusCode = response.getStatusCode().value();
            
            // 记录请求结束日志
            log.info("[Gateway] 请求完成: {} {} 状态: {} 耗时: {}ms", 
                     method, path, statusCode, (endTime - startTime));
            
            // 添加响应时间头
            response.getHeaders().add("X-Response-Time", String.valueOf(endTime - startTime));
        }));
    }
    
    /**
     * 从请求中提取token
     */
    private String extractToken(ServerHttpRequest request) {
        String token = request.getHeaders().getFirst("Authorization");
        if (StringUtils.isNotBlank(token) && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        // 尝试从查询参数获取
        return request.getQueryParams().getFirst("token");
    }
    
    /**
     * 处理未授权请求
     */
    private Mono<Void> handleUnauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        
        try {
            Map<String, Object> errorResponse = Map.of(
                    "code", 401,
                    "message", message,
                    "data", null,
                    "timestamp", System.currentTimeMillis()
            );
            String json = new ObjectMapper().writeValueAsString(errorResponse);
            DataBuffer buffer = response.bufferFactory().wrap(json.getBytes(StandardCharsets.UTF_8));
            return response.writeWith(Mono.just(buffer));
        } catch (JsonProcessingException e) {
            log.error("[Gateway] 处理未授权响应失败", e);
            String errorMsg = "{\"code\":500,\"message\":\"网关处理错误\",\"data\":null}";
            DataBuffer buffer = response.bufferFactory().wrap(errorMsg.getBytes(StandardCharsets.UTF_8));
            return response.writeWith(Mono.just(buffer));
        }
    }
    
    /**
     * 隐藏token敏感信息
     */
    private String maskToken(String token) {
        if (token.length() <= 8) {
            return "******" + token.substring(token.length() - 2);
        }
        return token.substring(0, 6) + "******" + token.substring(token.length() - 6);
    }

    @Override
    public int getOrder() {
        // 设置过滤器顺序，数值越小优先级越高
        return -100;
    }
}