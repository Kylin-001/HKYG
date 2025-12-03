package com.heikeji.common.core.health;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Redis健康检查指示器
 * 用于检查Redis连接状态和性能指标
 */
@Component
public class RedisHealthIndicator {

    private static final Logger log = LoggerFactory.getLogger(RedisHealthIndicator.class);

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 执行健康检查
     */
    public Map<String, Object> checkHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        
        if (redisTemplate == null) {
            healthInfo.put("status", "DOWN");
            healthInfo.put("error", "RedisTemplate not available");
            return healthInfo;
        }

        try {
            // 测试Redis连接
            String testKey = "health:check";
            String testValue = "OK";
            
            // 设置测试值
            redisTemplate.opsForValue().set(testKey, testValue, 10, TimeUnit.SECONDS);
            
            // 读取测试值
            Object retrievedValue = redisTemplate.opsForValue().get(testKey);
            boolean readWriteSuccess = testValue.equals(retrievedValue);
            
            // 执行ping命令
            String pingResult = redisTemplate.getConnectionFactory()
                .getConnection()
                .ping();
            boolean pingSuccess = "PONG".equalsIgnoreCase(pingResult);
            
            // 收集Redis信息
            Map<String, Object> redisDetails = new HashMap<>();
            redisDetails.put("connection_status", pingSuccess ? "UP" : "DOWN");
            redisDetails.put("read_write_test", readWriteSuccess ? "success" : "failed");
            redisDetails.put("ping_result", pingResult);
            redisDetails.put("connection_factory", redisTemplate.getConnectionFactory()
                .getConnection()
                .getClass()
                .getSimpleName());
            
            // 清理测试数据
            redisTemplate.delete(testKey);
            
            // 判断整体状态
            boolean overallSuccess = pingSuccess && readWriteSuccess;
            healthInfo.put("status", overallSuccess ? "UP" : "DOWN");
            healthInfo.putAll(redisDetails);
            
            if (overallSuccess) {
                log.debug("Redis health check passed: {}", redisDetails);
            } else {
                log.warn("Redis health check failed: {}", redisDetails);
            }
            
        } catch (Exception e) {
            log.error("Redis health check failed", e);
            healthInfo.put("status", "DOWN");
            healthInfo.put("error", e.getMessage());
            healthInfo.put("exception", e.getClass().getSimpleName());
        }
        
        return healthInfo;
    }
}
