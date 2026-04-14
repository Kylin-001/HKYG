package com.heikeji.mall.common.lock;

import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * 分布式锁服务
 *
 * 基于Redisson实现的分布式锁，用于：
 * 1. 防止并发重复插入（同一用户名/学号）
 * 2. 保证批量操作的原子性
 * 3. 限制资源访问频率
 *
 * 特性：
 * - 可重入锁支持
 * - 自动续期（看门狗机制）
 * - 超时释放防止死锁
 * - 锁等待超时控制
 */
@Slf4j
@Component
public class DistributedLockService {

    @Autowired(required = false)
    private RedissonClient redissonClient;

    private static final long DEFAULT_WAIT_TIME = 5L;
    private static final long DEFAULT_LEASE_TIME = 30L;

    /**
     * 执行带分布式锁的操作
     *
     * @param lockKey    锁的键名
     * @param executor   要执行的操作
     * @param <T>        返回值类型
     * @return 操作结果
     */
    public <T> T executeWithLock(String lockKey, LockExecutor<T> executor) {
        return executeWithLock(lockKey, DEFAULT_WAIT_TIME, DEFAULT_LEASE_TIME, executor);
    }

    /**
     * 执行带分布式锁的操作（自定义超时）
     *
     * @param lockKey      锁的键名
     * @param waitTime     获取锁的最大等待时间（秒）
     * @param leaseTime    锁的自动释放时间（秒）
     * @param executor     要执行的操作
     * @param <T>          返回值类型
     * @return 操作结果
     */
    public <T> T executeWithLock(String lockKey, long waitTime, long leaseTime,
                                  LockExecutor<T> executor) {
        if (redissonClient == null) {
            log.warn("Redisson未配置，降级为本地执行");
            return executor.execute();
        }

        RLock lock = redissonClient.getLock(lockKey);
        boolean acquired = false;

        try {
            log.debug("尝试获取分布式锁: {}, 等待时间: {}s, 持有时间: {}s",
                    lockKey, waitTime, leaseTime);

            acquired = lock.tryLock(waitTime, leaseTime, TimeUnit.SECONDS);

            if (acquired) {
                log.info("成功获取分布式锁: {}", lockKey);
                T result = executor.execute();
                log.info("锁内操作完成: {}", lockKey);
                return result;
            } else {
                log.warn("获取锁失败(超时): {}", lockKey);
                throw new RuntimeException("操作繁忙，请稍后重试（锁获取超时）");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("获取锁被中断: {}", lockKey, e);
            throw new RuntimeException("操作被中断", e);
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("已释放分布式锁: {}", lockKey);
            }
        }
    }

    /**
     * 尝试非阻塞方式获取锁并执行
     *
     * @param lockKey  锁键名
     * @param executor 执行器
     * @param <T>      返回类型
     * @return Optional包装的结果，未获取到锁返回empty
     */
    public <T> java.util.Optional<T> tryExecuteWithLock(String lockKey, LockExecutor<T> executor) {
        if (redissonClient == null) {
            return java.util.Optional.ofNullable(executor.execute());
        }

        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean acquired = lock.tryLock(0, DEFAULT_LEASE_TIME, TimeUnit.SECONDS);
            if (acquired) {
                try {
                    return java.util.Optional.ofNullable(executor.execute());
                } finally {
                    if (lock.isHeldByCurrentThread()) {
                        lock.unlock();
                    }
                }
            } else {
                log.debug("非阻塞获取锁失败: {}", lockKey);
                return java.util.Optional.empty();
            }
        } catch (Exception e) {
            log.error("尝试获取锁异常: {}", lockKey, e);
            return java.util.Optional.empty();
        }
    }

    /**
     * 生成用户唯一性检查的锁键
     */
    public String buildUserUniquenessLockKey(String username, String studentNo) {
        return String.format("lock:user:insert:%s:%s",
                username != null ? username : "null",
                studentNo != null ? studentNo : "null");
    }

    /**
     * 生成批量操作锁键
     */
    public String buildBatchOperationLockKey(String operationId) {
        return String.format("lock:batch:insert:%s", operationId);
    }

    /**
     * 生成限流锁键（用于频率限制）
     */
    public String buildRateLimitLockKey(String userId, String operation) {
        return String.format("lock:ratelimit:%s:%s", operation, userId);
    }

    /**
     * 检查锁是否被持有
     */
    public boolean isLocked(String lockKey) {
        if (redissonClient == null) return false;
        RLock lock = redissonClient.getLock(lockKey);
        return lock.isLocked();
    }

    @FunctionalInterface
    public interface LockExecutor<T> {
        T execute() throws Exception;
    }
}
