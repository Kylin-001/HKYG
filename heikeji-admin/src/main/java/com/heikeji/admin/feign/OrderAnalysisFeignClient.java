package com.heikeji.admin.feign;

import com.heikeji.admin.common.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 订单数据分析Feign客户端
 * 用于后台管理系统调用订单服务的数据分析接口
 */
@FeignClient(name = "heikeji-order")
public interface OrderAnalysisFeignClient {
    
    /**
     * 获取订单概览数据
     */
    @GetMapping("/api/analysis/order/overview")
    R getOrderOverview(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单趋势数据
     */
    @GetMapping("/api/analysis/order/trend")
    R getOrderTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval);
    
    /**
     * 获取订单状态分布
     */
    @GetMapping("/api/analysis/order/status-distribution")
    R getOrderStatusDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单金额分布
     */
    @GetMapping("/api/analysis/order/amount-distribution")
    R getOrderAmountDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单来源分布
     */
    @GetMapping("/api/analysis/order/source-distribution")
    R getOrderSourceDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单时间分布
     */
    @GetMapping("/api/analysis/order/time-distribution")
    R getOrderTimeDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单取消原因分析
     */
    @GetMapping("/api/analysis/order/cancel-reason")
    R getOrderCancelReasonAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单转化率分析
     */
    @GetMapping("/api/analysis/order/conversion")
    R getOrderConversionAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单平均处理时间分析
     */
    @GetMapping("/api/analysis/order/processing-time")
    R getOrderProcessingTimeAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取订单地域分布
     */
    @GetMapping("/api/analysis/order/region-distribution")
    R getOrderRegionDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
}