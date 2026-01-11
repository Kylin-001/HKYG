package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.delivery.entity.DeliveryEvent;
import com.heikeji.mall.delivery.mapper.DeliveryEventMapper;
import com.heikeji.mall.delivery.service.DeliveryEventService;
import com.heikeji.mall.delivery.vo.DeliveryEventVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 配送事件服务实现
 */
@Service
public class DeliveryEventServiceImpl extends ServiceImpl<DeliveryEventMapper, DeliveryEvent> implements DeliveryEventService {

    @Autowired
    private DeliveryEventMapper deliveryEventMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addEvent(DeliveryEvent event) {
        // 设置默认值
        event.setEventTime(new Date());
        event.setCreateTime(new Date());
        event.setUpdateTime(new Date());
        event.setDeleted(0);
        return save(event);
    }

    @Override
    public List<DeliveryEvent> getEventsByOrderId(Long orderId) {
        return deliveryEventMapper.selectByOrderId(orderId);
    }

    @Override
    public List<DeliveryEventVO> getEventVOsByOrderId(Long orderId) {
        return deliveryEventMapper.selectEventVOByOrderId(orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordOrderCreateEvent(Long orderId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setEventType(1); // 订单创建
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordOrderAcceptEvent(Long orderId, Long deliveryUserId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(2); // 配送员接单
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordStartDeliveryEvent(Long orderId, Long deliveryUserId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(3); // 开始配送
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordCompleteDeliveryEvent(Long orderId, Long deliveryUserId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(4); // 完成配送
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordOrderCancelEvent(Long orderId, Long deliveryUserId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(5); // 订单取消
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordLocationUpdateEvent(Long orderId, Long deliveryUserId, Double longitude, Double latitude, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(6); // 位置更新
        event.setEventDesc(eventDesc);
        event.setLongitude(longitude);
        event.setLatitude(latitude);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordDelayEvent(Long orderId, Long deliveryUserId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(7); // 配送延迟
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean recordExceptionEvent(Long orderId, Long deliveryUserId, String eventDesc) {
        DeliveryEvent event = new DeliveryEvent();
        event.setOrderId(orderId);
        event.setDeliveryUserId(deliveryUserId);
        event.setEventType(8); // 异常事件
        event.setEventDesc(eventDesc);
        return addEvent(event);
    }
}
