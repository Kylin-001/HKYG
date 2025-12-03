package com.heikeji.common.core.monitor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 业务指标收集器
 * 用于收集和统计关键业务指标数据
 */
@Component
public class MetricsCollector {

    private static final Logger log = LoggerFactory.getLogger("metrics");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH");

    @Autowired(required = false)
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 计数器前缀
     */
    private static final String COUNTER_PREFIX = "metrics:counter:";
    
    /**
     * 统计数据前缀
     */
    private static final String STATS_PREFIX = "metrics:stats:";
    
    /**
     * 记录用户注册数量
     */
    public void recordUserRegister() {
        incrementCounter("user:register");
    }
    
    /**
     * 记录订单创建数量
     */
    public void recordOrderCreate() {
        incrementCounter("order:create");
    }
    
    /**
     * 记录订单支付数量
     */
    public void recordOrderPay() {
        incrementCounter("order:pay");
    }
    
    /**
     * 记录订单取消数量
     */
    public void recordOrderCancel() {
        incrementCounter("order:cancel");
    }
    
    /**
     * 记录商品浏览量
     * @param productId 商品ID
     */
    public void recordProductView(Long productId) {
        incrementCounter("product:view:" + productId);
    }
    
    /**
     * 记录商品购买量
     * @param productId 商品ID
     */
    public void recordProductBuy(Long productId) {
        incrementCounter("product:buy:" + productId);
    }
    
    /**
     * 记录接口调用次数
     * @param apiName 接口名称
     */
    public void recordApiCall(String apiName) {
        incrementCounter("api:call:" + apiName);
    }
    
    /**
     * 记录接口调用耗时
     * @param apiName 接口名称
     * @param costTime 耗时(毫秒)
     */
    public void recordApiCostTime(String apiName, long costTime) {
        String dateStr = LocalDate.now().format(DATE_FORMATTER);
        String hourStr = LocalDateTime.now().format(TIME_FORMATTER);
        String key = STATS_PREFIX + "api:cost:" + apiName + ":" + dateStr + ":" + hourStr;
        
        // 记录接口耗时信息
        recordStats(key, costTime);
        
        // 记录慢接口告警
        if (costTime > 1000) { // 1秒以上视为慢接口
            log.warn("慢接口告警: {} 耗时 {}ms", apiName, costTime);
        }
    }
    
    /**
     * 记录系统错误
     * @param errorType 错误类型
     */
    public void recordSystemError(String errorType) {
        incrementCounter("system:error:" + errorType);
    }
    
    /**
     * 记录缓存命中率
     * @param cacheName 缓存名称
     * @param hit 是否命中
     */
    public void recordCacheHit(String cacheName, boolean hit) {
        if (hit) {
            incrementCounter("cache:hit:" + cacheName);
        } else {
            incrementCounter("cache:miss:" + cacheName);
        }
    }
    
    /**
     * 增加计数器
     * @param key 计数器键
     */
    private void incrementCounter(String key) {
        String dateStr = LocalDate.now().format(DATE_FORMATTER);
        String counterKey = COUNTER_PREFIX + key + ":" + dateStr;
        
        try {
            // 如果有Redis，则使用Redis进行计数
            if (redisTemplate != null) {
                redisTemplate.opsForValue().increment(counterKey);
                // 设置过期时间为7天
                redisTemplate.expire(counterKey, 7, TimeUnit.DAYS);
            } else {
                // 如果没有Redis，记录到日志
                log.info("Counter increment: {}", counterKey);
            }
        } catch (Exception e) {
            log.error("Increment counter failed: {}", key, e);
        }
    }
    
    /**
     * 记录统计数据
     * @param key 统计键
     * @param value 统计值
     */
    private void recordStats(String key, long value) {
        try {
            if (redisTemplate != null) {
                // 使用List存储统计数据
                redisTemplate.opsForList().leftPush(key, String.valueOf(value));
                // 设置过期时间为7天
                redisTemplate.expire(key, 7, TimeUnit.DAYS);
                
                // 维护最大值、最小值、平均值等统计信息
                String maxKey = key + ":max";
                String minKey = key + ":min";
                String sumKey = key + ":sum";
                String countKey = key + ":count";
                
                // 比较并更新最大值
                String currentMax = redisTemplate.opsForValue().get(maxKey);
                if (currentMax == null || value > Long.parseLong(currentMax)) {
                    redisTemplate.opsForValue().set(maxKey, String.valueOf(value));
                    redisTemplate.expire(maxKey, 7, TimeUnit.DAYS);
                }
                
                // 比较并更新最小值
                String currentMin = redisTemplate.opsForValue().get(minKey);
                if (currentMin == null || value < Long.parseLong(currentMin)) {
                    redisTemplate.opsForValue().set(minKey, String.valueOf(value));
                    redisTemplate.expire(minKey, 7, TimeUnit.DAYS);
                }
                
                // 更新总和和计数
                redisTemplate.opsForValue().increment(sumKey, value);
                redisTemplate.expire(sumKey, 7, TimeUnit.DAYS);
                
                redisTemplate.opsForValue().increment(countKey);
                redisTemplate.expire(countKey, 7, TimeUnit.DAYS);
            } else {
                // 如果没有Redis，记录到日志
                log.info("Stats record: {} = {}", key, value);
            }
        } catch (Exception e) {
            log.error("Record stats failed: {}", key, e);
        }
    }
    
    /**
     * 获取当日统计数据
     * @param metricName 指标名称
     * @return 统计数据
     */
    public Map<String, Object> getDailyStats(String metricName) {
        Map<String, Object> result = new HashMap<>();
        String dateStr = LocalDate.now().format(DATE_FORMATTER);
        String counterKey = COUNTER_PREFIX + metricName + ":" + dateStr;
        
        try {
            if (redisTemplate != null) {
                // 获取计数器的值
                String countValue = redisTemplate.opsForValue().get(counterKey);
                result.put("count", countValue != null ? Long.parseLong(countValue) : 0);
                
                // 获取统计数据
                String maxKey = STATS_PREFIX + "api:cost:" + metricName + ":" + dateStr + ":*" + ":max";
                String minKey = STATS_PREFIX + "api:cost:" + metricName + ":" + dateStr + ":*" + ":min";
                String sumKey = STATS_PREFIX + "api:cost:" + metricName + ":" + dateStr + ":*" + ":sum";
                String countKey = STATS_PREFIX + "api:cost:" + metricName + ":" + dateStr + ":*" + ":count";
                
                // 这里需要更复杂的逻辑来获取聚合数据
                result.put("max", 0);
                result.put("min", 0);
                result.put("avg", 0);
            } else {
                result.put("count", 0);
            }
        } catch (Exception e) {
            log.error("Get daily stats failed: {}", metricName, e);
        }
        
        return result;
    }
}