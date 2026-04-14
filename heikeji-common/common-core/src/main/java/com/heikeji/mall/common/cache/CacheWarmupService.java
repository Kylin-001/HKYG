package com.heikeji.mall.common.cache;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 智能缓存预热与刷新服务
 *
 * 在数据批量插入后，主动预热相关缓存，
 * 避免大量缓存穿透导致的数据库压力。
 *
 * 策略：
 * 1. 即时预热：插入成功后立即加载到缓存
 * 2. 延迟预热：低峰期批量预加载热点数据
 * 3. 渐进式预热：按优先级分批加载
 * 4. 失效保护：预热失败不影响主流程
 */
@Slf4j
@Service
public class CacheWarmupService {

    @Autowired(required = false)
    private CacheManager cacheManager;

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    private final Map<String, WarmupTaskStatus> warmupTasks = new ConcurrentHashMap<>();

    private static final String CACHE_PREFIX_USER = "user:";
    private static final String CACHE_PREFIX_PRODUCT = "product:";
    private static final Duration DEFAULT_TTL = Duration.ofHours(2);

    /**
     * 单条数据插入后立即预热缓存
     *
     * @param module   模块 (user/product)
     * @param entityId 实体ID
     * @param data     实体数据
     */
    public void warmupAfterInsert(String module, Long entityId, Object data) {
        String cacheKey = buildCacheKey(module, entityId);

        try {
            if (redisTemplate != null) {
                redisTemplate.opsForValue().set(cacheKey, data, DEFAULT_TTL);
                log.debug("✅ 缓存已预热: key={}, module={}", cacheKey, module);
            } else if (cacheManager != null) {
                var cache = cacheManager.getCache(module + "Cache");
                if (cache != null) {
                    cache.put(entityId, data);
                    log.debug("✅ 缓存已预热(Spring Cache): module={}, id={}", module, entityId);
                }
            }
        } catch (Exception e) {
            log.warn("⚠️ 缓存预热失败(不影响主流程): key={}, error={}", cacheKey, e.getMessage());
        }
    }

    /**
     * 批量插入后智能预热策略
     *
     * 根据数据量和系统负载选择最优策略：
     * - <50条: 同步即时预热
     * - 50-500条: 异步渐进式预热
     * - >500条: 低峰期延迟预热
     */
    public CompletableFuture<WarmupResult> warmupAfterBatchInsert(
            String module,
            List<Long> entityIds,
            BatchDataProvider dataProvider) {

        String taskId = UUID.randomUUID().toString().substring(0, 8);

        WarmupTaskStatus status = new WarmupTaskStatus();
        status.setTaskId(taskId);
        status.setModule(module);
        status.setTotalCount(entityIds.size());
        status.setStatus("PENDING");
        status.setStartTime(new Date());
        warmupTasks.put(taskId, status);

        log.info("🔥 开始批量缓存预热: taskId={}, module={}, 数量={}",
                taskId, module, entityIds.size());

        CompletableFuture<WarmupResult> future;

        if (entityIds.size() <= 50) {
            future = warmupSync(taskId, module, entityIds, dataProvider, status);
        } else if (entityIds.size() <= 500) {
            future = warmupAsyncProgressive(taskId, module, entityIds, dataProvider, status);
        } else {
            future = warmupAsyncDelayed(taskId, module, entityIds, dataProvider, status);
        }

        return future.whenComplete((result, ex) -> {
            status.setStatus("COMPLETED");
            status.setEndTime(new Date());
            status.setSuccessCount(result.getSuccessCount());
            status.setFailCount(result.getFailCount());
            log.info("🎉 批量缓存预热完成: taskId={}, 成功={}, 失败={}, 耗时={}ms",
                    taskId, result.getSuccessCount(), result.getFailCount(),
                    System.currentTimeMillis() - status.getStartTime().getTime());
        });
    }

    /**
     * 同步即时预热（小批量）
     */
    private CompletableFuture<WarmupResult> warmupSync(
            String taskId, String module, List<Long> entityIds,
            BatchDataProvider provider, WarmupTaskStatus status) {

        return CompletableFuture.supplyAsync(() -> {
            status.setStatus("PROCESSING");
            int success = 0;
            int fail = 0;

            for (Long id : entityIds) {
                try {
                    Object data = provider.getData(module, id);
                    if (data != null) {
                        warmupAfterInsert(module, id, data);
                        success++;
                    } else {
                        fail++;
                        log.debug("数据为空，跳过缓存: module={}, id={}", module, id);
                    }
                } catch (Exception e) {
                    fail++;
                    log.warn("预热失败: module={}, id={}, error={}", module, id, e.getMessage());
                }
            }

            return new WarmupResult(taskId, entityIds.size(), success, fail);
        });
    }

