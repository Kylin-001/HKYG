package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.mapper.DeliveryOrderMapper;
import com.heikeji.mall.delivery.service.DeliveryAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 配送数据分析服务实现类
 */
@Service
public class DeliveryAnalysisServiceImpl implements DeliveryAnalysisService {

    @Autowired
    private DeliveryOrderMapper deliveryOrderMapper;

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'overview_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getDeliveryOverview(Date startDate, Date endDate) {
        Map<String, Object> result = new HashMap<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 计算总配送订单数
        int totalOrders = orderList.size();
        
        // 计算已完成配送数
        long completedOrders = orderList.stream()
                .filter(order -> order.getStatus() == 3)
                .count();
        
        // 计算配送成功率
        double successRate = totalOrders > 0 ? (double) completedOrders / totalOrders * 100 : 0;
        
        // 计算总配送金额
        BigDecimal totalAmount = orderList.stream()
                .map(DeliveryOrder::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 计算平均配送金额
        BigDecimal avgAmount = totalOrders > 0 ? totalAmount.divide(BigDecimal.valueOf(totalOrders), 2, BigDecimal.ROUND_HALF_UP) : BigDecimal.ZERO;
        
        // 计算配送员数量
        long deliveryManCount = orderList.stream()
                .map(DeliveryOrder::getDeliveryUserId)
                .filter(Objects::nonNull)
                .distinct()
                .count();
        
        // 填充结果
        result.put("totalOrders", totalOrders);
        result.put("completedOrders", completedOrders);
        result.put("successRate", String.format("%.2f", successRate));
        result.put("totalAmount", totalAmount);
        result.put("avgAmount", avgAmount);
        result.put("deliveryManCount", deliveryManCount);
        
        return result;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'trend_' + #startDate.time + '_' + #endDate.time + '_' + #interval")
    public Map<String, Object> getDeliveryTrend(Date startDate, Date endDate, String interval) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> trendData = new ArrayList<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 按时间间隔分组
        Map<String, List<DeliveryOrder>> groupedOrders = groupOrdersByInterval(orderList, interval);
        
        // 生成趋势数据
        for (Map.Entry<String, List<DeliveryOrder>> entry : groupedOrders.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            String timePeriod = entry.getKey();
            List<DeliveryOrder> orders = entry.getValue();
            
            // 计算该时间段的订单数
            int orderCount = orders.size();
            
            // 计算该时间段的已完成订单数
            long completedCount = orders.stream()
                    .filter(order -> order.getStatus() == 3)
                    .count();
            
            // 计算该时间段的总金额
            BigDecimal totalAmount = orders.stream()
                    .map(DeliveryOrder::getAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // 填充数据点
            dataPoint.put("timePeriod", timePeriod);
            dataPoint.put("orderCount", orderCount);
            dataPoint.put("completedCount", completedCount);
            dataPoint.put("totalAmount", totalAmount);
            
            trendData.add(dataPoint);
        }
        
        // 按时间排序
        trendData.sort(Comparator.comparing(m -> m.get("timePeriod").toString()));
        
        // 填充结果
        result.put("trendData", trendData);
        result.put("interval", interval);
        
        return result;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'status_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getDeliveryStatusDistribution(Date startDate, Date endDate) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> statusData = new ArrayList<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 按状态分组
        Map<Integer, List<DeliveryOrder>> statusGroups = orderList.stream()
                .collect(Collectors.groupingBy(DeliveryOrder::getStatus));
        
        // 状态映射
        Map<Integer, String> statusMap = new HashMap<>();
        statusMap.put(0, "待接单");
        statusMap.put(1, "已接单");
        statusMap.put(2, "配送中");
        statusMap.put(3, "已完成");
        statusMap.put(4, "已取消");
        
        // 生成状态分布数据
        for (Map.Entry<Integer, List<DeliveryOrder>> entry : statusGroups.entrySet()) {
            Map<String, Object> statusPoint = new HashMap<>();
            Integer status = entry.getKey();
            List<DeliveryOrder> orders = entry.getValue();
            
            statusPoint.put("status", status);
            statusPoint.put("statusName", statusMap.getOrDefault(status, "未知状态"));
            statusPoint.put("count", orders.size());
            statusPoint.put("percentage", String.format("%.2f", (double) orders.size() / orderList.size() * 100));
            
            statusData.add(statusPoint);
        }
        
        // 填充结果
        result.put("statusData", statusData);
        
        return result;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'efficiency_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getDeliveryEfficiencyAnalysis(Date startDate, Date endDate) {
        Map<String, Object> result = new HashMap<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getStatus, 3) // 只查询已完成订单
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有已完成配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 计算平均接单时间（从创建到接单）
        long avgAcceptTime = calculateAvgTimeDifference(orderList, DeliveryOrder::getCreateTime, DeliveryOrder::getAcceptTime);
        
        // 计算平均配送时间（从接单到完成）
        long avgDeliveryTime = calculateAvgTimeDifference(orderList, DeliveryOrder::getAcceptTime, DeliveryOrder::getDeliveryEndTime);
        
        // 计算总平均时间（从创建到完成）
        long avgTotalTime = calculateAvgTimeDifference(orderList, DeliveryOrder::getCreateTime, DeliveryOrder::getDeliveryEndTime);
        
        // 填充结果
        result.put("avgAcceptTime", avgAcceptTime); // 单位：秒
        result.put("avgDeliveryTime", avgDeliveryTime); // 单位：秒
        result.put("avgTotalTime", avgTotalTime); // 单位：秒
        result.put("orderCount", orderList.size());
        
        return result;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'performance_' + #startDate.time + '_' + #endDate.time")
    public List<Map<String, Object>> getDeliverymanPerformance(Date startDate, Date endDate) {
        List<Map<String, Object>> performanceList = new ArrayList<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 按配送员分组
        Map<Long, List<DeliveryOrder>> deliverymanGroups = orderList.stream()
                .filter(order -> order.getDeliveryUserId() != null)
                .collect(Collectors.groupingBy(DeliveryOrder::getDeliveryUserId));
        
        // 生成配送员绩效数据
        for (Map.Entry<Long, List<DeliveryOrder>> entry : deliverymanGroups.entrySet()) {
            Map<String, Object> performance = new HashMap<>();
            Long deliveryUserId = entry.getKey();
            List<DeliveryOrder> orders = entry.getValue();
            
            // 计算总配送订单数
            int totalOrders = orders.size();
            
            // 计算已完成订单数
            long completedOrders = orders.stream()
                    .filter(order -> order.getStatus() == 3)
                    .count();
            
            // 计算配送成功率
            double successRate = totalOrders > 0 ? (double) completedOrders / totalOrders * 100 : 0;
            
            // 计算总配送金额
            BigDecimal totalAmount = orders.stream()
                    .map(DeliveryOrder::getAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // 计算平均配送时间
            long avgDeliveryTime = calculateAvgTimeDifference(
                    orders.stream().filter(order -> order.getStatus() == 3).collect(Collectors.toList()),
                    DeliveryOrder::getAcceptTime, DeliveryOrder::getDeliveryEndTime);
            
            // 填充绩效数据
            performance.put("deliveryUserId", deliveryUserId);
            performance.put("totalOrders", totalOrders);
            performance.put("completedOrders", completedOrders);
            performance.put("successRate", String.format("%.2f", successRate));
            performance.put("totalAmount", totalAmount);
            performance.put("avgDeliveryTime", avgDeliveryTime);
            
            performanceList.add(performance);
        }
        
        // 按总订单数排序
        performanceList.sort((m1, m2) -> ((Integer) m2.get("totalOrders")).compareTo((Integer) m1.get("totalOrders")));
        
        return performanceList;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'region_' + #startDate.time + '_' + #endDate.time")
    public List<Map<String, Object>> getDeliveryRegionDistribution(Date startDate, Date endDate) {
        List<Map<String, Object>> regionList = new ArrayList<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 按起始地址分组（简单处理，实际可能需要更复杂的地址解析）
        Map<String, List<DeliveryOrder>> regionGroups = orderList.stream()
                .collect(Collectors.groupingBy(order -> extractRegion(order.getStartLocation())));
        
        // 生成地域分布数据
        for (Map.Entry<String, List<DeliveryOrder>> entry : regionGroups.entrySet()) {
            Map<String, Object> regionData = new HashMap<>();
            String region = entry.getKey();
            List<DeliveryOrder> orders = entry.getValue();
            
            regionData.put("region", region);
            regionData.put("orderCount", orders.size());
            regionData.put("completedCount", orders.stream().filter(order -> order.getStatus() == 3).count());
            
            regionList.add(regionData);
        }
        
        // 按订单数排序
        regionList.sort((m1, m2) -> ((Long) m2.get("orderCount")).compareTo((Long) m1.get("orderCount")));
        
        return regionList;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'type_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getDeliveryTypeDistribution(Date startDate, Date endDate) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> typeData = new ArrayList<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 订单类型映射
        Map<Integer, String> typeMap = new HashMap<>();
        typeMap.put(1, "快递取件");
        typeMap.put(2, "快递送件");
        typeMap.put(3, "跑腿代购");
        typeMap.put(4, "文件配送");
        
        // 按订单类型分组
        Map<Integer, List<DeliveryOrder>> typeGroups = orderList.stream()
                .collect(Collectors.groupingBy(DeliveryOrder::getOrderType));
        
        // 生成类型分布数据
        for (Map.Entry<Integer, List<DeliveryOrder>> entry : typeGroups.entrySet()) {
            Map<String, Object> typePoint = new HashMap<>();
            Integer type = entry.getKey();
            List<DeliveryOrder> orders = entry.getValue();
            
            typePoint.put("type", type);
            typePoint.put("typeName", typeMap.getOrDefault(type, "未知类型"));
            typePoint.put("count", orders.size());
            typePoint.put("percentage", String.format("%.2f", (double) orders.size() / orderList.size() * 100));
            
            typeData.add(typePoint);
        }
        
        // 填充结果
        result.put("typeData", typeData);
        
        return result;
    }

    @Override
    @Cacheable(value = "deliveryAnalysis", key = "'time_' + #startDate.time + '_' + #endDate.time")
    public Map<String, Object> getDeliveryTimeAnalysis(Date startDate, Date endDate) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> timeData = new ArrayList<>();
        
        // 构建查询条件
        LambdaQueryWrapper<DeliveryOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.between(DeliveryOrder::getCreateTime, startDate, endDate)
                .eq(DeliveryOrder::getDeleted, 0);
        
        // 获取所有配送订单
        List<DeliveryOrder> orderList = deliveryOrderMapper.selectList(queryWrapper);
        
        // 按小时分组
        Map<Integer, List<DeliveryOrder>> hourGroups = new HashMap<>();
        for (int i = 0; i < 24; i++) {
            hourGroups.put(i, new ArrayList<>());
        }
        
        // 分组订单
        for (DeliveryOrder order : orderList) {
            int hour = order.getCreateTime().getHours();
            hourGroups.get(hour).add(order);
        }
        
        // 生成小时分布数据
        for (Map.Entry<Integer, List<DeliveryOrder>> entry : hourGroups.entrySet()) {
            Map<String, Object> hourData = new HashMap<>();
            Integer hour = entry.getKey();
            List<DeliveryOrder> orders = entry.getValue();
            
            hourData.put("hour", hour);
            hourData.put("orderCount", orders.size());
            hourData.put("completedCount", orders.stream().filter(order -> order.getStatus() == 3).count());
            
            timeData.add(hourData);
        }
        
        // 填充结果
        result.put("timeData", timeData);
        
        return result;
    }
    
    /**
     * 辅助方法：按时间间隔分组订单
     */
    private Map<String, List<DeliveryOrder>> groupOrdersByInterval(List<DeliveryOrder> orders, String interval) {
        Map<String, List<DeliveryOrder>> grouped = new HashMap<>();
        SimpleDateFormat sdf;
        
        // 根据时间间隔选择格式化方式
        switch (interval.toLowerCase()) {
            case "day":
                sdf = new SimpleDateFormat("yyyy-MM-dd");
                break;
            case "week":
                sdf = new SimpleDateFormat("yyyy-'W'ww"); // 格式：2023-W45
                break;
            case "month":
                sdf = new SimpleDateFormat("yyyy-MM");
                break;
            default:
                sdf = new SimpleDateFormat("yyyy-MM-dd");
        }
        
        // 分组
        for (DeliveryOrder order : orders) {
            String timeKey = sdf.format(order.getCreateTime());
            grouped.computeIfAbsent(timeKey, k -> new ArrayList<>()).add(order);
        }
        
        return grouped;
    }
    
    /**
     * 辅助方法：计算两个时间字段之间的平均时间差（秒）
     */
    private long calculateAvgTimeDifference(List<DeliveryOrder> orders, 
                                          java.util.function.Function<DeliveryOrder, Date> startTimeFunc, 
                                          java.util.function.Function<DeliveryOrder, Date> endTimeFunc) {
        if (orders.isEmpty()) {
            return 0;
        }
        
        long totalDiff = 0;
        int count = 0;
        
        for (DeliveryOrder order : orders) {
            Date startTime = startTimeFunc.apply(order);
            Date endTime = endTimeFunc.apply(order);
            
            if (startTime != null && endTime != null) {
                long diff = (endTime.getTime() - startTime.getTime()) / 1000; // 转换为秒
                totalDiff += diff;
                count++;
            }
        }
        
        return count > 0 ? totalDiff / count : 0;
    }
    
    /**
     * 辅助方法：提取地址中的区域信息（简单处理，实际可能需要更复杂的地址解析）
     */
    private String extractRegion(String address) {
        if (address == null || address.isEmpty()) {
            return "未知区域";
        }
        
        // 简单处理，取地址前5个字符作为区域标识
        return address.length() > 5 ? address.substring(0, 5) : address;
    }
}