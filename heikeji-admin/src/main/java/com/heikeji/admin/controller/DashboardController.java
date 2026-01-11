package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.feign.OrderAnalysisFeignClient;
import com.heikeji.admin.feign.SalesAnalysisFeignClient;
import com.heikeji.admin.feign.UserAnalysisFeignClient;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据看板控制器
 */
@Api(tags = "数据看板")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private OrderAnalysisFeignClient orderAnalysisFeignClient;
    
    @Autowired
    private SalesAnalysisFeignClient salesAnalysisFeignClient;
    
    @Autowired
    private UserAnalysisFeignClient userAnalysisFeignClient;

    /**
     * 获取系统概览数据
     */
    @ApiOperation("获取系统概览数据")
    @GetMapping("/overview")
    public R getOverview() {
        // 获取今天和7天前的日期
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        // 使用Calendar来获取今天的开始时间，避免使用已过时的Date构造方法
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.setTime(endDate);
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 0);
        calendar.set(java.util.Calendar.MINUTE, 0);
        calendar.set(java.util.Calendar.SECOND, 0);
        calendar.set(java.util.Calendar.MILLISECOND, 0);
        Date todayStartDate = calendar.getTime();
        
        // 调用各服务获取真实数据
        R orderOverview = orderAnalysisFeignClient.getOrderOverview(todayStartDate, endDate);
        R salesOverview = salesAnalysisFeignClient.getSalesOverview(todayStartDate, endDate);
        R userOverview = userAnalysisFeignClient.getUserOverview(todayStartDate, endDate);
        R orderTrend = orderAnalysisFeignClient.getOrderTrend(startDate, endDate, "day");
        
        // 构建概览数据
        Map<String, Object> overview = new HashMap<>();
        overview.put("today", Map.of(
                "orders", ((Map)orderOverview.get("data")).get("totalOrders"),
                "sales", ((Map)salesOverview.get("data")).get("totalAmount"),
                "users", ((Map)userOverview.get("data")).get("newUsers"),
                "products", 0 // 商品数据需要从商品服务获取
        ));
        
        // 总数据（这里简化处理，实际应该从各服务获取历史累计数据）
        overview.put("total", Map.of(
                "orders", 0,
                "sales", 0,
                "users", 0,
                "products", 0
        ));
        
        overview.put("orderTrend", orderTrend.get("data"));
        
        return R.ok().data(overview);
    }

    /**
     * 获取销售统计数据
     */
    @ApiOperation("获取销售统计数据")
    @GetMapping("/sales")
    public R getSalesData() {
        // 获取30天前的日期
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // 调用销售分析服务获取真实数据
        R categoryDistribution = salesAnalysisFeignClient.getCategorySalesDistribution(startDate, endDate);
        
        Map<String, Object> salesData = new HashMap<>();
        salesData.put("categorySales", categoryDistribution.get("data"));
        
        return R.ok().data(salesData);
    }

    /**
     * 获取用户增长数据
     */
    @ApiOperation("获取用户增长数据")
    @GetMapping("/userGrowth")
    public R getUserGrowth() {
        // 获取10天前的日期
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 10 * 24 * 60 * 60 * 1000);
        
        // 调用用户分析服务获取真实数据
        R userGrowth = userAnalysisFeignClient.getUserGrowth(startDate, endDate, "day");
        R userActive = userAnalysisFeignClient.getUserActiveTrend(startDate, endDate, "day");
        
        // 构建用户增长数据
        Map<String, Object> growthData = new HashMap<>();
        growthData.put("dates", ((Map)userGrowth.get("data")).get("dates"));
        growthData.put("newUsers", ((Map)userGrowth.get("data")).get("data"));
        growthData.put("activeUsers", ((Map)userActive.get("data")).get("data"));
        
        return R.ok().data(growthData);
    }

    /**
     * 获取销售趋势数据
     */
    @ApiOperation("获取销售趋势数据")
    @GetMapping("/salesTrend")
    public R getSalesTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        // 调用订单分析Feign客户端获取真实数据
        R result = orderAnalysisFeignClient.getOrderTrend(startDate, endDate, "day");
        return result;
    }

    /**
     * 获取商品销售排行榜
     */
    @ApiOperation("获取商品销售排行榜")
    @GetMapping("/productRanking")
    public R getProductRanking(@RequestParam(defaultValue = "30") Integer days, @RequestParam(defaultValue = "10") Integer limit) {
        // 计算开始日期和结束日期
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
        
        // 调用销售分析Feign客户端获取真实数据
        R result = salesAnalysisFeignClient.getProductSalesRanking(startDate, endDate, limit);
        return result;
    }
}