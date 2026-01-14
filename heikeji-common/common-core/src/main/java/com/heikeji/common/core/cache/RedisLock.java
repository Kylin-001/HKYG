package com.heikeji.common.core.cache;

import com.heikeji.common.core.constant.CacheConstants;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

/**
 * Redis分布式锁实现
 * 用于防止缓存击穿、分布式并发操作等场景
 *
 * @author generator
 * @date 2024-01-01
 */
@Component
public class RedisLock {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 尝试获取锁
     *
     * @param lockKey        锁的键
     * @param requestId      请求标识，用于防止误解锁
     * @param expireTime     锁的过期时间
     * @param timeUnit       时间单位
     * @return 是否获取成功
     */
    public boolean tryLock(String lockKey, String requestId, long expireTime, TimeUnit timeUnit) {
        // 使用setIfAbsent保证原子性操作
        return redisTemplate.opsForValue().setIfAbsent(lockKey, requestId, expireTime, timeUnit);
    }

    /**
     * 尝试获取锁，默认30秒过期
     *
     * @param lockKey   锁的键
     * @param requestId 请求标识
     * @return 是否获取成功
     */
    public boolean tryLock(String lockKey, String requestId) {
        return tryLock(lockKey, requestId, CacheConstants.DEFAULT_LOCK_EXPIRE, TimeUnit.SECONDS);
    }

    /**
     * 解锁，使用Lua脚本保证原子性
     *
     * @param lockKey   锁的键
     * @param requestId 请求标识
     * @return 是否解锁成功
     */
    public boolean unlock(String lockKey, String requestId) {
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>(script, Long.class);
        Long result = redisTemplate.execute(redisScript, Collections.singletonList(lockKey), requestId);
        return result != null && result > 0;
    }

    /**
     * 可重入锁获取
     * 支持同一线程多次获取同一把锁
     *
     * @param lockKey        锁的键
     * @param requestId      请求标识
     * @param expireTime     锁的过期时间
     * @param timeUnit       时间单位
     * @return 是否获取成功
     */
    public boolean tryReentrantLock(String lockKey, String requestId, long expireTime, TimeUnit timeUnit) {
        // 构建可重入锁的键
        String reentrantKey = lockKey + ":" + requestId;
        
        // 尝试获取锁或增加计数
        if (redisTemplate.hasKey(lockKey)) {
            // 锁已存在，检查是否是同一请求
            Object currentValue = redisTemplate.opsForValue().get(lockKey);
            if (requestId.equals(currentValue)) {
                // 同一请求，增加计数
                redisTemplate.opsForValue().increment(reentrantKey);
                // 重置过期时间
                redisTemplate.expire(lockKey, expireTime, timeUnit);
                return true;
            }
            return false;
        } else {
            // 锁不存在，尝试获取
            boolean success = redisTemplate.opsForValue().setIfAbsent(lockKey, requestId, expireTime, timeUnit);
            if (success) {
                // 设置计数为1
                redisTemplate.opsForValue().set(reentrantKey, 1, expireTime, timeUnit);
            }
            return success;
        }
    }

    /**
     * 可重入锁解锁
     *
     * @param lockKey   锁的键
     * @param requestId 请求标识
     * @return 是否解锁成功
     */
    public boolean unlockReentrant(String lockKey, String requestId) {
        Object currentValue = redisTemplate.opsForValue().get(lockKey);
        if (currentValue == null || !requestId.equals(currentValue)) {
            // 锁不存在或不是当前线程持有
            return false;
        }

        String reentrantKey = lockKey + ":" + requestId;
        Long count = redisTemplate.opsForValue().decrement(reentrantKey);
        
        if (count == null || count <= 0) {
            // 计数为0，释放锁
            redisTemplate.delete(lockKey);
            redisTemplate.delete(reentrantKey);
        }
        return true;
    }

    /**
     * 强制解锁（慎用）
     *
     * @param lockKey 锁的键
     */
    public void forceUnlock(String lockKey) {
        redisTemplate.delete(lockKey);
    }

    /**
     * 检查锁是否存在
     *
     * @param lockKey 锁的键
     * @return 是否存在
     */
    public boolean isLocked(String lockKey) {
        return redisTemplate.hasKey(lockKey);
    }
}