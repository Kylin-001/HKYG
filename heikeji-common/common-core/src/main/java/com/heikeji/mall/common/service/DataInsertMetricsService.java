package com.heikeji.mall.common.service;

import io.micrometer.core.instrument.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 数据插入指标监控服务
 *
 * 功能：
 * 1. 实时统计插入操作的QPS、成功率、平均耗时
 * 2. 集成Micrometer指标导出（Prometheus格式）
 * 3. 提供健康检查端点
 * 4. 性能阈值告警
 */
@Slf4j
@Service
public class DataInsertMetricsService implements HealthIndicator {

    @Autowired(required = false)
    private MeterRegistry meterRegistry;

    private final Map<String, OperationMetrics> operationMetrics = new ConcurrentHashMap<>();

    private final AtomicLong totalOperations = new AtomicLong(0);
    private final AtomicLong totalSuccesses = new AtomicLong(0);
    private final AtomicLong totalFailures = new AtomicLong(0);
    private final AtomicLong totalDurationMs = new AtomicLong(0);

    private final Map<String, Object> config = new HashMap<>();
    private volatile boolean healthy = true;
    private String lastHealthCheckTime;
    private String healthIssueDetails;

    public DataInsertMetricsService() {
        initializeDefaultConfig();
    }

    /**
     * 记录一次操作
     *
     * @param module       模块名称 (user/product)
     * @param type         操作类型 (single/batch_sync/batch_async)
     * @param success      是否成功
     * @param durationMs   耗时（毫秒）
     * @param successCount 成功数量
     * @param failCount    失败数量
     */
    public void recordOperation(String module, String type, boolean success,
                                 long durationMs, int successCount, int failCount) {
        String key = module + "_" + type;

        OperationMetrics metrics = operationMetrics.computeIfAbsent(key, k -> new OperationMetrics());

        metrics.record(success, durationMs, successCount, failCount);

        totalOperations.incrementAndGet();
        totalDurationMs.addAndGet(durationMs);

        if (success) {
            totalSuccesses.incrementAndGet();
            if (meterRegistry != null) {
                Counter.builder("data_insert_operations_total")
                        .tag("module", module)
                        .tag("type", type)
                        .tag("status", "success")
                        .register(meterRegistry)
                        .increment();
            }
        } else {
            totalFailures.incrementAndGet();
            if (meterRegistry != null) {
                Counter.builder("data_insert_operations_total")
                        .tag("module", module)
                        .tag("type", type)
                        .tag("status", "failure")
                        .register(meterRegistry)
                        .increment();
            }
        }

        if (meterRegistry != null) {
            Timer.builder("data_insert_duration")
                    .tag("module", module)
                    .tag("type", type)
                    .publishPercentiles(0.5, 0.95, 0.99)
                    .register(meterRegistry)
                    .record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        }

        checkPerformanceThresholds(module, type, success, durationMs);
    }

    /**
     * 获取指定操作的详细指标
     */
    public OperationMetrics getOperationMetrics(String module, String type) {
        String key = module + "_" + type;
        return operationMetrics.getOrDefault(key, new OperationMetrics());
    }

    /**
     * 获取所有操作的综合统计
     */
    public Map<String, Object> getOverallStatistics() {
        long totalOps = totalOperations.get();
        long successes = totalSuccesses.get();
        long failures = totalFailures.get();
        long duration = totalDurationMs.get();

        double successRate = totalOps > 0 ? (double) successes / totalOps : 0;
        double avgDuration = totalOps > 0 ? (double) duration / totalOps : 0;
        double qps = calculateRecentQPS();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("timestamp", LocalDateTime.now().toString());
        stats.put("totalOperations", totalOps);
        stats.put("totalSuccesses", successes);
        stats.put("totalFailures", failures);
        stats.put("successRate", Math.round(successRate * 10000) / 100.0 + "%");
        stats.put("averageDurationMs", Math.round(avgDuration * 100) / 100.0);
        stats.put("recentQPS", Math.round(qps * 100) / 100.0);
        stats.put("healthy", healthy);

        Map<String, Object> breakdown = new LinkedHashMap<>();
        for (Map.Entry<String, OperationMetrics> entry : operationMetrics.entrySet()) {
            breakdown.put(entry.getKey(), entry.getValue().toMap());
        }
        stats.put("operationBreakdown", breakdown);

        return stats;
    }

    /**
     * 获取最近N分钟的QPS
     */
    private double calculateRecentQPS() {
        int windowMinutes = 5;
        long windowStart = System.currentTimeMillis() - (windowMinutes * 60 * 1000L);

        long recentCount = 0;
        for (OperationMetrics metrics : operationMetrics.values()) {
            recentCount += metrics.getCountInWindow(windowStart);
        }

        double qps = (double) recentCount / (windowMinutes * 60);
        return qps;
    }

