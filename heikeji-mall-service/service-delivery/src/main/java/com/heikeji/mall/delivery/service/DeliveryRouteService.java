package com.heikeji.mall.delivery.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.delivery.entity.DeliveryRoute;

import java.util.List;
import java.util.Map;

/**
 * 配送路线服务接口
 */
public interface DeliveryRouteService extends IService<DeliveryRoute> {
    
    /**
     * 规划配送路线
     */
    boolean planRoute(Long orderId, Long deliveryUserId);
    
    /**
     * 根据订单ID获取路线详情
     */
    DeliveryRoute getRouteByOrderId(Long orderId);
    
    /**
     * 根据配送员ID获取路线列表
     */
    List<DeliveryRoute> getRoutesByDeliveryUserId(Long deliveryUserId);
    
    /**
     * 获取正在执行的路线
     */
    List<DeliveryRoute> getExecutingRoutes(Long deliveryUserId);
    
    /**
     * 更新路线状态
     */
    boolean updateRouteStatus(Long routeId, Integer status);
    
    /**
     * 更新路线执行状态为开始
     */
    boolean startRoute(Long routeId);
    
    /**
     * 更新路线执行状态为完成
     */
    boolean finishRoute(Long routeId);
    
    /**
     * 计算预计送达时间
     */
    Long calculateEstimatedTime(Long orderId);
    
    /**
     * 计算两点之间的距离（单位：米）
     */
    Integer calculateDistance(Double startLat, Double startLng, Double endLat, Double endLng);
    
    /**
     * 获取路线统计信息
     */
    Map<String, Object> getRouteStats(Long deliveryUserId);
}
