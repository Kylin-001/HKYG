package com.heikeji.common.core.aspect;

import com.heikeji.common.core.annotation.RateLimiter;
import com.heikeji.common.core.constant.CacheConstants;
import com.heikeji.common.core.exception.BaseException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.TimeUnit;

/**
 * 限流切面实现
 * 支持令牌桶和计数器两种限流算法
 * 提供Redis和本地缓存双模式支持
 */
@Aspect
@Component
public class RateLimiterAspect {

    private static final Logger log = LoggerFactory.getLogger(RateLimiterAspect.class);
    private static final String RATE_LIMIT_PREFIX = "rate_limit:";

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    
    // 本地缓存作为Redis的后备，使用LRU策略
    private final Map<String, CacheEntry> localCache = new ConcurrentHashMap<>(1024);
    
    // 本地缓存最大容量
    private static final int LOCAL_CACHE_MAX_SIZE = 10000;
    
    // 本地缓存清理阈值
    private static final int LOCAL_CACHE_CLEAN_THRESHOLD = 8000;
    
    // 清理比例
    private static final double CLEAN_RATIO = 0.3;
    
    // 随机数生成器，用于添加随机过期时间防止缓存雪崩
    private final Random random = new Random();
    
    // 滑动窗口Lua脚本
    private static final String SLIDING_WINDOW_LUA_SCRIPT = """
        local key = KEYS[1]
        local limit = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        
        -- 移除窗口外的数据
        redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
        
        -- 获取当前窗口内的请求数量
        local current = redis.call('ZCARD', key)
        
        -- 检查是否超过限制
        if current >= limit then
            return 0
        end
        
        -- 将当前请求添加到窗口
        redis.call('ZADD', key, now, now)
        redis.call('EXPIRE', key, window)
        
        return 1
    """;
    
    // 令牌桶Lua脚本
    private static final String TOKEN_BUCKET_LUA_SCRIPT = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local rate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local requestCount = tonumber(ARGV[4])
        
        -- 获取令牌桶当前状态
        local bucket = redis.call('HMGET', key, 'tokens', 'lastRefillTime')
        local tokens = tonumber(bucket[1]) or capacity
        local lastRefillTime = tonumber(bucket[2]) or now
        
        -- 计算新增令牌数
        local elapsedTime = now - lastRefillTime
        local newTokens = math.min(capacity, tokens + (elapsedTime * rate))
        
        -- 检查是否有足够的令牌
        if newTokens >= requestCount then
            -- 消耗令牌
            newTokens = newTokens - requestCount
            
            -- 更新令牌桶状态
            redis.call('HMSET', key, 'tokens', newTokens, 'lastRefillTime', now)
            redis.call('PEXPIRE', key, math.ceil(capacity / rate * 1000)) -- 设置过期时间为填满令牌桶的时间
            
            return 1
        end
        
