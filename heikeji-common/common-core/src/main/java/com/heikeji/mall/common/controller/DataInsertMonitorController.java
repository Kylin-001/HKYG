package com.heikeji.mall.common.controller;

import com.heikeji.common.core.annotation.RequiresAdmin;
import com.heikeji.common.core.domain.R;
import com.heikeji.mall.common.service.DataInsertAuditService;
import com.heikeji.mall.common.service.DataInsertMetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 数据插入监控和管理控制器
 *
 * 提供以下功能：
 * 1. 操作统计查询
 * 2. 审计日志查看
 * 3. 系统健康检查
 * 4. 配置管理
 * 5. 指标重置
 */
@RestController
@RequestMapping("/api/admin/monitor/data-insert")
@Tag(name = "数据插入监控接口")
public class DataInsertMonitorController {

    private static final Logger log = LoggerFactory.getLogger(DataInsertMonitorController.class);

    @Autowired
    private DataInsertMetricsService metricsService;

    @Autowired
    private DataInsertAuditService auditService;

    @GetMapping("/statistics")
    @RequiresAdmin
    @Operation(summary = "获取插入操作综合统计")
    public R<Map<String, Object>> getStatistics() {
        log.info("获取数据插入统计信息");
        Map<String, Object> stats = metricsService.getOverallStatistics();
        return R.success(stats);
    }

    @GetMapping("/statistics/{module}/{type}")
    @RequiresAdmin
    @Operation(summary = "获取指定模块的操作指标")
    public R<Object> getModuleStatistics(
            @PathVariable String module,
            @PathVariable String type) {
        var metrics = metricsService.getOperationMetrics(module, type);
        return R.success(metrics.toMap());
    }

    @GetMapping("/audit-logs")
    @RequiresAdmin
    @Operation(summary = "查询审计日志")
    public R<List<DataInsertAuditService.AuditLogEntry>> getAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "50") int limit) {
        log.info("查询审计日志, action={}, status={}, limit={}", action, status, limit);
        List<DataInsertAuditService.AuditLogEntry> logs = auditService.query(action, status, limit);
        return R.success(logs);
    }

    @GetMapping("/audit/statistics")
    @RequiresAdmin
    @Operation(summary = "获取审计统计")
    public R<DataInsertAuditService.AuditStatistics> getAuditStatistics() {
        log.info("获取审计统计信息");
        DataInsertAuditService.AuditStatistics stats = auditService.getStatistics();
        return R.success(stats);
    }

    @GetMapping("/health")
    @RequiresAdmin
    @Operation(summary = "健康检查")
    public R<Map<String, Object>> healthCheck() {
        log.info("执行健康检查");
        var health = metricsService.health();
        Map<String, Object> result = Map.of(
                "status", health.getStatus().getCode(),
                "details", health.getDetails()
        );
        return R.success(result);
    }

    @GetMapping("/config")
    @RequiresAdmin
    @Operation(summary = "获取当前配置")
    public R<Map<String, Object>> getConfig() {
        return R.success(metricsService.getConfig());
    }

    @PutMapping("/config/{key}")
    @RequiresAdmin
    @Operation(summary = "更新配置项")
    public R<String> updateConfig(
            @PathVariable String key,
            @RequestParam Object value) {
        log.info("更新配置: {} = {}", key, value);
        metricsService.updateConfig(key, value);
        return R.success("配置已更新");
    }

    @PostMapping("/reset-metrics")
    @RequiresAdmin
    @Operation(summary = "重置所有指标")
    public R<String> resetMetrics() {
        log.warn("重置所有监控指标");
        metricsService.resetMetrics();
        return R.success("指标已重置");
    }

    @PostMapping("/cleanup-audit")
    @RequiresAdmin
    @Operation(summary = "清理过期审计日志")
    public R<String> cleanupAuditLogs() {
        log.info("清理过期审计日志");
        auditService.cleanupOldEntries();
        return R.success("清理完成");
    }

    @GetMapping("/qps")
    @Operation(summary = "获取实时QPS")
    public R<Map<String, Object>> getRealtimeQPS() {
        Map<String, Object> stats = metricsService.getOverallStatistics();
        double qps = (double) stats.get("recentQPS");
        return R.success(Map.of(
                "currentQPS", qps,
                "timestamp", java.time.LocalDateTime.now().toString(),
                "status", qps > 100 ? "HIGH_LOAD" : qps > 50 ? "MODERATE" : "NORMAL"
        ));
    }
}
