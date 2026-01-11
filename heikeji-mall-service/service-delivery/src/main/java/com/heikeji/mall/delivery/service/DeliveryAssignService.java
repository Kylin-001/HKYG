package com.heikeji.mall.delivery.service;

import com.heikeji.mall.delivery.vo.AssignResultVO;

import java.util.Map;

/**
 * 配送订单分配服务
 */
public interface DeliveryAssignService {

    /**
     * 自动分配订单给最合适的配送员
     * @param orderId 订单ID
     * @return 分配结果
     */
    AssignResultVO assignOrder(Long orderId);

    /**
     * 手动分配订单给指定配送员
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @return 分配结果
     */
    AssignResultVO assignOrderManual(Long orderId, Long deliveryUserId);

    /**
     * 获取可分配的配送员列表
     * @param orderId 订单ID
     * @return 配送员列表
     */
    Map<String, Object> getAvailableDeliveryUsers(Long orderId);

    /**
     * 计算配送员与订单的匹配度
     * @param deliveryUserId 配送员ID
     * @param orderId 订单ID
     * @return 匹配度分数（0-100）
     */
    int calculateMatchScore(Long deliveryUserId, Long orderId);
}
