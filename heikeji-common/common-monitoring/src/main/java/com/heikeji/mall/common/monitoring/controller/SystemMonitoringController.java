package com.heikeji.mall.common.monitoring.controller;

import com.heikeji.mall.common.monitoring.SystemMonitoringService;
import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/monitoring")
@io.swagger.v3.oas.annotations.tags.Tag(name = "系统监控", description = "系统性能、错误和告警监控接口")
public class SystemMonitoringController {

    @Autowired
    private SystemMonitoringService monitoringService;

    @GetMapping("/performance/current")
    @Operation(summary = "获取当前性能指标", description = "获取系统当前性能指标")
    public R<Map<String, Object>> getCurrentPerformanceMetrics() {
        try {
            Map<String, Object> metrics = monitoringService.getCurrentMetrics();
            log.info("获取当前性能指标: {}", metrics);
            return R.success(metrics);
        } catch (Exception e) {
            log.error("获取性能指标失败", e);
            return R.error("获取性能指标失败");
        }
    }

    @GetMapping("/performance/history")
    @Operation(summary = "获取性能历史", description = "获取系统性能历史数据")
    public R<List<Map<String, Object>>> getPerformanceHistory(
            @Parameter(description = "指标类型", example = "performance") String type,
            @Parameter(description = "查询小时数", example = "24") int hours
    ) {
        try {
            List<Map<String, Object>> history = monitoringService.getHistoricalMetrics(type, hours);
            log.info("获取性能历史: type={}, hours={}", type, hours);
            return R.success(history);
        } catch (Exception e) {
            log.error("获取性能历史失败", e);
            return R.error("获取性能历史失败");
        }
    }

    @GetMapping("/errors/current")
    @Operation(summary = "获取当前错误指标", description = "获取系统当前错误指标")
    public R<Map<String, Object>> getCurrentErrorMetrics() {
        try {
            Map<String, Object> metrics = monitoringService.getCurrentMetrics();
            Map<String, Object> errorMetrics = (Map<String, Object>) metrics.get("errors");
            log.info("获取当前错误指标: {}", errorMetrics);
            return R.success(errorMetrics);
        } catch (Exception e) {
            log.error("获取错误指标失败", e);
            return R.error("获取错误指标失败");
        }
    }

    @GetMapping("/errors/history")
    @Operation(summary = "获取错误历史", description = "获取系统错误历史数据")
    public R<List<Map<String, Object>>> getErrorHistory(
            @Parameter(description = "指标类型", example = "error") String type,
            @Parameter(description = "查询小时数", example = "24") int hours
    ) {
        try {
            List<Map<String, Object>> history = monitoringService.getHistoricalMetrics(type, hours);
            log.info("获取错误历史: type={}, hours={}", type, hours);
            return R.success(history);
        } catch (Exception e) {
            log.error("获取错误历史失败", e);
            return R.error("获取错误历史失败");
        }
    }

    @GetMapping("/alerts/current")
    @Operation(summary = "获取当前告警", description = "获取系统当前告警信息")
    public R<Map<String, Object>> getCurrentAlerts() {
        try {
            Map<String, Object> metrics = monitoringService.getCurrentMetrics();
            Map<String, Object> alerts = (Map<String, Object>) metrics.get("alerts");
            log.info("获取当前告警: {}", alerts);
            return R.success(alerts);
        } catch (Exception e) {
            log.error("获取当前告警失败", e);
            return R.error("获取当前告警失败");
        }
    }

    @GetMapping("/alerts/history")
    @Operation(summary = "获取告警历史", description = "获取系统告警历史数据")
    public R<List<Map<String, Object>>> getAlertHistory(
            @Parameter(description = "查询小时数", example = "24") int hours
    ) {
        try {
            List<Map<String, Object>> history = monitoringService.getHistoricalMetrics("alert", hours);
            log.info("获取告警历史: hours={}", hours);
            return R.success(history);
        } catch (Exception e) {
            log.error("获取告警历史失败", e);
            return R.error("获取告警历史失败");
        }
    }

    @PostMapping("/metrics/reset")
    @Operation(summary = "重置监控指标", description = "重置所有监控指标数据")
    public R<Void> resetMetrics() {
        try {
            monitoringService.resetMetrics();
            log.info("重置监控指标");
            return R.success();
        } catch (Exception e) {
            log.error("重置监控指标失败", e);
            return R.error("重置监控指标失败");
        }
    }

    @PostMapping("/alerts/clear")
    @Operation(summary = "清除告警", description = "清除指定天数的告警数据")
    public R<Void> clearAlerts() {
        try {
            monitoringService.clearOldMetrics(7);
            log.info("清除7天前的告警");
            return R.success();
        } catch (Exception e) {
            log.error("清除告警失败", e);
            return R.error("清除告警失败");
        }
    }
}
