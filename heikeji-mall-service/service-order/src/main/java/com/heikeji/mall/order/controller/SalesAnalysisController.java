package com.heikeji.mall.order.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.order.service.SalesAnalysisService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 销售数据分析控制器
 */
@Api(tags = "销售数据分析")
@RestController
@RequestMapping("/api/analysis/sales")
public class SalesAnalysisController {

    @Autowired
    private SalesAnalysisService salesAnalysisService;

    /**
     * 获取销售概览数据
     */
    @ApiOperation("获取销售概览数据")
    @GetMapping("/overview")
    public R<Map<String, Object>> getSalesOverview(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> overview = salesAnalysisService.getSalesOverview(startDate, endDate);
        return R.success(overview);
    }

    /**
     * 获取销售趋势数据
     */
    @ApiOperation("获取销售趋势数据")
    @GetMapping("/trend")
    public R<Map<String, Object>> getSalesTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval) {
        Map<String, Object> trend = salesAnalysisService.getSalesTrend(startDate, endDate, interval);
        return R.success(trend);
    }

    /**
     * 获取商品销售排名
     */
    @ApiOperation("获取商品销售排名")
    @GetMapping("/product-ranking")
    public R<List<Map<String, Object>>> getProductSalesRanking(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> ranking = salesAnalysisService.getProductSalesRanking(startDate, endDate, limit);
        return R.success(ranking);
    }

    /**
     * 获取分类销售分布
     */
    @ApiOperation("获取分类销售分布")
    @GetMapping("/category-distribution")
    public R<Map<String, Object>> getCategorySalesDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = salesAnalysisService.getCategorySalesDistribution(startDate, endDate);
        return R.success(distribution);
    }

    /**
     * 获取商家销售排名
     */
    @ApiOperation("获取商家销售排名")
    @GetMapping("/merchant-ranking")
    public R<List<Map<String, Object>>> getMerchantSalesRanking(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> ranking = salesAnalysisService.getMerchantSalesRanking(startDate, endDate, limit);
        return R.success(ranking);
    }

    /**
     * 获取支付方式分布
     */
    @ApiOperation("获取支付方式分布")
    @GetMapping("/payment-distribution")
    public R<Map<String, Object>> getPaymentMethodDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> distribution = salesAnalysisService.getPaymentMethodDistribution(startDate, endDate);
        return R.success(distribution);
    }
}