    /**
     * 检查性能是否超过阈值
     */
    private void checkPerformanceThresholds(String module, String type,
                                             boolean success, long durationMs) {
        Long warningThreshold = (Long) config.get("warningThresholdMs");
        Long criticalThreshold = (Long) config.get("criticalThresholdMs");

        if (criticalThreshold != null && durationMs > criticalThreshold) {
            log.warn("⚠️ 性能告警: {}_{} 耗时{}ms 超过临界值{}ms",
                    module, type, durationMs, criticalThreshold);
            setHealthy(false, String.format("%s_%s 操作耗时 %dms 超过临界阈值 %dms",
                    module, type, durationMs, criticalThreshold));
        } else if (warningThreshold != null && durationMs > warningThreshold) {
            log.info("ℹ️ 性能提示: {}_{} 耗时{}ms 超过警告值{}ms",
                    module, type, durationMs, warningThreshold);
        }

        if (!success) {
            Double failureRateThreshold = (Double) config.get("failureRateThreshold");
            if (failureRateThreshold != null) {
                double currentFailureRate = getRecentFailureRate();
                if (currentFailureRate > failureRateThreshold) {
                    log.error("❌ 失败率过高: 当前{:.2%}, 阈值{:.2%}",
                            currentFailureRate, failureRateThreshold);
                    setHealthy(false, String.format("失败率 %.2f%% 超过阈值 %.2f%%",
                            currentFailureRate * 100, failureRateThreshold * 100));
                }
            }
        }
    }

    private double getRecentFailureRate() {
        long recentTotal = totalOperations.get();
        long recentFailures = totalFailures.get();
        return recentTotal > 0 ? (double) recentFailures / recentTotal : 0;
    }

    @Override
    public Health health() {
        lastHealthCheckTime = LocalDateTime.now().toString();

        if (!healthy) {
            return Health.down()
                    .withDetail("issue", healthIssueDetails)
                    .withDetail("checkTime", lastHealthCheckTime)
                    .withDetail("totalOperations", totalOperations.get())
                    .build();
        }

        Health.Builder builder = Health.up();

        builder.withDetail("totalOperations", totalOperations.get());
        builder.withDetail("successRate", getRecentFailureRate() < 0.95 ? "GOOD" : "WARNING");
        builder.withDetail("avgDurationMs",
                totalOperations.get() > 0 ? totalDurationMs.get() / totalOperations.get() : 0);
        builder.withDetail("lastCheckTime", lastHealthCheckTime);
        builder.withDetail("activeOperations", operationMetrics.size());

        return builder.build();
    }

    public void setHealthy(boolean healthy, String reason) {
        this.healthy = healthy;
        this.healthIssueDetails = reason;
        log.info("健康状态变更: {}, 原因: {}", healthy ? "✅ 健康" : "❌ 异常", reason);
    }

    public void resetMetrics() {
        totalOperations.set(0);
        totalSuccesses.set(0);
        totalFailures.set(0);
        totalDurationMs.set(0);
        operationMetrics.clear();
        healthy = true;
        healthIssueDetails = null;
        log.info("📊 所有指标已重置");
    }

    public Map<String, Object> getConfig() {
        return new HashMap<>(config);
    }

    public void updateConfig(String key, Object value) {
        config.put(key, value);
        log.info("配置更新: {} = {}", key, value);
    }

    private void initializeDefaultConfig() {
        config.put("warningThresholdMs", 2000L);
        config.put("criticalThresholdMs", 5000L);
        config.put("failureRateThreshold", 0.1);
        config.put("maxBatchSize", 500);
        config.put("enableAsync", true);
    }

    @lombok.Data
    public static class OperationMetrics {
        private final AtomicLong totalCount = new AtomicLong(0);
        private final AtomicLong successCount = new AtomicLong(0);
        private final AtomicLong failureCount = new AtomicLong(0);
        private final AtomicLong totalDuration = new AtomicLong(0);
        private final AtomicLong minDuration = new AtomicLong(Long.MAX_VALUE);
        private final AtomicLong maxDuration = new AtomicLong(0);
        private final List<Long> recentTimestamps = Collections.synchronizedList(new ArrayList<>());

        public void record(boolean success, long durationMs, int successCount, int failCount) {
            totalCount.incrementAndGet();
            totalDuration.addAndGet(durationMs);

            if (minDuration.get() > durationMs) {
                minDuration.set(durationMs);
            }
            if (maxDuration.get() < durationMs) {
                maxDuration.set(durationMs);
            }

            if (success) {
                successCount.incrementAndGet();
            } else {
                failureCount.incrementAndGet();
            }

            recentTimestamps.add(System.currentTimeMillis());
            cleanupOldTimestamps();
        }

        public long getCountInWindow(long sinceTimestamp) {
            synchronized (recentTimestamps) {
                return recentTimestamps.stream()
                        .filter(ts -> ts >= sinceTimestamp)
                        .count();
            }
        }

        private void cleanupOldTimestamps() {
            long fiveMinutesAgo = System.currentTimeMillis() - 5 * 60 * 1000L;
            synchronized (recentTimestamps) {
                recentTimestamps.removeIf(ts -> ts < fiveMinutesAgo);
            }
        }

        public Map<String, Object> toMap() {
            long total = totalCount.get();
            long duration = totalDuration.get();

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("totalCount", total);
            map.put("successCount", successCount.get());
            map.put("failureCount", failureCount.get());
            map.put("successRate", total > 0 ? Math.round((double) successCount.get() / total * 10000) / 100.0 : 0);
            map.put("avgDurationMs", total > 0 ? Math.round((double) duration / total * 100) / 100.0 : 0);
            map.put("minDurationMs", minDuration.get() == Long.MAX_VALUE ? 0 : minDuration.get());
            map.put("maxDurationMs", maxDuration.get());
            return map;
        }
    }
}
