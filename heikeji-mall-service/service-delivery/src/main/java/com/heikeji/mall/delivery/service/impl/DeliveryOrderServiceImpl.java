package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.delivery.constant.DeliveryConstant;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.mapper.DeliveryOrderMapper;
import com.heikeji.mall.delivery.service.DeliveryOrderService;
import com.heikeji.mall.delivery.service.DeliveryTrackingService;
import com.heikeji.mall.delivery.vo.DeliveryOrderDetailVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderListVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderStatusVO;
import com.heikeji.mall.delivery.vo.OrderAcceptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * 配送订单服务实现
 */
@Service
public class DeliveryOrderServiceImpl extends ServiceImpl<DeliveryOrderMapper, DeliveryOrder> implements DeliveryOrderService {

    @Autowired
    private DeliveryOrderMapper deliveryOrderMapper;
    
    @Autowired
    private DeliveryTrackingService deliveryTrackingService;

    /**
     * 创建配送订单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "deliveryAnalysis", allEntries = true)
    public DeliveryOrder createOrder(DeliveryOrder order) {
        // 设置默认值
        order.setOrderNo(generateOrderNo());
        order.setStatus(DeliveryConstant.OrderStatus.PENDING); // 待接单
        order.setCreateTime(new Date());
        order.setUpdateTime(new Date());
        
        // 保存订单
        if (!save(order)) {
            throw new BaseException("创建订单失败");
        }
        
        return order;
    }

    /**
     * 获取订单详情
     */
    @Override
    public DeliveryOrderDetailVO getOrderDetail(Long orderId) {
        DeliveryOrderDetailVO detail = deliveryOrderMapper.getOrderDetail(orderId);
        if (detail != null) {
            detail.setStatusText(getStatusText(detail.getStatus()));
        }
        return detail;
    }

    /**
     * 获取订单列表
     */
    @Override
    public List<DeliveryOrderListVO> getOrderList(Map<String, Object> params) {
        List<DeliveryOrderListVO> orderList = deliveryOrderMapper.getOrderList(params);
        // 设置状态文本
        for (DeliveryOrderListVO order : orderList) {
            order.setStatusText(getStatusText(order.getStatus()));
        }
        return orderList;
    }

