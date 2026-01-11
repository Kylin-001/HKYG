package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderItem;
import com.heikeji.mall.order.mapper.OrderItemMapper;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.order.service.SalesAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 销售数据分析服务实现类
 */
@Service
public class SalesAnalysisServiceImpl implements SalesAnalysisService {

    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private OrderItemMapper orderItemMapper;

    @Override
    @Cacheable(value = "salesAnalysis", key = "'overview_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getSalesOverview(Date startDate, Date endDate) {
        // 查询指定时间范围内的订单
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.between("created_at", startDate, endDate)
                   .eq("status", 5); // 5表示订单已完成
        
        // 查询订单总数
        long totalOrders = orderMapper.selectCount(queryWrapper);
        
        // 查询订单总金额
        List<Order> orders = orderMapper.selectList(queryWrapper);
        double totalSales = orders.stream()
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum();
        
        // 查询订单总商品数量（简化实现，实际需要从订单商品表查询）
        long totalProducts = 0;
        
        // 查询平均订单金额
        double avgOrderAmount = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        // 构建销售概览数据
        Map<String, Object> overview = new HashMap<>();
        overview.put("startDate", startDate);
        overview.put("endDate", endDate);
        overview.put("totalOrders", totalOrders);
        overview.put("totalSales", totalSales);
        overview.put("totalProducts", totalProducts);
        overview.put("avgOrderAmount", avgOrderAmount);
        
        return overview;
    }

    @Override
    @Cacheable(value = "salesAnalysis", key = "'trend_' + #startDate.time + '_' + #endDate.time + '_' + #interval")
    public Map<String, Object> getSalesTrend(Date startDate, Date endDate, String interval) {
        // 查询指定时间范围内的订单
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.between("created_at", startDate, endDate)
                   .eq("status", 5); // 5表示订单已完成
        
        List<Order> orders = orderMapper.selectList(queryWrapper);
        
        // 根据时间间隔分组统计销售数据
        Map<String, Map<String, Object>> trendMap = new TreeMap<>();
        
        for (Order order : orders) {
            Date orderDate = order.getCreateTime();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(orderDate);
            String timeKey = "";
            
            // 根据不同时间间隔生成时间键
            switch (interval) {
                case "day":
                    timeKey = new SimpleDateFormat("yyyy-MM-dd").format(orderDate);
                    break;
                case "week":
                    // 获取周数
                    int weekOfYear = calendar.get(Calendar.WEEK_OF_YEAR);
                    timeKey = calendar.get(Calendar.YEAR) + "-W" + weekOfYear;
                    break;
                case "month":
                    timeKey = calendar.get(Calendar.YEAR) + "-" + (calendar.get(Calendar.MONTH) + 1);
                    break;
                default:
                    timeKey = new SimpleDateFormat("yyyy-MM-dd").format(orderDate);
                    break;
            }
            
            // 初始化或更新时间键对应的销售数据
            final String finalTimeKey = timeKey;
            trendMap.computeIfAbsent(timeKey, k -> {
                Map<String, Object> trendData = new HashMap<>();
                trendData.put("time", finalTimeKey);
                trendData.put("salesAmount", 0.0);
                trendData.put("orderCount", 0L);
                trendData.put("productCount", 0L);
                return trendData;
            });
            
            Map<String, Object> trendData = trendMap.get(timeKey);
            trendData.put("salesAmount", (double) trendData.get("salesAmount") + order.getTotalAmount().doubleValue());
            trendData.put("orderCount", (long) trendData.get("orderCount") + 1);
            // 简化实现，不统计商品数量
        }
        
        // 转换为列表格式
        List<Map<String, Object>> trendList = new ArrayList<>(trendMap.values());
        
        // 构建销售趋势数据
        Map<String, Object> result = new HashMap<>();
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        result.put("interval", interval);
        result.put("trendData", trendList);
        
        return result;
    }

