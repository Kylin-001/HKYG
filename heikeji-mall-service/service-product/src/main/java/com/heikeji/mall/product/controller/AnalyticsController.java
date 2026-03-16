package com.heikeji.mall.analytics.controller;

import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "数据分析", description = "数据统计分析相关接口")
@Slf4j
public class AnalyticsController {

    @GetMapping("/overview")
    @Operation(summary = "获取数据概览")
    public R<Map<String, Object>> getOverview() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalProducts", 1256);
        data.put("totalOrders", 8965);
        data.put("totalUsers", 15892);
        data.put("totalRevenue", 568920);
        data.put("todayOrders", 156);
        data.put("todayRevenue", 8965);
        data.put("todayUsers", 89);
        return R.success(data);
    }

    @GetMapping("/sales-trend")
    @Operation(summary = "获取销售趋势")
    public R<Map<String, Object>> getSalesTrend(
            @RequestParam(required = false, defaultValue = "7") Integer days) {
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, -i);
            Map<String, Object> day = new HashMap<>();
            day.put("date", String.format("%tF", cal.getTime()));
            day.put("orders", 50 + (int)(Math.random() * 100));
            day.put("revenue", 2000 + (int)(Math.random() * 5000));
            day.put("users", 20 + (int)(Math.random() * 50));
            trend.add(day);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("trend", trend);
        result.put("totalOrders", 8965);
        result.put("totalRevenue", 568920);
        return R.success(result);
    }

    @GetMapping("/category-distribution")
    @Operation(summary = "获取分类分布")
    public R<List<Map<String, Object>>> getCategoryDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();
        distribution.add(createCategory("电子产品", 356, 28.3));
        distribution.add(createCategory("图书教材", 289, 23.0));
        distribution.add(createCategory("生活用品", 201, 16.0));
        distribution.add(createCategory("服装鞋帽", 156, 12.4));
        distribution.add(createCategory("运动户外", 134, 10.7));
        distribution.add(createCategory("美妆护肤", 78, 6.2));
        distribution.add(createCategory("其他", 42, 3.4));
        return R.success(distribution);
    }

    @GetMapping("/hot-products")
    @Operation(summary = "获取热门商品")
    public R<List<Map<String, Object>>> getHotProducts(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Map<String, Object>> products = new ArrayList<>();
        products.add(createHotProduct(1, "iPhone 14 Pro", 328, 196800));
        products.add(createHotProduct(2, "MacBook Air M2", 215, 172000));
        products.add(createHotProduct(3, "AirPods Pro", 456, 91200));
        products.add(createHotProduct(4, "iPad Air", 189, 94500));
        products.add(createHotProduct(5, "Apple Watch", 156, 78000));
        products.add(createHotProduct(6, "华为Mate 60", 142, 85200));
        products.add(createHotProduct(7, "小米手机", 128, 51200));
        products.add(createHotProduct(8, "联想笔记本", 98, 58800));
        products.add(createHotProduct(9, "戴尔显示器", 87, 43400));
        products.add(createHotProduct(10, "罗技鼠标", 234, 23400));
        return R.success(products.subList(0, Math.min(limit, products.size())));
    }

    @GetMapping("/user-growth")
    @Operation(summary = "获取用户增长趋势")
    public R<Map<String, Object>> getUserGrowth(
            @RequestParam(required = false, defaultValue = "30") Integer days) {
        List<Map<String, Object>> growth = new ArrayList<>();
        int cumulative = 15000;
        for (int i = days - 1; i >= 0; i--) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, -i);
            Map<String, Object> day = new HashMap<>();
            day.put("date", String.format("%tF", cal.getTime()));
            int newUsers = 20 + (int)(Math.random() * 80);
            cumulative += newUsers;
            day.put("newUsers", newUsers);
            day.put("totalUsers", cumulative);
            growth.add(day);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("growth", growth);
        result.put("totalUsers", cumulative);
        result.put("growthRate", 5.9);
        return R.success(result);
    }

    @GetMapping("/order-status")
    @Operation(summary = "获取订单状态分布")
    public R<Map<String, Object>> getOrderStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("pending", 156);
        status.put("paid", 234);
        status.put("processing", 189);
        status.put("shipped", 267);
        status.put("completed", 7890);
        status.put("cancelled", 156);
        status.put("refunded", 73);
        return R.success(status);
    }

    @GetMapping("/revenue-analysis")
    @Operation(summary = "获取收入分析")
    public R<Map<String, Object>> getRevenueAnalysis() {
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("todayRevenue", 8965);
        analysis.put("yesterdayRevenue", 7823);
        analysis.put("weekRevenue", 56789);
        analysis.put("monthRevenue", 234567);
        analysis.put("yearRevenue", 2567890);
        analysis.put("growthRate", 12.5);
        
        List<Map<String, Object>> byPayment = new ArrayList<>();
        byPayment.add(createPaymentMethod("微信支付", 456789, 35.6));
        byPayment.add(createPaymentMethod("支付宝", 523456, 40.8));
        byPayment.add(createPaymentMethod("银行卡", 234567, 18.3));
        byPayment.add(createPaymentMethod("其他", 68978, 5.3));
        analysis.put("byPaymentMethod", byPayment);
        
        return R.success(analysis);
    }

    private Map<String, Object> createCategory(String name, int count, double percent) {
        Map<String, Object> category = new HashMap<>();
        category.put("name", name);
        category.put("count", count);
        category.put("percent", percent);
        return category;
    }

    private Map<String, Object> createHotProduct(int rank, String name, int sales, int revenue) {
        Map<String, Object> product = new HashMap<>();
        product.put("rank", rank);
        product.put("name", name);
        product.put("sales", sales);
        product.put("revenue", revenue);
        return product;
    }

    private Map<String, Object> createPaymentMethod(String name, int amount, double percent) {
        Map<String, Object> method = new HashMap<>();
        method.put("name", name);
        method.put("amount", amount);
        method.put("percent", percent);
        return method;
    }
}
