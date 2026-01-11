package com.heikeji.mall.delivery.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.delivery.entity.DeliveryRoute;

import java.util.List;

/**
 * 配送路线Mapper接口
 */
public interface DeliveryRouteMapper extends BaseMapper<DeliveryRoute> {
    
    /**
     * 根据订单ID查询路线
     */
    DeliveryRoute selectByOrderId(Long orderId);
    
    /**
     * 根据配送员ID查询路线列表
     */
    List<DeliveryRoute> selectByDeliveryUserId(Long deliveryUserId);
    
    /**
     * 查询正在执行的路线
     */
    List<DeliveryRoute> selectExecutingRoutes(Long deliveryUserId);
}
