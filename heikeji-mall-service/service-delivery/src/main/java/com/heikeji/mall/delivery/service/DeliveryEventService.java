package com.heikeji.mall.delivery.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.delivery.entity.DeliveryEvent;
import com.heikeji.mall.delivery.vo.DeliveryEventVO;

import java.util.List;

/**
 * 配送事件服务接口
 */
public interface DeliveryEventService extends IService<DeliveryEvent> {

    /**
     * 添加配送事件
     * @param event 配送事件实体
     * @return 是否成功
     */
    boolean addEvent(DeliveryEvent event);

    /**
     * 根据订单ID获取配送事件列表
     * @param orderId 订单ID
     * @return 配送事件列表
     */
    List<DeliveryEvent> getEventsByOrderId(Long orderId);

    /**
     * 根据订单ID获取配送事件列表（VO格式）
     * @param orderId 订单ID
     * @return 配送事件列表（VO格式）
     */
    List<DeliveryEventVO> getEventVOsByOrderId(Long orderId);

    /**
     * 记录订单创建事件
     * @param orderId 订单ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordOrderCreateEvent(Long orderId, String eventDesc);

    /**
     * 记录配送员接单事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordOrderAcceptEvent(Long orderId, Long deliveryUserId, String eventDesc);

    /**
     * 记录开始配送事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordStartDeliveryEvent(Long orderId, Long deliveryUserId, String eventDesc);

    /**
     * 记录完成配送事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordCompleteDeliveryEvent(Long orderId, Long deliveryUserId, String eventDesc);

    /**
     * 记录订单取消事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordOrderCancelEvent(Long orderId, Long deliveryUserId, String eventDesc);

    /**
     * 记录位置更新事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param longitude 经度
     * @param latitude 纬度
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordLocationUpdateEvent(Long orderId, Long deliveryUserId, Double longitude, Double latitude, String eventDesc);

    /**
     * 记录配送延迟事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordDelayEvent(Long orderId, Long deliveryUserId, String eventDesc);

    /**
     * 记录异常事件
     * @param orderId 订单ID
     * @param deliveryUserId 配送员ID
     * @param eventDesc 事件描述
     * @return 是否成功
     */
    boolean recordExceptionEvent(Long orderId, Long deliveryUserId, String eventDesc);
}
