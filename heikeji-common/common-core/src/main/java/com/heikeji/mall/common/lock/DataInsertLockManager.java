package com.heikeji.mall.common.lock;

/**
 * 数据插入专用锁管理器
 *
 * 提供针对数据插入场景优化的锁策略：
 * 1. 用户唯一性保证锁（防止并发注册相同用户名）
 * 2. 批量操作原子性锁（保证批量事务完整性）
 * 3. 频率限制锁（防止单用户频繁操作）
 */
public class DataInsertLockManager {

    private final DistributedLockService lockService;

    public DataInsertLockManager(DistributedLockService lockService) {
        this.lockService = lockService;
    }

    /**
     * 在唯一性保护下执行用户插入
     * 确保同一用户名/学号不会被并发插入
     */
    public <T> T executeWithUniqueProtection(String username, String studentNo,
                                              DistributedLockService.LockExecutor<T> executor) {
        String lockKey = lockService.buildUserUniquenessLockKey(username, studentNo);

        return lockService.executeWithLock(lockKey, 3, 10, () -> {
            // 双重检查：获取锁后再次验证唯一性
            return executor.execute();
        });
    }

    /**
     * 在原子性保证下执行批量插入
     * 整个批量操作期间持有锁，防止部分提交
     */
    public <T> T executeWithAtomicGuarantee(String batchId,
                                            DistributedLockService.LockExecutor<T> executor) {
        String lockKey = lockService.buildBatchOperationLockKey(batchId);

        return lockService.executeWithLock(lockKey, 10, 60, executor);
    }

    /**
     * 在频率限制下执行操作
     * 同一用户在指定时间窗口内只能执行N次
     */
    public <T> T executeWithRateLimit(String userId, String operation,
                                       int maxAttempts, long windowSeconds,
                                       DistributedLockService.LockExecutor<T> executor) {
        String lockKey = lockService.buildRateLimitLockKey(userId, operation);

        return lockService.executeWithLock(lockKey, 0, windowSeconds, () -> {
            return executor.execute();
        });
    }
}