    /**
     * 更新订单状态
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "deliveryAnalysis", allEntries = true)
    public boolean updateOrderStatus(Long orderId, Integer status) {
        DeliveryOrder order = getById(orderId);
        if (order == null) {
            throw new BaseException("订单不存在");
        }
        
        order.setStatus(status);
        order.setUpdateTime(new Date());
        
        return updateById(order);
    }

    /**
     * 配送员接单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "deliveryAnalysis", allEntries = true)
    public boolean acceptOrder(OrderAcceptRequest request) {
        // 查询订单
        DeliveryOrder order = getById(request.getOrderId());
        if (order == null) {
            throw new BaseException("订单不存在");
        }
        
        // 检查订单状态
        if (order.getStatus() != DeliveryConstant.OrderStatus.PENDING) {
            throw new BaseException("订单已被接单或已取消");
        }
        
        // 更新订单信息
        order.setStatus(DeliveryConstant.OrderStatus.ACCEPTED); // 已接单
        order.setDeliveryUserId(request.getDeliveryUserId());
        order.setAcceptTime(new Date());
        order.setUpdateTime(new Date());
        
        boolean result = updateById(order);
        
        // 创建配送跟踪记录
        if (result) {
            deliveryTrackingService.createTracking(request.getOrderId(), request.getDeliveryUserId());
            deliveryTrackingService.addTrackingEvent(request.getOrderId(), 2, "配送员已接单，正在前往取货地点");
        }
        
        return result;
    }

    /**
     * 开始配送
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "deliveryAnalysis", allEntries = true)
    public boolean startDelivery(Long orderId, Long deliveryUserId) {
        // 查询订单
        DeliveryOrder order = getById(orderId);
        if (order == null) {
            throw new BaseException("订单不存在");
        }
        
        // 检查订单状态和配送员
        if (order.getStatus() != DeliveryConstant.OrderStatus.ACCEPTED) {
            throw new BaseException("订单尚未接单");
        }
        if (!order.getDeliveryUserId().equals(deliveryUserId)) {
            throw new BaseException("无权操作此订单");
        }
        
        // 更新订单信息
        order.setStatus(DeliveryConstant.OrderStatus.DELIVERING); // 配送中
        order.setDeliveryStartTime(new Date());
        order.setUpdateTime(new Date());
        
        boolean result = updateById(order);
        
        // 更新配送跟踪状态
        if (result) {
            deliveryTrackingService.updateLocation(orderId, null, null, DeliveryConstant.OrderStatus.DELIVERING);
            deliveryTrackingService.addTrackingEvent(orderId, 3, "配送员已开始配送，正在前往送达地点");
        }
        
        return result;
    }

    /**
     * 完成配送
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "deliveryAnalysis", allEntries = true)
    public boolean completeDelivery(Long orderId) {
        // 查询订单
        DeliveryOrder order = getById(orderId);
        if (order == null) {
            throw new BaseException("订单不存在");
        }
        
        // 检查订单状态
        if (order.getStatus() != DeliveryConstant.OrderStatus.DELIVERING) {
            throw new BaseException("订单尚未开始配送");
        }
        
        // 更新订单信息
        order.setStatus(DeliveryConstant.OrderStatus.COMPLETED); // 已完成
        order.setDeliveryEndTime(new Date());
        order.setUpdateTime(new Date());
        
        boolean result = updateById(order);
        
        // 更新配送跟踪状态
        if (result) {
            deliveryTrackingService.updateLocation(orderId, null, null, DeliveryConstant.OrderStatus.COMPLETED);
            deliveryTrackingService.addTrackingEvent(orderId, 4, "配送已完成，感谢您的使用");
        }
        
        return result;
    }

    /**
     * 取消订单
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "deliveryAnalysis", allEntries = true)
    public boolean cancelOrder(Long orderId, String reason) {
        // 查询订单
        DeliveryOrder order = getById(orderId);
        if (order == null) {
            throw new BaseException("订单不存在");
        }
        
        // 检查订单状态
        if (order.getStatus() >= DeliveryConstant.OrderStatus.COMPLETED) {
            throw new BaseException("已完成的订单无法取消");
        }
        
        // 更新订单信息
        order.setStatus(DeliveryConstant.OrderStatus.CANCELLED); // 已取消
        order.setCancelReason(reason);
        order.setCancelTime(new Date());
        order.setUpdateTime(new Date());
        
        boolean result = updateById(order);
        
        // 更新配送跟踪状态（如果已存在）
        if (result && order.getDeliveryUserId() != null) {
            deliveryTrackingService.updateLocation(orderId, null, null, DeliveryConstant.OrderStatus.CANCELLED);
            deliveryTrackingService.addTrackingEvent(orderId, 5, "订单已取消：" + reason);
        }
        
        return result;
    }

    /**
     * 获取订单状态统计
     */
    @Override
    public DeliveryOrderStatusVO getOrderStatusCount(Map<String, Object> params) {
        return deliveryOrderMapper.getOrderStatusCount(params);
    }

    /**
     * 获取配送员待处理订单
     */
    @Override
    public List<DeliveryOrderListVO> getDeliveryPendingOrders(Long deliveryUserId) {
        List<DeliveryOrderListVO> orderList = deliveryOrderMapper.getDeliveryPendingOrders(deliveryUserId);
        // 设置状态文本
        for (DeliveryOrderListVO order : orderList) {
            order.setStatusText(getStatusText(order.getStatus()));
        }
        return orderList;
    }

    /**
     * 获取配送员历史订单
     */
    @Override
    public List<DeliveryOrderListVO> getDeliveryHistoryOrders(Long deliveryUserId, Map<String, Object> params) {
        List<DeliveryOrderListVO> orderList = deliveryOrderMapper.getDeliveryHistoryOrders(deliveryUserId, params);
        // 设置状态文本
        for (DeliveryOrderListVO order : orderList) {
            order.setStatusText(getStatusText(order.getStatus()));
        }
        return orderList;
    }

    /**
     * 根据订单号查询
     */
    public DeliveryOrder getByOrderNo(String orderNo) {
        return deliveryOrderMapper.getByOrderNo(orderNo);
    }

    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        StringBuilder orderNo = new StringBuilder();
        // 时间戳
        orderNo.append(System.currentTimeMillis());
        // 随机数
        Random random = new Random();
        orderNo.append(String.format("%04d", random.nextInt(10000)));
        return orderNo.toString();
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
}