        return 0
    """;
    
    // Redis脚本定义
    private final DefaultRedisScript<Long> slidingWindowScript;
    private final DefaultRedisScript<Long> tokenBucketScript;
    
    // 是否启用令牌桶算法
    @Value("${rate.limiter.use-token-bucket:false}")
    private boolean useTokenBucket;
    
    public RateLimiterAspect() {
        // 初始化Lua脚本
        slidingWindowScript = new DefaultRedisScript<>(SLIDING_WINDOW_LUA_SCRIPT, Long.class);
        tokenBucketScript = new DefaultRedisScript<>(TOKEN_BUCKET_LUA_SCRIPT, Long.class);
    }
    
    /**
     * 本地缓存条目
     */
    private static class CacheEntry {
        private final AtomicInteger count; // 计数器模式
        private final AtomicLong tokens;   // 令牌桶模式
        private final long lastRefillTime; // 上次填充令牌时间
        private final long expireTime;     // 过期时间
        private final int capacity;        // 令牌桶容量
        private final double rate;         // 令牌生成速率
        private final boolean isTokenBucket; // 是否为令牌桶模式
        
        public CacheEntry(int maxCount, int timeWindow, boolean isTokenBucket) {
            this.isTokenBucket = isTokenBucket;
            if (isTokenBucket) {
                // 令牌桶模式
                this.capacity = maxCount;
                this.tokens = new AtomicLong(maxCount);
                this.rate = (double) maxCount / timeWindow; // 每秒生成的令牌数
                this.count = null;
            } else {
                // 计数器模式
                this.count = new AtomicInteger(1);
                this.tokens = null;
                this.capacity = 0;
                this.rate = 0;
            }
            this.lastRefillTime = System.currentTimeMillis();
            this.expireTime = System.currentTimeMillis() + (timeWindow * 1000L);
        }
        
        /**
         * 检查是否可以获取令牌（令牌桶模式）
         */
        public boolean tryAcquireTokenBucket() {
            long now = System.currentTimeMillis();
            
            // 计算新增令牌
            long elapsedTime = now - lastRefillTime;
            double newTokens = tokens.get() + (elapsedTime * rate / 1000.0);
            newTokens = Math.min(capacity, newTokens);
            
            if (newTokens >= 1) {
                // 消耗一个令牌
                tokens.set((long) (newTokens - 1));
                return true;
            }
            return false;
        }
        
        /**
         * 检查是否可以获取（计数器模式）
         */
        public boolean tryAcquireCounter(int maxCount) {
            return count.incrementAndGet() <= maxCount;
        }
        
        public boolean isExpired() {
            return System.currentTimeMillis() > expireTime;
        }
    }

    /**
     * 定义切入点
     */
    @Pointcut("@annotation(com.heikeji.common.core.annotation.RateLimiter)")
    public void rateLimitPointCut() {
    }

    /**
     * 环绕通知，实现限流逻辑
     */
    @Around("rateLimitPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        // 获取方法签名和注解信息
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        RateLimiter rateLimiter = method.getAnnotation(RateLimiter.class);
        
        if (rateLimiter == null) {
            return point.proceed();
        }
        
        // 构建限流键
        String key = generateKey(point, rateLimiter);
        int maxCount = rateLimiter.maxCount();
        int timeWindow = rateLimiter.timeWindow();
        String message = rateLimiter.message();
        
        // 执行限流逻辑
        if (!tryAcquire(key, maxCount, timeWindow)) {
            String methodName = method.getDeclaringClass().getName() + "." + method.getName();
            log.warn("接口限流触发: {}, 限流键: {}, 限制: {}次/{}秒", 
                     methodName, key, maxCount, timeWindow);
            throw new BaseException(message);
        }
        
        // 执行原方法
        return point.proceed();
    }

    /**
     * 生成限流键
     */
    private String generateKey(ProceedingJoinPoint point, RateLimiter rateLimiter) {
        StringBuilder key = new StringBuilder(RATE_LIMIT_PREFIX);
        
        // 获取请求信息
        HttpServletRequest request = null;
        try {
            ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (requestAttributes != null) {
                request = requestAttributes.getRequest();
            }
        } catch (Exception e) {
            log.warn("获取请求信息失败", e);
        }
        
        // 根据限流类型构建键
        String limitType = rateLimiter.limitType();
        if (request != null) {
            if ("ip".equals(limitType)) {
                // IP限流
                key.append("ip:").append(getClientIp(request));
            } else if ("user".equals(limitType)) {
                // 用户限流
                key.append("user:").append(getCurrentUserId(request));
            } else if ("method".equals(limitType)) {
                // 方法限流（不区分用户）
                key.append("method:");
            } else if ("ip_method".equals(limitType)) {
                // IP+方法限流
                key.append("ip_method:").append(getClientIp(request)).append(":");
            } else if ("user_method".equals(limitType)) {
                // 用户+方法限流
                key.append("user_method:").append(getCurrentUserId(request)).append(":");
            } else if ("api".equals(limitType)) {
                // API路径限流
                key.append("api:").append(request.getRequestURI());
            } else if ("ip_api".equals(limitType)) {
                // IP+API路径限流
                key.append("ip_api:").append(getClientIp(request)).append(":").append(request.getRequestURI());
            }
        } else {
            // 降级为方法限流
            key.append("method:");
        }
        
        // 加上方法信息
        MethodSignature signature = (MethodSignature) point.getSignature();
        key.append(signature.getDeclaringType().getName())
           .append(":")
           .append(signature.getName());
        
        return key.toString();
    }

    /**
     * 尝试获取令牌
     */
    private boolean tryAcquire(String key, int maxCount, int timeWindow) {
        // 防止本地缓存过大
        if (localCache.size() > LOCAL_CACHE_CLEAN_THRESHOLD) {
            cleanLocalCache();
        }
        
        // 清理过期的本地缓存
        cleanExpiredEntries();
        
        // 使用Redis或本地缓存
        if (redisTemplate != null) {
            try {
                return useTokenBucket ? 
                       tryAcquireWithTokenBucketRedis(key, maxCount, timeWindow) : 
                       tryAcquireWithSlidingWindowRedis(key, maxCount, timeWindow);
            } catch (Exception e) {
                log.warn("Redis限流操作失败，切换到本地缓存: {}", e.getMessage());
                // Redis失败时降级到本地缓存
                return tryAcquireWithLocalCache(key, maxCount, timeWindow);
            }
        } else {
            return tryAcquireWithLocalCache(key, maxCount, timeWindow);
        }
    }

    /**
     * 使用Redis滑动窗口算法进行限流
     */
    private boolean tryAcquireWithSlidingWindowRedis(String key, int maxCount, int timeWindow) {
        // 获取当前时间戳（毫秒）
        long now = System.currentTimeMillis();
        // 窗口大小（毫秒）
        long windowMillis = timeWindow * 1000L;
        
        // 执行Lua脚本
        Long result = redisTemplate.execute(
            slidingWindowScript,
            Collections.singletonList(key),
            maxCount, windowMillis, now
        );
        
        return result != null && result > 0;
    }

    /**
     * 使用Redis令牌桶算法进行限流
     */
    private boolean tryAcquireWithTokenBucketRedis(String key, int maxCount, int timeWindow) {
        // 获取当前时间戳（毫秒）
        long now = System.currentTimeMillis();
        // 令牌生成速率：每秒生成的令牌数
        double rate = (double) maxCount / timeWindow;
        
        // 执行Lua脚本
        Long result = redisTemplate.execute(
            tokenBucketScript,
            Collections.singletonList(key),
            maxCount, rate, now, 1
        );
        
        return result != null && result > 0;
    }

    /**
     * 使用本地缓存进行限流
     */
    private boolean tryAcquireWithLocalCache(String key, int maxCount, int timeWindow) {
        CacheEntry entry = localCache.get(key);
        
        if (entry == null || entry.isExpired()) {
            // 第一次访问或已过期，初始化
            entry = new CacheEntry(maxCount, timeWindow, useTokenBucket);
            localCache.put(key, entry);
            return true;
        }
        
        // 根据模式尝试获取
        if (useTokenBucket) {
            return entry.tryAcquireTokenBucket();
        } else {
            return entry.tryAcquireCounter(maxCount);
        }
    }
    
    /**
     * 清理本地缓存，防止内存溢出
     */
    private void cleanLocalCache() {
        if (localCache.size() > LOCAL_CACHE_MAX_SIZE) {
            int toRemove = (int) (localCache.size() * CLEAN_RATIO);
            log.info("本地缓存过大，清理 {} 条记录", toRemove);
            
            // 清理最旧的条目
            localCache.entrySet().stream()
                .sorted(Map.Entry.<String, CacheEntry>comparingByValue(
                    (e1, e2) -> Long.compare(e1.expireTime, e2.expireTime)))
                .limit(toRemove)
                .forEach(entry -> localCache.remove(entry.getKey()));
        }
    }
    
    /**
     * 清理过期的本地缓存条目
     */
    private void cleanExpiredEntries() {
        localCache.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    /**
     * 获取当前用户标识
     * 优先从安全上下文获取，然后从请求头获取token，最后返回IP
     */
    private String getCurrentUserId(HttpServletRequest request) {
        try {
            // 尝试从Spring Security上下文获取
            try {
                Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                Object principal = auth != null ? auth.getPrincipal() : null;
                if (principal != null && !(principal instanceof String && "anonymousUser".equals(principal))) {
                    if (principal instanceof Long) {
                        return principal.toString();
                    } else if (principal instanceof String) {
                        return principal.toString();
                    } else {
                        // 尝试通过反射获取ID字段
                        try {
                            Object id = principal.getClass().getMethod("getId").invoke(principal);
                            return id != null ? id.toString() : getClientIp(request);
                        } catch (Exception e) {
                            // 如果无法获取ID，则继续尝试其他方式
                        }
                    }
                }
            } catch (Exception e) {
                // Spring Security不可用，继续尝试
            }
            
            // 从请求头获取token
            String token = request.getHeader("Authorization");
            if (token != null && (token.startsWith("Bearer ") || token.startsWith("token "))) {
                token = token.substring(token.indexOf(' ') + 1);
                // 可以在这里添加JWT解析逻辑
                // 暂时使用token的哈希值作为标识，避免暴露原始token
                return Integer.toHexString(token.hashCode());
            }
            
            // 从请求参数获取token
            token = request.getParameter("token");
            if (token != null) {
                return Integer.toHexString(token.hashCode());
            }
            
            // 最后的备选方案：使用IP
            return getClientIp(request);
        } catch (Exception e) {
            log.warn("获取用户标识失败: {}", e.getMessage());
            return "unknown";
        }
    }

    /**
     * 获取客户端真实IP地址
     * 考虑了反向代理和负载均衡的情况
     */
    private String getClientIp(HttpServletRequest request) {
        String[] headers = new String[]{
            "X-Forwarded-For",
            "X-Real-IP",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        };
        
        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // X-Forwarded-For可能包含多个IP，取第一个
                if ("X-Forwarded-For".equals(header)) {
                    ip = ip.split(",")[0].trim();
                }
                // 验证IP格式
                if (isValidIp(ip)) {
                    return ip;
                }
            }
        }
        
        // 默认返回远程地址
        String remoteAddr = request.getRemoteAddr();
        return isValidIp(remoteAddr) ? remoteAddr : "127.0.0.1";
    }
    
    /**
     * 验证IP地址格式
     */
    private boolean isValidIp(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }
        
        // 简单的IPv4验证
        String[] parts = ip.split("\\.");
        if (parts.length != 4) {
            return false;
        }
        
        try {
            for (String part : parts) {
                int num = Integer.parseInt(part);
                if (num < 0 || num > 255) {
                    return false;
                }
            }
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}