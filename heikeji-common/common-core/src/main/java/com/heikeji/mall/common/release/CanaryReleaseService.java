package com.heikeji.mall.common.release;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 灰度发布（金丝雀发布）服务
 *
 * 支持多种流量切换策略：
 * 1. 按比例分流: V1占80%, V2占20%
 * 2. 白名单用户: 指定用户使用新版本
 * 3. 按权重路由: 基于用户ID哈希
 * 4. A/B测试: 对照组实验
 *
 * 使用场景：
 * - 新功能上线验证
 * - 性能对比测试
 * - 平滑版本迁移
 * - 快速回滚能力
 */
@Slf4j
@Service
public class CanaryReleaseService {

    @Autowired(required = false)
    private ReleaseConfigRepository configRepository;

    private final Map<String, ReleaseRule> activeRules = new ConcurrentHashMap<>();
    private final Map<String, ReleaseMetrics> metricsMap = new ConcurrentHashMap<>();
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicInteger v1Count = new AtomicInteger(0);
    private final AtomicInteger v2Count = new AtomicInteger(0);

    /**
     * 判断请求应该使用哪个版本
     *
     * @param feature 功能名称 (如: user-insert, product-batch)
     * @param userId  用户ID（可为null）
     * @return 版本标识 ("V1" 或 "V2")
     */
    public String resolveVersion(String feature, String userId) {
        totalRequests.incrementAndGet();

        ReleaseRule rule = getActiveRule(feature);
        if (rule == null || !rule.isEnabled()) {
            v1Count.incrementAndGet();
            return "V1"; // 默认使用旧版本
        }

        String version = doResolve(rule, userId);
        recordMetrics(feature, version);

        log.debug("版本路由: feature={}, userId={}, version={}, strategy={}",
                feature, maskUserId(userId), version, rule.getStrategy());

        return version;
    }

    /**
     * 核心路由逻辑
     */
    private String doResolve(ReleaseRule rule, String userId) {
        switch (rule.getStrategy()) {
            case PERCENTAGE:
                return resolveByPercentage(rule.getV2Percentage());

            case WHITELIST:
                return resolveByWhitelist(userId, rule.getWhitelistUsers());

            case WEIGHT_HASH:
                return resolveByWeightHash(userId, rule.getV2Percentage());

            case AB_TEST:
                return resolveByABTest(userId, rule.getAbTestGroups());

            default:
                return "V1";
        }
    }

    /**
     * 按比例随机分流
     */
    private String resolveByPercentage(int v2Percentage) {
        if (v2Percentage <= 0) return "V1";
        if (v2Percentage >= 100) return "V2";

        int random = ThreadLocalRandom.current().nextInt(100);
        if (random < v2Percentage) {
            v2Count.incrementAndGet();
            return "V2";
        } else {
            v1Count.incrementAndGet();
            return "V1";
        }
    }

    /**
     * 白名单用户使用新版本
     */
    private String resolveByWhitelist(String userId, Set<String> whitelist) {
        if (userId == null || whitelist == null || whitelist.isEmpty()) {
            v1Count.incrementAndGet();
            return "V1";
        }

        if (whitelist.contains(userId)) {
            v2Count.incrementAndGet();
            return "V2";
        } else {
            v1Count.incrementAndGet();
            return "V1";
        }
    }

    /**
     * 基于用户ID哈希的一致性路由
     * 同一用户总是路由到同一版本
     */
    private String resolveByWeightHash(String userId, int v2Percentage) {
        if (userId == null) {
            return resolveByPercentage(v2Percentage);
        }

        int hash = Math.abs(userId.hashCode() % 100);
        if (hash < v2Percentage) {
            v2Count.incrementAndGet();
            return "V2";
        } else {
            v1Count.incrementAndGet();
            return "V1";
        }
    }

    /**
     * A/B测试分组
     */
    private String resolveByABTest(String userId, Map<String, Integer> groups) {
        if (userId == null || groups == null || groups.isEmpty()) {
            v1Count.incrementAndGet();
            return "V1";
        }

        int hash = Math.abs(userId.hashCode() % 100);
        int cumulative = 0;

        for (Map.Entry<String, Integer> entry : groups.entrySet()) {
            cumulative += entry.getValue();
            if (hash < cumulative) {
                if ("B".equals(entry.getKey())) {
                    v2Count.incrementAndGet();
                    return "V2";
                } else {
                    v1Count.incrementAndGet();
                    return "V1";
                }
            }
        }

        v1Count.incrementAndGet();
        return "V1";
    }

    /**
     * 创建/更新发布规则
     */
    public void updateReleaseRule(String feature, ReleaseRule rule) {
        rule.setLastUpdated(LocalDateTime.now());
        activeRules.put(feature, rule);

        log.info("📢 发布规则已更新: feature={}, strategy={}, v2比例={}%",
                feature, rule.getStrategy(), rule.getV2Percentage());

        if (configRepository != null) {
            configRepository.saveRule(feature, rule);
        }
    }

    /**
     * 启用/禁用功能
     */
    public void setFeatureEnabled(String feature, boolean enabled) {
        ReleaseRule rule = getActiveRule(feature);
        if (rule != null) {
            rule.setEnabled(enabled);
            log.info("功能{}: {}", enabled ? "✅ 已启用" : "❌ 已禁用", feature);
        }
    }

