package com.heikeji.mall.common.monitoring;

import com.heikeji.mall.common.monitoring.service.SentryErrorTrackingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Slf4j
@Service
public class SystemMonitoringService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired(required = false)
    private SentryErrorTrackingService sentryErrorTrackingService;

    private static final String MONITORING_PREFIX = "monitor:";
    private static final String PERFORMANCE_PREFIX = "performance:";
    private static final String ERROR_PREFIX = "error:";
    private static final String ALERT_PREFIX = "alert:";
    private static final long STATS_TTL = 300;
    private static final long ALERT_TTL = 600;

    private final Map<String, PerformanceMetric> performanceMetrics = new ConcurrentHashMap<>();
    private final Map<String, List<ErrorMetric>> errorMetrics = new ConcurrentHashMap<>();
    private final Map<String, AlertMetric> alertMetrics = new ConcurrentHashMap<>();

    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);
    private final AtomicLong totalSlowRequests = new AtomicLong(0);

    @Scheduled(fixedRate = 60000)
    public void collectPerformanceMetrics() {
        try {
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalRequests", totalRequests.getAndSet(0));
            metrics.put("totalErrors", totalErrors.getAndSet(0));
            metrics.put("totalSlowRequests", totalSlowRequests.getAndSet(0));
            metrics.put("errorRate", calculateErrorRate());
            metrics.put("slowRate", calculateSlowRate());
            metrics.put("timestamp", System.currentTimeMillis());

            redisTemplate.opsForValue().set(
                PERFORMANCE_PREFIX + "current",
                metrics,
                STATS_TTL,
                java.util.concurrent.TimeUnit.SECONDS
            );

            log.info("性能指标收集完成: {}", metrics);
        } catch (Exception e) {
            log.error("收集性能指标失败", e);
        }
    }

    @Scheduled(fixedRate = 300000)
    public void collectErrorMetrics() {
        try {
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalErrors", totalErrors.get());
            metrics.put("errorRate", calculateErrorRate());
            metrics.put("topErrors", getTopErrors(5));
            metrics.put("timestamp", System.currentTimeMillis());

            redisTemplate.opsForValue().set(
                ERROR_PREFIX + "current",
                metrics,
                STATS_TTL,
                java.util.concurrent.TimeUnit.SECONDS
            );

            log.info("错误指标收集完成: {}", metrics);
        } catch (Exception e) {
            log.error("收集错误指标失败", e);
        }
    }

    @Scheduled(fixedRate = 60000)
    public void checkAlerts() {
        try {
            List<AlertMetric> alerts = new ArrayList<>();

            double errorRate = calculateErrorRate();
            if (errorRate > 0.05) {
                alerts.add(createAlert("HIGH_ERROR_RATE", 
                    "错误率过高: " + String.format("%.2f%%", errorRate * 100),
                    "error"));
            }

            double slowRate = calculateSlowRate();
            if (slowRate > 0.1) {
                alerts.add(createAlert("HIGH_SLOW_RATE", 
                    "慢请求率过高: " + String.format("%.2f%%", slowRate * 100),
                    "warning"));
            }

            if (!alerts.isEmpty()) {
                redisTemplate.opsForValue().set(
                        ALERT_PREFIX + "current",
                        alerts,
                        ALERT_TTL,
                        java.util.concurrent.TimeUnit.SECONDS
                );
            } else {
                redisTemplate.delete(ALERT_PREFIX + "current");
            }

            log.info("告警检查完成: {}", alerts);
        } catch (Exception e) {
            log.error("告警检查失败", e);
        }
    }

    public void recordRequest(String endpoint, long duration, boolean success) {
        totalRequests.incrementAndGet();
        if (!success) {
            totalErrors.incrementAndGet();
        }
        if (duration > 3000) {
            totalSlowRequests.incrementAndGet();
        }

        PerformanceMetric metric = new PerformanceMetric();
        metric.setEndpoint(endpoint);
        metric.setDuration(duration);
        metric.setSuccess(success);
        metric.setTimestamp(System.currentTimeMillis());

        performanceMetrics.put(endpoint, metric);
    }

    public void recordError(String endpoint, String errorType, String errorMessage) {
        ErrorMetric metric = new ErrorMetric();
        metric.setErrorType(errorType);
        metric.setErrorMessage(errorMessage);
        metric.setTimestamp(System.currentTimeMillis());
        metric.setCount(1);

        errorMetrics.computeIfAbsent(errorType, k -> new ArrayList<ErrorMetric>()).add(metric);

        if (sentryErrorTrackingService != null) {
            Map<String, Object> context = new HashMap<>();
            context.put("endpoint", endpoint);
            context.put("errorType", errorType);
            context.put("errorMessage", errorMessage);
            context.put("timestamp", System.currentTimeMillis());
            
            sentryErrorTrackingService.addBreadcrumb("error", "Error recorded", 
                Map.of("endpoint", endpoint, "type", errorType));
            
            sentryErrorTrackingService.setTag("error.type", errorType);
            sentryErrorTrackingService.setTag("error.endpoint", endpoint);
        }
    }

    public Map<String, Object> getCurrentMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("performance", getPerformanceSummary());
        metrics.put("errors", getErrorSummary());
        metrics.put("alerts", getActiveAlerts());
        metrics.put("timestamp", System.currentTimeMillis());
        return metrics;
    }

    public List<Map<String, Object>> getHistoricalMetrics(String type, int hours) {
        String prefix = MONITORING_PREFIX + type + ":";
        Set<String> keys = redisTemplate.keys(prefix + "*");
        List<Map<String, Object>> history = new ArrayList<>();

        for (String key : keys) {
            String timestamp = key.substring(prefix.length());
            Object data = redisTemplate.opsForValue().get(key);
            if (data != null) {
                Map<String, Object> metric = new HashMap<>();
                metric.put("timestamp", timestamp);
                metric.putAll((Map) data);
                history.add(metric);
            }
        }

        history.sort((a, b) -> {
            Object timeA = a.get("timestamp");
            Object timeB = b.get("timestamp");
            String strA = String.valueOf(timeA);
            String strB = String.valueOf(timeB);
            return strA.compareTo(strB);
        });

        return history.stream()
                .limit(hours)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopErrors(int limit) {
        return errorMetrics.entrySet().stream()
            .map(entry -> {
                Map<String, Object> errorInfo = new HashMap<>();
                errorInfo.put("errorType", entry.getKey());
                errorInfo.put("count", entry.getValue().size());
                errorInfo.put("lastError", entry.getValue().get(0));
                return errorInfo;
            })
            .sorted((a, b) -> {
                Integer countA = (Integer) a.get("count");
                Integer countB = (Integer) b.get("count");
                return countB.compareTo(countA);
            })
            .limit(limit)
            .collect(Collectors.toList());
    }

    private double calculateErrorRate() {
        long total = totalRequests.get();
        long errors = totalErrors.get();
        return total > 0 ? (double) errors / total : 0;
    }

    private double calculateSlowRate() {
        long total = totalRequests.get();
        long slow = totalSlowRequests.get();
        return total > 0 ? (double) slow / total : 0;
    }

    private AlertMetric createAlert(String type, String message, String level) {
        AlertMetric alert = new AlertMetric();
        alert.setType(type);
        alert.setMessage(message);
        alert.setLevel(level);
        alert.setTimestamp(System.currentTimeMillis());
        alert.setResolved(false);
        return alert;
    }

    private Map<String, Object> getPerformanceSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRequests", totalRequests.get());
        summary.put("totalErrors", totalErrors.get());
        summary.put("totalSlowRequests", totalSlowRequests.get());
        summary.put("errorRate", calculateErrorRate());
        summary.put("slowRate", calculateSlowRate());
        summary.put("timestamp", System.currentTimeMillis());
        return summary;
    }

    private Map<String, Object> getErrorSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalErrors", totalErrors.get());
        summary.put("errorRate", calculateErrorRate());
        summary.put("topErrors", getTopErrors(5));
        summary.put("timestamp", System.currentTimeMillis());
        return summary;
    }

    private List<Map<String, Object>> getActiveAlerts() {
        String key = ALERT_PREFIX + "current";
        Object data = redisTemplate.opsForValue().get(key);
        if (data != null) {
            return (List<Map<String, Object>>) data;
        }
        return new ArrayList<>();
    }

    public void clearOldMetrics(int days) {
        long cutoffTime = System.currentTimeMillis() - (days * 24 * 60 * 60 * 1000);
        
        performanceMetrics.entrySet().removeIf(entry -> {
            PerformanceMetric metric = entry.getValue();
            return metric.getTimestamp() < cutoffTime;
        });

        errorMetrics.entrySet().removeIf(entry -> {
            List<ErrorMetric> errors = entry.getValue();
            errors.removeIf(error -> error.getTimestamp() < cutoffTime);
            return errors.isEmpty();
        });

        log.info("清理{}天前的监控数据", days);
    }

    public void resetMetrics() {
        totalRequests.set(0);
        totalErrors.set(0);
        totalSlowRequests.set(0);
        performanceMetrics.clear();
        errorMetrics.clear();
        redisTemplate.delete(MONITORING_PREFIX + "*");
        redisTemplate.delete(ERROR_PREFIX + "*");
        redisTemplate.delete(ALERT_PREFIX + "*");
        log.info("监控指标已重置");
    }
}
