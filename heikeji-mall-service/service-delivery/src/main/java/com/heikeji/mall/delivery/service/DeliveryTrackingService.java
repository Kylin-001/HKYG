package com.heikeji.mall.delivery.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.delivery.entity.DeliveryTracking;
import com.heikeji.mall.delivery.vo.DeliveryTrackingVO;

/**
 * 配送跟踪服务接口
 */
public interface DeliveryTrackingService extends IService<DeliveryTracking> {

    /**
     * 创建配送跟踪记录
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @return 是否成功
     */
    boolean createTracking(Long orderId, Long deliveryUserId);

    /**
     * 更新配送位置
     * @param orderId 订单ID
     * @param latitude 纬度
     * @param longitude 经度
     * @param status 状态
     * @return 是否成功
     */
    boolean updateLocation(Long orderId, Double latitude, Double longitude, Integer status);

    /**
     * 获取配送跟踪信息
     * @param orderId 订单ID
     * @return 配送跟踪信息VO
     */
    DeliveryTrackingVO getTrackingByOrderId(Long orderId);

    /**
     * 添加配送事件记录
     * @param orderId 订单ID
     * @param eventType 事件类型
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean addTrackingEvent(Long orderId, Integer eventType, String eventDesc);
}