    /**
     * 获取当前活跃规则
     */
    public ReleaseRule getActiveRule(String feature) {
        return activeRules.get(feature);
    }

    /**
     * 获取所有活跃规则
     */
    public Map<String, ReleaseRule> getAllActiveRules() {
        return new HashMap<>(activeRules);
    }

    /**
     * 删除规则（回滚到V1）
     */
    public void removeReleaseRule(String feature) {
        activeRules.remove(feature);
        log.info("🔄 规则已移除, feature={} 回退到V1", feature);
    }

    /**
     * 获取发布统计指标
     */
    public ReleaseStatistics getStatistics() {
        long total = totalRequests.get();
        long v1 = v1Count.get();
        long v2 = v2Count.get();

        Map<String, Object> breakdown = new LinkedHashMap<>();
        for (Map.Entry<String, ReleaseMetrics> entry : metricsMap.entrySet()) {
            breakdown.put(entry.getKey(), entry.getValue().toMap());
        }

        return ReleaseStatistics.builder()
                .totalRequests(total)
                .v1Requests(v1)
                .v2Requests(v2)
                .v2Percentage(total > 0 ? Math.round((double) v2 / total * 10000) / 100.0 : 0)
                .activeFeatures(activeRules.size())
                .featureBreakdown(breakdown)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * 重置统计数据
     */
    public void resetMetrics() {
        totalRequests.set(0);
        v1Count.set(0);
        v2Count.set(0);
        metricsMap.clear();
        log.info("📊 发布统计已重置");
    }

    /**
     * 渐进式增加V2流量
     * 例如: 5% → 10% → 25% → 50% → 100%
     */
    public void gradualRollout(String feature, int[] percentages, long intervalMinutes) {
        Timer timer = new Timer("GradualRollout-" + feature);

        for (int i = 0; i < percentages.length; i++) {
            final int percentage = percentages[i];
            final int step = i;

            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    ReleaseRule rule = getActiveRule(feature);
                    if (rule != null) {
                        rule.setV2Percentage(percentage);
                        rule.setStrategy(ReleaseStrategy.PERCENTAGE);
                        updateReleaseRule(feature, rule);
                        log.info("📈 渐进式发布: feature={}, 步骤{}/{}, V2流量={}%",
                                feature, step + 1, percentages.length, percentage);
                    }
                }
            }, intervalMinutes * 60_000L * (i + 1));
        }

        log.info("🚀 渐进式发布计划已启动: feature={}, 步数={}, 间隔={}分钟",
                feature, percentages.length, intervalMinutes);
    }

    private void recordMetrics(String feature, String version) {
        ReleaseMetrics metrics = metricsMap.computeIfAbsent(
                feature, k -> new ReleaseMetrics()
        );

        if ("V2".equals(version)) {
            metrics.incrementV2();
        } else {
            metrics.incrementV1();
        }
    }

    private String maskUserId(String userId) {
        if (userId == null) return "anonymous";
        if (userId.length() <= 4) return "***";
        return userId.substring(0, 2) + "***" + userId.substring(userId.length() - 2);
    }

    // ==================== 数据模型 ====================

    public enum ReleaseStrategy {
        PERCENTAGE,      // 按比例随机
        WHITELIST,       // 白名单
        WEIGHT_HASH,     // 一致性哈希
        AB_TEST          // A/B测试分组
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ReleaseRule {
        private String feature;
        private boolean enabled = true;
        private ReleaseStrategy strategy = ReleaseStrategy.PERCENTAGE;
        private int v2Percentage = 0;
        private Set<String> whitelistUsers;
        private Map<String, Integer> abTestGroups;
        private String description;
        private LocalDateTime createdTime;
        private LocalDateTime lastUpdated;
        private String createdBy;
        private int maxDurationHours;
        private LocalDateTime expireTime;
        private RollbackPolicy rollbackPolicy = RollbackPolicy.AUTO;

        public enum RollbackPolicy {
            AUTO,       // 自动回滚（错误率超阈值）
            MANUAL,     // 手动回滚
            SCHEDULED   // 定时回滚
        }
    }

    @lombok.Data
    public static class ReleaseMetrics {
        private final AtomicLong v1Count = new AtomicLong(0);
        private final AtomicLong v2Count = new AtomicLong(0);

        public void incrementV1() { v1Count.incrementAndGet(); }
        public void incrementV2() { v2Count.incrementAndGet(); }

        public Map<String, Object> toMap() {
            long total = v1Count.get() + v2Count.get();
            return Map.of(
                    "v1", v1Count.get(),
                    "v2", v2Count.get(),
                    "total", total,
                    "v2Rate", total > 0 ? Math.round((double) v2Count.get() / total * 10000) / 100.0 : 0
            );
        }
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ReleaseStatistics {
        private long totalRequests;
        private long v1Requests;
        private long v2Requests;
        private double v2Percentage;
        private int activeFeatures;
        private Map<String, Object> featureBreakdown;
        private LocalDateTime timestamp;
    }

    public interface ReleaseConfigRepository {
        void saveRule(String feature, ReleaseRule rule);
        ReleaseRule loadRule(String feature);
        List<ReleaseRule> loadAllRules();
    }
}
