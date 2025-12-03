package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.delivery.constant.DeliveryConstant;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.entity.DeliveryTracking;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.mapper.DeliveryTrackingMapper;
import com.heikeji.mall.delivery.service.DeliveryOrderService;
import com.heikeji.mall.delivery.service.DeliveryTrackingService;
import com.heikeji.mall.delivery.service.DeliveryUserService;
import com.heikeji.mall.delivery.vo.DeliveryTrackingVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 配送跟踪服务实现
 */
@Service
public class DeliveryTrackingServiceImpl extends ServiceImpl<DeliveryTrackingMapper, DeliveryTracking> implements DeliveryTrackingService {

    @Autowired
    private DeliveryTrackingMapper deliveryTrackingMapper;
    
    @Autowired
    private DeliveryOrderService deliveryOrderService;
    
    @Autowired
    private DeliveryUserService deliveryUserService;

    @Override
    @Transactional
    public boolean createTracking(Long orderId, Long deliveryUserId) {
        // 检查订单是否存在
        DeliveryOrder order = deliveryOrderService.getById(orderId);
        if (order == null) {
            throw new BaseException("订单不存在");
        }
        
        // 检查配送员是否存在
        DeliveryUser deliveryUser = deliveryUserService.getById(deliveryUserId);
        if (deliveryUser == null) {
            throw new BaseException("配送员不存在");
        }
        
        // 检查是否已存在跟踪记录
        DeliveryTracking existing = deliveryTrackingMapper.selectByOrderId(orderId);
        if (existing != null) {
            return true; // 已存在则返回成功
        }
        
        // 创建新的跟踪记录
        DeliveryTracking tracking = new DeliveryTracking();
        tracking.setOrderId(orderId);
        tracking.setDeliveryUserId(deliveryUserId);
        tracking.setStatus(order.getStatus());
        tracking.setCreateTime(new Date());
        tracking.setUpdateTime(new Date());
        tracking.setDeleted(0);
        
        return save(tracking);
    }

    @Override
    @Transactional
    public boolean updateLocation(Long orderId, Double latitude, Double longitude, Integer status) {
        // 查找跟踪记录
        DeliveryTracking tracking = deliveryTrackingMapper.selectByOrderId(orderId);
        if (tracking == null) {
            throw new BaseException("配送跟踪记录不存在");
        }
        
        // 更新位置信息
        tracking.setLatitude(latitude);
        tracking.setLongitude(longitude);
        tracking.setLastUpdateTime(new Date());
        
        // 如果状态有变化，则更新状态
        if (status != null && !status.equals(tracking.getStatus())) {
            tracking.setStatus(status);
        }
        
        tracking.setUpdateTime(new Date());
        
        // 同时更新配送员的位置信息
        deliveryUserService.updateLocation(tracking.getDeliveryUserId(), latitude, longitude);
        
        return updateById(tracking);
    }

    @Override
    public DeliveryTrackingVO getTrackingByOrderId(Long orderId) {
        // 查询跟踪记录
        DeliveryTracking tracking = deliveryTrackingMapper.selectByOrderId(orderId);
        if (tracking == null) {
            return null;
        }
        
        // 构建返回对象
        DeliveryTrackingVO vo = new DeliveryTrackingVO();
        BeanUtils.copyProperties(tracking, vo);
        
        // 获取配送员信息
        DeliveryUser deliveryUser = deliveryUserService.getById(tracking.getDeliveryUserId());
        if (deliveryUser != null) {
            vo.setDeliveryUserName(deliveryUser.getName());
            vo.setDeliveryUserPhone(deliveryUser.getPhone());
        }
        
        // 设置状态文本
        vo.setStatusText(getStatusText(tracking.getStatus()));
        
        // 计算预计送达时间（简单实现：当前时间 + 30分钟）
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.MINUTE, 30);
        vo.setEstimatedArrivalTime(calendar.getTime());
        
        // 获取配送事件列表（这里简单模拟，实际应该从数据库查询）
        vo.setEvents(getDeliveryEvents(orderId));
        
        return vo;
    }

    @Override
    @Transactional
    public boolean addTrackingEvent(Long orderId, Integer eventType, String eventDesc) {
        // 在实际应用中，这里应该将事件记录到数据库
        // 这里简单返回成功，表示事件已记录
        return true;
    }
    
    /**
     * 获取状态文本
     */
    private String getStatusText(Integer status) {
        if (DeliveryConstant.OrderStatus.PENDING.equals(status)) {
            return "待接单";
        } else if (DeliveryConstant.OrderStatus.ACCEPTED.equals(status)) {
            return "已接单";
        } else if (DeliveryConstant.OrderStatus.DELIVERING.equals(status)) {
            return "配送中";
        } else if (DeliveryConstant.OrderStatus.COMPLETED.equals(status)) {
            return "已完成";
        } else if (DeliveryConstant.OrderStatus.CANCELLED.equals(status)) {
            return "已取消";
        } else {
            return "未知";
        }
    }
    
    /**
     * 获取配送事件列表（模拟实现）
     */
    private List<DeliveryTrackingVO.DeliveryEvent> getDeliveryEvents(Long orderId) {
        List<DeliveryTrackingVO.DeliveryEvent> events = new ArrayList<>();
        
        // 查询订单信息获取时间点
        DeliveryOrder order = deliveryOrderService.getById(orderId);
        if (order != null) {
            // 订单创建事件
            if (order.getCreateTime() != null) {
                DeliveryTrackingVO.DeliveryEvent createEvent = new DeliveryTrackingVO.DeliveryEvent();
                createEvent.setEventType(1);
                createEvent.setEventDesc("订单创建成功，等待配送员接单");
                createEvent.setEventTime(order.getCreateTime());
                events.add(createEvent);
            }
            
            // 订单接单事件
            if (order.getAcceptTime() != null) {
                DeliveryTrackingVO.DeliveryEvent acceptEvent = new DeliveryTrackingVO.DeliveryEvent();
                acceptEvent.setEventType(2);
                acceptEvent.setEventDesc("配送员已接单，正在前往取货地点");
                acceptEvent.setEventTime(order.getAcceptTime());
                events.add(acceptEvent);
            }
            
            // 开始配送事件
            if (order.getDeliveryStartTime() != null) {
                DeliveryTrackingVO.DeliveryEvent startEvent = new DeliveryTrackingVO.DeliveryEvent();
                startEvent.setEventType(3);
                startEvent.setEventDesc("配送员已开始配送，正在前往送达地点");
                startEvent.setEventTime(order.getDeliveryStartTime());
                events.add(startEvent);
            }
            
            // 完成配送事件
            if (order.getDeliveryEndTime() != null) {
                DeliveryTrackingVO.DeliveryEvent completeEvent = new DeliveryTrackingVO.DeliveryEvent();
                completeEvent.setEventType(4);
                completeEvent.setEventDesc("配送已完成，感谢您的使用");
                completeEvent.setEventTime(order.getDeliveryEndTime());
                events.add(completeEvent);
            }
            
            // 订单取消事件
            if (order.getCancelTime() != null) {
                DeliveryTrackingVO.DeliveryEvent cancelEvent = new DeliveryTrackingVO.DeliveryEvent();
                cancelEvent.setEventType(5);
                cancelEvent.setEventDesc("订单已取消：" + order.getCancelReason());
                cancelEvent.setEventTime(order.getCancelTime());
                events.add(cancelEvent);
            }
        }
        
        // 按时间排序
        events.sort(Comparator.comparing(DeliveryTrackingVO.DeliveryEvent::getEventTime));
        
        return events;
    }
}