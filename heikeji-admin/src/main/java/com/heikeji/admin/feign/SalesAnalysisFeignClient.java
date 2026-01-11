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
 * 销售数据分析Feign客户端
 * 用于后台管理系统调用销售分析服务的接口
 */
@FeignClient(name = "heikeji-order")
public interface SalesAnalysisFeignClient {
    
    /**
     * 获取销售概览数据
     */
    @GetMapping("/api/analysis/sales/overview")
    R getSalesOverview(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取销售趋势数据
     */
    @GetMapping("/api/analysis/sales/trend")
    R getSalesTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval);
    
    /**
     * 获取商品销售排名
     */
    @GetMapping("/api/analysis/sales/product-ranking")
    R getProductSalesRanking(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "10") int limit);
    
    /**
     * 获取分类销售分布
     */
    @GetMapping("/api/analysis/sales/category-distribution")
    R getCategorySalesDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取商家销售排名
     */
    @GetMapping("/api/analysis/sales/merchant-ranking")
    R getMerchantSalesRanking(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "10") int limit);
    
    /**
     * 获取支付方式分布
     */
    @GetMapping("/api/analysis/sales/payment-distribution")
    R getPaymentMethodDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
}