    /**
     * 异步渐进式预热（中批量）
     * 分批处理，每批20条，间隔100ms
     */
    @Async("taskExecutor")
    public CompletableFuture<WarmupResult> warmupAsyncProgressive(
            String taskId, String module, List<Long> entityIds,
            BatchDataProvider provider, WarmupTaskStatus status) {

        status.setStatus("PROCESSING_PROGRESSIVE");

        return CompletableFuture.supplyAsync(() -> {
            int batchSize = 20;
            int success = 0;
            int fail = 0;

            for (int i = 0; i < entityIds.size(); i += batchSize) {
                int end = Math.min(i + batchSize, entityIds.size());
                List<Long> batch = entityIds.subList(i, end);

                log.info("🔄 预热进度: {}/{} ({:.1f}%)",
                        end, entityIds.size(), (double) end / entityIds.size() * 100);

                for (Long id : batch) {
                    try {
                        Object data = provider.getData(module, id);
                        if (data != null) {
                            warmupAfterInsert(module, id, data);
                            success++;
                        } else {
                            fail++;
                        }
                    } catch (Exception e) {
                        fail++;
                    }
                }

                try {
                    Thread.sleep(100); // 控制速率，避免压垮DB
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }

            return new WarmupResult(taskId, entityIds.size(), success, fail);
        });
    }

    /**
     * 异步延迟预热（大批量）
     * 等待低峰期再执行
     */
    @Async("taskExecutor")
    public CompletableFuture<WarmupResult> warmupAsyncDelayed(
            String taskId, String module, List<Long> entityIds,
            BatchDataProvider provider, WarmupTaskStatus status) {

        status.setStatus("SCHEDULED_DELAYED");

        return CompletableFuture.supplyAsync(() -> {
            try {
                int delaySeconds = calculateOptimalDelay();
                log.info("⏳ 大批量预热延迟执行: 等待{}秒, 数量={}", delaySeconds, entityIds.size());
                Thread.sleep(delaySeconds * 1000L);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return new WarmupResult(taskId, entityIds.size(), 0, entityIds.size());
            }

            return warmupAsyncProgressive(taskId, module, entityIds, provider, status).join();
        });
    }

    /**
     * 根据当前时间计算最佳延迟时间
     * 目标：在业务低峰期执行（凌晨2-6点或中午12-14点）
     */
    private int calculateOptimalDelay() {
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR_OF_DAY);

        if (hour >= 2 && hour < 6) {
            return 0; // 已经是低峰期，立即执行
        } else if (hour >= 12 && hour < 14) {
            return 60; // 午休时间，1分钟后
        } else if (hour < 2) {
            return (2 - hour) * 3600; // 到凌晨2点
        } else if (hour >= 22) {
            return (26 - hour) * 3600; // 到凌晨2点
        } else {
            return 3600; // 默认延迟1小时
        }
    }

    /**
     * 预热指定实体的关联缓存
     * 例如：插入用户后，同时预热其地址、收藏等关联数据
     */
    public void warmupRelatedCaches(String module, Long entityId, RelatedCacheProvider provider) {
        log.debug("🔗 开始预热关联缓存: module={}, id={}", module, entityId);

        try {
            Map<String, Object> relatedData = provider.getRelatedData(module, entityId);

            if (relatedData != null) {
                relatedData.forEach((key, value) -> {
                    String fullKey = module + ":" + entityId + ":" + key;
                    try {
                        if (redisTemplate != null) {
                            redisTemplate.opsForValue().set(fullKey, value, DEFAULT_TTL);
                        }
                        log.trace("关联缓存已预热: {}", fullKey);
                    } catch (Exception e) {
                        log.warn("关联缓存预热失败: key={}, error={}", fullKey, e.getMessage());
                    }
                });
            }
        } catch (Exception e) {
            log.warn("关联数据获取失败: module={}, id={}, error={}", module, entityId, e.getMessage());
        }
    }

    /**
     * 批量清除模块缓存
     */
    public void evictModuleCache(String module) {
        log.info("🗑️ 清除模块缓存: {}", module);

        try {
            if (cacheManager != null) {
                var cache = cacheManager.getCache(module + "Cache");
                if (cache != null) {
                    cache.clear();
                    log.info("✅ Spring Cache已清除: {}", module);
                }
            }

            if (redisTemplate != null) {
                Set<String> keys = redisTemplate.keys(module + ":*");
                if (keys != null && !keys.isEmpty()) {
                    redisTemplate.delete(keys);
                    log.info("✅ Redis缓存已清除: {}, 数量={}", module, keys.size());
                }
            }
        } catch (Exception e) {
            log.error("❌ 清除缓存异常: module={}, error={}", module, e.getMessage(), e);
        }
    }

    /**
     * 查询预热任务状态
     */
    public WarmupTaskStatus getWarmupStatus(String taskId) {
        return warmupTasks.getOrDefault(taskId, new WarmupTaskStatus("NOT_FOUND"));
    }

    /**
     * 清理过期的任务记录
     */
    public void cleanupOldTasks(int maxAgeHours) {
        long threshold = System.currentTimeMillis() - (maxAgeHours * 3600000L);

        warmupTasks.entrySet().removeIf(entry -> {
            WarmupTaskStatus status = entry.getValue();
            return status.getStartTime() != null &&
                    status.getStartTime().getTime() < threshold;
        });

        log.debug("清理过期预热任务完成, 当前活跃任务数: {}", warmupTasks.size());
    }

    private String buildCacheKey(String module, Long entityId) {
        switch (module.toLowerCase()) {
            case "user":
                return CACHE_PREFIX_USER + entityId;
            case "product":
                return CACHE_PREFIX_PRODUCT + entityId;
            default:
                return module + ":" + entityId;
        }
    }

    @FunctionalInterface
    public interface BatchDataProvider {
        Object getData(String module, Long entityId);
    }

    @FunctionalInterface
    public interface RelatedCacheProvider {
        Map<String, Object> getRelatedData(String module, Long entityId);
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class WarmupResult {
        private String taskId;
        private int totalCount;
        private int successCount;
        private int failCount;
        private Date completedTime;

        public WarmupResult(String taskId, int total, int success, int fail) {
            this.taskId = taskId;
            this.totalCount = total;
            this.successCount = success;
            this.failCount = fail;
            this.completedTime = new Date();
        }
    }

    @lombok.Data
    public static class WarmupTaskStatus {
        private String taskId;
        private String module;
        private String status;
        private int totalCount;
        private int successCount;
        private int failCount;
        private Date startTime;
        private Date endTime;
        private double progress;

        public WarmupTaskStatus() {}

        public WarmupTaskStatus(String status) {
            this.status = status;
        }
    }
}