    @Override
    @Cacheable(value = "salesAnalysis", key = "'productRanking_' + #startDate.time + '_' + #endDate.time + '_' + #limit")
    public List<Map<String, Object>> getProductSalesRanking(Date startDate, Date endDate, int limit) {
        // 查询指定时间范围内的订单
        QueryWrapper<Order> orderWrapper = new QueryWrapper<>();
        orderWrapper.between("created_at", startDate, endDate)
                   .eq("status", 5); // 5表示订单已完成
        List<Order> orders = orderMapper.selectList(orderWrapper);
        
        // 获取订单ID列表
        List<Long> orderIds = orders.stream()
                .map(Order::getId)
                .collect(Collectors.toList());
        
        if (orderIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 查询订单商品项
        QueryWrapper<OrderItem> itemWrapper = new QueryWrapper<>();
        itemWrapper.in("order_id", orderIds);
        List<OrderItem> orderItems = orderItemMapper.selectList(itemWrapper);
        
        // 按商品ID分组统计销量和销售额
        Map<Long, Map<String, Object>> productSales = new HashMap<>();
        for (OrderItem item : orderItems) {
            Long productId = item.getProductId();
            
            productSales.computeIfAbsent(productId, k -> {
                Map<String, Object> salesData = new HashMap<>();
                salesData.put("productId", productId);
                salesData.put("productName", item.getProductName());
                salesData.put("salesQuantity", 0L);
                salesData.put("salesAmount", 0.0);
                return salesData;
            });
            
            Map<String, Object> salesData = productSales.get(productId);
            salesData.put("salesQuantity", (long) salesData.get("salesQuantity") + item.getQuantity());
            salesData.put("salesAmount", (double) salesData.get("salesAmount") + item.getProductPrice().doubleValue() * item.getQuantity());
        }
        
        // 转换为列表并按销售额排序
        List<Map<String, Object>> ranking = productSales.values().stream()
                .sorted((o1, o2) -> Double.compare((double) o2.get("salesAmount"), (double) o1.get("salesAmount")))
                .limit(limit)
                .collect(Collectors.toList());
        
        return ranking;
    }

    @Override
    @Cacheable(value = "salesAnalysis", key = "'categoryDistribution_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getCategorySalesDistribution(Date startDate, Date endDate) {
        // 查询指定时间范围内的订单
        QueryWrapper<Order> orderWrapper = new QueryWrapper<>();
        orderWrapper.between("created_at", startDate, endDate)
                   .eq("status", 5); // 5表示订单已完成
        List<Order> orders = orderMapper.selectList(orderWrapper);
        
        // 获取订单ID列表
        List<Long> orderIds = orders.stream()
                .map(Order::getId)
                .collect(Collectors.toList());
        
        if (orderIds.isEmpty()) {
            return new HashMap<>();
        }
        
        // 查询订单商品项
        QueryWrapper<OrderItem> itemWrapper = new QueryWrapper<>();
        itemWrapper.in("order_id", orderIds);
        List<OrderItem> orderItems = orderItemMapper.selectList(itemWrapper);
        
        // 按分类ID分组统计销售额
        Map<Long, Double> categorySales = new HashMap<>();
        double totalSales = 0.0;
        
        for (OrderItem item : orderItems) {
            // 简化实现，OrderItem中没有categoryId字段，暂时使用固定值
            Long categoryId = 1L;
            double itemSales = item.getProductPrice().doubleValue() * item.getQuantity();
            categorySales.put(categoryId, categorySales.getOrDefault(categoryId, 0.0) + itemSales);
            totalSales += itemSales;
        }
        
        // 构建分类销售分布数据
        List<Map<String, Object>> distribution = new ArrayList<>();
        for (Map.Entry<Long, Double> entry : categorySales.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("categoryId", entry.getKey());
            categoryData.put("categoryName", "分类" + entry.getKey()); // 简化实现，实际项目中需要从商品分类服务获取
            categoryData.put("salesAmount", entry.getValue());
            categoryData.put("salesPercentage", totalSales > 0 ? (entry.getValue() / totalSales) * 100 : 0);
            distribution.add(categoryData);
        }
        
        // 按销售额排序
        distribution.sort((o1, o2) -> Double.compare((double) o2.get("salesAmount"), (double) o1.get("salesAmount")));
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalSales", totalSales);
        result.put("distribution", distribution);
        
        return result;
    }

    @Override
    @Cacheable(value = "salesAnalysis", key = "'merchantRanking_' + #startDate.time + '_' + #endDate.time + '_' + #limit")
    public List<Map<String, Object>> getMerchantSalesRanking(Date startDate, Date endDate, int limit) {
        // 查询指定时间范围内的订单
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.between("created_at", startDate, endDate)
                   .eq("status", 5); // 5表示订单已完成
        List<Order> orders = orderMapper.selectList(queryWrapper);
        
        // 按商家ID分组统计销售额
        Map<Long, Map<String, Object>> merchantSales = new HashMap<>();
        for (Order order : orders) {
            Long merchantId = order.getMerchantId();
            
            merchantSales.computeIfAbsent(merchantId, k -> {
                Map<String, Object> salesData = new HashMap<>();
                salesData.put("merchantId", merchantId);
                salesData.put("merchantName", "商家" + merchantId); // 简化实现，实际项目中需要从商家服务获取
                salesData.put("salesAmount", 0.0);
                salesData.put("orderCount", 0L);
                return salesData;
            });
            
            Map<String, Object> salesData = merchantSales.get(merchantId);
            salesData.put("salesAmount", (double) salesData.get("salesAmount") + order.getTotalAmount().doubleValue());
            salesData.put("orderCount", (long) salesData.get("orderCount") + 1);
        }
        
        // 转换为列表并按销售额排序
        List<Map<String, Object>> ranking = merchantSales.values().stream()
                .sorted((o1, o2) -> Double.compare((double) o2.get("salesAmount"), (double) o1.get("salesAmount")))
                .limit(limit)
                .collect(Collectors.toList());
        
        return ranking;
    }

    @Override
    @Cacheable(value = "salesAnalysis", key = "'paymentDistribution_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getPaymentMethodDistribution(Date startDate, Date endDate) {
        // 查询指定时间范围内的订单
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.between("created_at", startDate, endDate)
                   .eq("status", 5); // 5表示订单已完成
        List<Order> orders = orderMapper.selectList(queryWrapper);
        
        // 按支付方式分组统计订单数量和金额
        Map<Integer, Map<String, Object>> paymentDistribution = new HashMap<>();
        
        for (Order order : orders) {
            Integer paymentMethod = order.getPayType();
            
            paymentDistribution.computeIfAbsent(paymentMethod, k -> {
                Map<String, Object> methodData = new HashMap<>();
                methodData.put("paymentMethod", paymentMethod);
                methodData.put("paymentMethodName", getPaymentMethodName(paymentMethod));
                methodData.put("orderCount", 0L);
                methodData.put("salesAmount", 0.0);
                return methodData;
            });
            
            Map<String, Object> methodData = paymentDistribution.get(paymentMethod);
            methodData.put("orderCount", (long) methodData.get("orderCount") + 1);
            methodData.put("salesAmount", (double) methodData.get("salesAmount") + order.getTotalAmount().doubleValue());
        }
        
        // 转换为列表格式
        List<Map<String, Object>> distribution = new ArrayList<>(paymentDistribution.values());
        
        // 计算总订单数和总销售额
        long totalOrders = distribution.stream()
                .mapToLong(item -> (long) item.get("orderCount"))
                .sum();
        double totalSales = distribution.stream()
                .mapToDouble(item -> (double) item.get("salesAmount"))
                .sum();
        
        // 计算每种支付方式的占比
        for (Map<String, Object> item : distribution) {
            long orderCount = (long) item.get("orderCount");
            double salesAmount = (double) item.get("salesAmount");
            
            item.put("orderPercentage", totalOrders > 0 ? (double) orderCount / totalOrders * 100 : 0);
            item.put("salesPercentage", totalSales > 0 ? salesAmount / totalSales * 100 : 0);
        }
        
        // 按订单数量排序
        distribution.sort((o1, o2) -> Long.compare((long) o2.get("orderCount"), (long) o1.get("orderCount")));
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalOrders", totalOrders);
        result.put("totalSales", totalSales);
        result.put("distribution", distribution);
        
        return result;
    }
    
    /**
     * 获取分类名称（简化实现）
     */
    private String getCategoryName(Long categoryId) {
        Map<Long, String> categoryMap = new HashMap<>();
        categoryMap.put(1L, "食品饮料");
        categoryMap.put(2L, "生活用品");
        categoryMap.put(3L, "数码电子");
        categoryMap.put(4L, "学习用品");
        categoryMap.put(5L, "服装鞋帽");
        
        return categoryMap.getOrDefault(categoryId, "未知分类");
    }
    
    /**
     * 获取商家名称（简化实现）
     */
    private String getMerchantName(Long merchantId) {
        return "商家" + merchantId;
    }
    
    /**
     * 获取支付方式名称
     */
    private String getPaymentMethodName(Integer paymentMethod) {
        Map<Integer, String> paymentMap = new HashMap<>();
        paymentMap.put(1, "微信支付");
        paymentMap.put(2, "支付宝支付");
        paymentMap.put(3, "余额支付");
        
        return paymentMap.getOrDefault(paymentMethod, "未知支付方式");
    }
}
