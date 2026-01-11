package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.entity.DeliveryRoute;
import com.heikeji.mall.delivery.mapper.DeliveryRouteMapper;
import com.heikeji.mall.delivery.service.DeliveryOrderService;
import com.heikeji.mall.delivery.service.DeliveryRouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 配送路线服务实现类
 */
@Service
public class DeliveryRouteServiceImpl extends ServiceImpl<DeliveryRouteMapper, DeliveryRoute> implements DeliveryRouteService {

    @Autowired
    private DeliveryRouteMapper deliveryRouteMapper;

    @Autowired
    private DeliveryOrderService deliveryOrderService;

    /**
     * 规划配送路线
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean planRoute(Long orderId, Long deliveryUserId) {
        // 获取订单信息
        DeliveryOrder order = deliveryOrderService.getById(orderId);
        if (order == null) {
            return false;
        }

        // 检查是否已有路线
        DeliveryRoute existingRoute = deliveryRouteMapper.selectByOrderId(orderId);
        if (existingRoute != null) {
            return false;
        }

        // 模拟路线规划：计算距离和预计时间
        // 这里使用简化的距离计算和时间估算
        int distance = 2000; // 假设距离为2000米
        int estimatedTime = 10; // 假设预计时间为10分钟

        // 创建路线记录
        DeliveryRoute route = new DeliveryRoute();
        route.setOrderId(orderId);
        route.setDeliveryUserId(deliveryUserId);
        route.setStatus(1); // 规划完成
        route.setTotalDistance(distance);
        route.setEstimatedTime(estimatedTime);
        route.setPlanTime(new Date());
        route.setCreateTime(new Date());
        route.setUpdateTime(new Date());
        route.setRouteDescription("从" + order.getStartLocation() + "到" + order.getEndLocation());

        // 保存路线
        return deliveryRouteMapper.insert(route) > 0;
    }

    /**
     * 根据订单ID获取路线详情
     */
    @Override
    public DeliveryRoute getRouteByOrderId(Long orderId) {
        return deliveryRouteMapper.selectByOrderId(orderId);
    }

    /**
     * 根据配送员ID获取路线列表
     */
    @Override
    public List<DeliveryRoute> getRoutesByDeliveryUserId(Long deliveryUserId) {
        return deliveryRouteMapper.selectByDeliveryUserId(deliveryUserId);
    }

    /**
     * 获取正在执行的路线
     */
    @Override
    public List<DeliveryRoute> getExecutingRoutes(Long deliveryUserId) {
        return deliveryRouteMapper.selectExecutingRoutes(deliveryUserId);
    }

    /**
     * 更新路线状态
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean updateRouteStatus(Long routeId, Integer status) {
        DeliveryRoute route = deliveryRouteMapper.selectById(routeId);
        if (route == null) {
            return false;
        }

        route.setStatus(status);
        route.setUpdateTime(new Date());
        return deliveryRouteMapper.updateById(route) > 0;
    }

    /**
     * 更新路线执行状态为开始
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean startRoute(Long routeId) {
        DeliveryRoute route = deliveryRouteMapper.selectById(routeId);
        if (route == null) {
            return false;
        }

        route.setStatus(2); // 执行中
        route.setStartTime(new Date());
        route.setUpdateTime(new Date());
        return deliveryRouteMapper.updateById(route) > 0;
    }

    /**
     * 更新路线执行状态为完成
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean finishRoute(Long routeId) {
        DeliveryRoute route = deliveryRouteMapper.selectById(routeId);
        if (route == null) {
            return false;
        }

        route.setStatus(3); // 已完成
        route.setFinishTime(new Date());
        route.setUpdateTime(new Date());
        return deliveryRouteMapper.updateById(route) > 0;
    }

    /**
     * 计算预计送达时间
     */
    @Override
    public Long calculateEstimatedTime(Long orderId) {
        // 简化实现：返回当前时间加上30分钟
        return System.currentTimeMillis() + 30 * 60 * 1000;
    }

    /**
     * 计算两点之间的距离（单位：米）
     * 使用Haversine公式计算地球表面两点间的距离
     */
    @Override
    public Integer calculateDistance(Double startLat, Double startLng, Double endLat, Double endLng) {
        if (startLat == null || startLng == null || endLat == null || endLng == null) {
            return 0;
        }

        final int R = 6371000; // 地球半径，单位：米

        double lat1 = Math.toRadians(startLat);
        double lat2 = Math.toRadians(endLat);
        double deltaLat = Math.toRadians(endLat - startLat);
        double deltaLng = Math.toRadians(endLng - startLng);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        int distance = (int) (R * c);
        return distance;
    }

    /**
     * 获取路线统计信息
     */
    @Override
    public Map<String, Object> getRouteStats(Long deliveryUserId) {
        // 获取配送员的所有路线
        List<DeliveryRoute> routes = deliveryRouteMapper.selectByDeliveryUserId(deliveryUserId);

        // 统计数据
        int totalRoutes = routes.size();
        int completedRoutes = 0;
        int executingRoutes = 0;
        int plannedRoutes = 0;
        int totalDistance = 0;

        for (DeliveryRoute route : routes) {
            if (route.getStatus() == 3) { // 已完成
                completedRoutes++;
            } else if (route.getStatus() == 2) { // 执行中
                executingRoutes++;
            } else if (route.getStatus() == 1) { // 规划完成
                plannedRoutes++;
            }
            totalDistance += route.getTotalDistance() != null ? route.getTotalDistance() : 0;
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRoutes", totalRoutes);
        stats.put("completedRoutes", completedRoutes);
        stats.put("executingRoutes", executingRoutes);
        stats.put("plannedRoutes", plannedRoutes);
        stats.put("totalDistance", totalDistance);
        stats.put("averageDistance", totalRoutes > 0 ? totalDistance / totalRoutes : 0);

        return stats;
    }
}
