package com.heikeji.mall.common.monitoring.controller;

import com.heikeji.mall.common.monitoring.service.SystemMonitoringService;
import com.heikeji.mall.common.core.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/monitoring")
@Api(tags = "系统监控")
public class SystemMonitoringController {

    @Autowired
    private SystemMonitoringService monitoringService;

    @GetMapping("/performance/current")
    @ApiOperation("获取当前性能指标")
    public Result<Map<String, Object>> getCurrentPerformanceMetrics() {
        try {
            Map<String, Object> metrics = monitoringService.getCurrentMetrics()
            log.info("获取当前性能指标: {}", metrics)
            return Result.success(metrics)
        } catch (Exception e) {
            log.error("获取性能指标失败", e)
            return Result.error("获取性能指标失败")
        }
    }

    @GetMapping("/performance/history")
    @ApiOperation("获取性能历史")
    public Result<Map<String, Object>> getPerformanceHistory(
            @ApiParam("type", defaultValue = "performance") String type,
            @ApiParam("hours", defaultValue = "24") int hours
    ) {
        try {
            var history = monitoringService.getHistoricalMetrics(type, hours)
            log.info("获取性能历史: type={}, hours={}", type, hours)
            return Result.success(history)
        } catch (Exception e) {
            log.error("获取性能历史失败", e)
            return Result.error("获取性能历史失败")
        }
    }

    @GetMapping("/errors/current")
    @ApiOperation("获取当前错误指标")
    public Result<Map<String, Object>> getCurrentErrorMetrics() {
        try {
            Map<String, Object> metrics = monitoringService.getCurrentMetrics()
            Map<String, Object> errorMetrics = (Map<String, Object>) metrics.get("errors")
            log.info("获取当前错误指标: {}", errorMetrics)
            return Result.success(errorMetrics)
        } catch (Exception e) {
            log.error("获取错误指标失败", e)
            return Result.error("获取错误指标失败")
        }
    }

    @GetMapping("/errors/history")
    @ApiOperation("获取错误历史")
    public Result<Map<String, Object>> getErrorHistory(
            @ApiParam("type", defaultValue = "error") String type,
            @ApiParam("hours", defaultValue = "24") int hours
    ) {
        try {
            var history = monitoringService.getHistoricalMetrics(type, hours)
            log.info("获取错误历史: type={}, hours={}", type, hours)
            return Result.success(history)
        } catch (Exception e) {
            log.error("获取错误历史失败", e)
            return Result.error("获取错误历史失败")
        }
    }

    @GetMapping("/alerts/current")
    @ApiOperation("获取当前告警")
    public Result<Map<String, Object>> getCurrentAlerts() {
        try {
            Map<String, Object> metrics = monitoringService.getCurrentMetrics()
            Map<String, Object> alerts = (Map<String, Object>) metrics.get("alerts")
            log.info("获取当前告警: {}", alerts)
            return Result.success(alerts)
        } catch (Exception e) {
            log.error("获取当前告警失败", e)
            return Result.error("获取当前告警失败")
        }
    }

    @GetMapping("/alerts/history")
    @ApiOperation("获取告警历史")
    public Result<Map<String, Object>> getAlertHistory(
            @ApiParam("hours", defaultValue = "24") int hours
    ) {
        try {
            var history = monitoringService.getHistoricalMetrics("alert", hours)
            log.info("获取告警历史: hours={}", hours)
            return Result.success(history)
        } catch (Exception e) {
            log.error("获取告警历史失败", e)
            return Result.error("获取告警历史失败")
        }
    }

    @PostMapping("/metrics/reset")
    @ApiOperation("重置监控指标")
    public Result<Void> resetMetrics() {
        try {
            monitoringService.resetMetrics()
            log.info("重置监控指标")
            return Result.success()
        } catch (Exception e) {
            log.error("重置监控指标失败", e)
            return Result.error("重置监控指标失败")
        }
    }

    @PostMapping("/alerts/clear")
    @ApiOperation("清除告警")
    public Result<Void> clearAlerts() {
        try {
            monitoringService.clearOldMetrics(7)
            log.info("清除7天前的告警")
            return Result.success()
        } catch (Exception e) {
            log.error("清除告警失败", e)
            return Result.error("清除告警失败")
        }
    }
}
