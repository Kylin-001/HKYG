package com.heikeji.mall.order.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.order.service.OrderAnalysisService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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
 * 订单数据分析控制器
 */
@Api(tags = "订单数据分析")
@RestController
@RequestMapping("/api/analysis/order")
public class OrderAnalysisController {

    @Autowired
    private OrderAnalysisService orderAnalysisService;

    /**
     * 获取订单概览数据
     */
    @ApiOperation("获取订单概览数据")
    @GetMapping("/overview")
    public R<Map<String, Object>> getOrderOverview(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> overview = orderAnalysisService.getOrderOverview(startDate, endDate);
        return R.success(overview);
    }

    /**
     * 获取订单趋势数据
     */
    @ApiOperation("获取订单趋势数据")
    @GetMapping("/trend")
    public R<Map<String, Object>> getOrderTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval) {
        Map<String, Object> trend = orderAnalysisService.getOrderTrend(startDate, endDate, interval);
        return R.success(trend);
    }

    /**
     * 获取订单状态分布
     */
    @ApiOperation("获取订单状态分布")
    @GetMapping("/status-distribution")
    public R<Map<String, Object>> getOrderStatusDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = orderAnalysisService.getOrderStatusDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取订单金额分布
     */
    @ApiOperation("获取订单金额分布")
    @GetMapping("/amount-distribution")
    public R<Map<String, Object>> getOrderAmountDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = orderAnalysisService.getOrderAmountDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取订单来源分布
     */
    @ApiOperation("获取订单来源分布")
    @GetMapping("/source-distribution")
    public R<Map<String, Object>> getOrderSourceDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = orderAnalysisService.getOrderSourceDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取订单时间分布
     */
    @ApiOperation("获取订单时间分布")
    @GetMapping("/time-distribution")
    public R<Map<String, Object>> getOrderTimeDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = orderAnalysisService.getOrderTimeDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取订单取消原因分析
     */
    @ApiOperation("获取订单取消原因分析")
    @GetMapping("/cancel-reason")
    public R<List<Map<String, Object>>> getOrderCancelReasonAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        List<Map<String, Object>> analysis = orderAnalysisService.getOrderCancelReasonAnalysis(startDate, endDate);
        return R.success(analysis);
    }

    /**
     * 获取订单转化率分析
     */
    @ApiOperation("获取订单转化率分析")
    @GetMapping("/conversion")
    public R<Map<String, Object>> getOrderConversionAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> analysis = orderAnalysisService.getOrderConversionAnalysis(startDate, endDate);
        return R.success(analysis);
    }

    /**
     * 获取订单平均处理时间分析
     */
    @ApiOperation("获取订单平均处理时间分析")
    @GetMapping("/processing-time")
    public R<Map<String, Object>> getOrderProcessingTimeAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> analysis = orderAnalysisService.getOrderProcessingTimeAnalysis(startDate, endDate);
        return R.success(analysis);
    }

    /**
     * 获取订单地域分布
     */
    @ApiOperation("获取订单地域分布")
    @GetMapping("/region-distribution")
    public R<List<Map<String, Object>>> getOrderRegionDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        List<Map<String, Object>> distribution = orderAnalysisService.getOrderRegionDistribution(startDate, endDate);
        return R.success(distribution);
    }
}