package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.service.DeliveryAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 配送数据分析控制器
 */
@Tag(name = "配送数据分析")
@RestController
@RequestMapping("/api/analysis/delivery")
public class DeliveryAnalysisController {

    @Autowired
    private DeliveryAnalysisService deliveryAnalysisService;

    /**
     * 获取配送概览数据
     */
    @Operation(summary = "获取配送概览数据")
    @GetMapping("/overview")
    public R<Map<String, Object>> getDeliveryOverview(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> overview = deliveryAnalysisService.getDeliveryOverview(startDate, endDate);
        return R.success(overview);
    }

    /**
     * 获取配送趋势数据
     */
    @Operation(summary = "获取配送趋势数据")
    @GetMapping("/trend")
    public R<Map<String, Object>> getDeliveryTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval) {
        Map<String, Object> trend = deliveryAnalysisService.getDeliveryTrend(startDate, endDate, interval);
        return R.success(trend);
    }

    /**
     * 获取配送状态分布
     */
    @Operation(summary = "获取配送状态分布")
    @GetMapping("/status-distribution")
    public R<Map<String, Object>> getDeliveryStatusDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = deliveryAnalysisService.getDeliveryStatusDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取配送效率分析
     */
    @Operation(summary = "获取配送效率分析")
    @GetMapping("/efficiency")
    public R<Map<String, Object>> getDeliveryEfficiencyAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> efficiency = deliveryAnalysisService.getDeliveryEfficiencyAnalysis(startDate, endDate);
        return R.success(efficiency);
    }

    /**
     * 获取配送员绩效分析
     */
    @Operation(summary = "获取配送员绩效分析")
    @GetMapping("/performance")
    public R<List<Map<String, Object>>> getDeliverymanPerformance(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        List<Map<String, Object>> performance = deliveryAnalysisService.getDeliverymanPerformance(startDate, endDate);
        return R.success(performance);
    }

    /**
     * 获取配送地域分布
     */
    @Operation(summary = "获取配送地域分布")
    @GetMapping("/region-distribution")
    public R<List<Map<String, Object>>> getDeliveryRegionDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        List<Map<String, Object>> distribution = deliveryAnalysisService.getDeliveryRegionDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取配送类型分布
     */
    @Operation(summary = "获取配送类型分布")
    @GetMapping("/type-distribution")
    public R<Map<String, Object>> getDeliveryTypeDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = deliveryAnalysisService.getDeliveryTypeDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取配送时间分析
     */
    @Operation(summary = "获取配送时间分析")
    @GetMapping("/time-analysis")
    public R<Map<String, Object>> getDeliveryTimeAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> timeAnalysis = deliveryAnalysisService.getDeliveryTimeAnalysis(startDate, endDate);
        return R.success(timeAnalysis);
    }
}