package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.entity.DeliveryLocker;

import java.util.List;
import java.util.Map;

/**
 * 外卖服务接口
 */
public interface TakeoutService extends IService<TakeoutOrder> {
    
    /**
     * 创建外卖订单
     */
    TakeoutOrder createTakeoutOrder(CreateTakeoutOrderDTO order);
    
    /**
     * 获取外卖订单详情
     */
    TakeoutOrder getTakeoutOrderById(Long id);
    
    /**
     * 获取用户的外卖订单列表
     */
    List<TakeoutOrder> getUserTakeoutOrders(Long userId, Integer status);
    
    /**
     * 更新外卖订单状态
     */
    boolean updateOrderStatus(Long orderId, Integer status);
    
    /**
     * 取消外卖订单
     */
    boolean cancelOrder(Long orderId, Long userId);
    
    /**
     * 配送员接单
     */
    boolean acceptOrder(Long orderId, Long deliveryPersonId);
    
    /**
     * 更新订单配送信息
     */
    boolean updateDeliveryInfo(Long orderId, Long deliveryPersonId, String deliveryPersonName, String deliveryPersonPhone);
    
    /**
     * 标记订单已送达
     */
    boolean markAsDelivered(Long orderId);
    
    /**
     * 获取可用的外卖柜列表
     */
    List<DeliveryLocker> getAvailableLockers();
    
    /**
     * 根据编码获取外卖柜
     */
    DeliveryLocker getLockerByCode(String lockerCode);
    
    /**
     * 占用外卖柜格子
     */
    boolean occupyLockerCell(String lockerCode);
    
    /**
     * 释放外卖柜格子
     */
    boolean releaseLockerCell(String lockerCode);
    
    /**
     * 创建支付订单
     */
    Map<String, Object> createPayment(Long orderId, Integer paymentMethod);
    
    /**
     * 处理支付回调
     */
    boolean handlePaymentCallback(Map<String, String> callbackParams);
    
    /**
     * 查询支付状态
     */
    Integer queryPaymentStatus(Long orderId);
    
    /**
     * 更新支付状态
     */
    boolean updatePaymentStatus(Long orderId, Integer paymentStatus, String paymentNo, String transactionId);
    
    /**
     * 获取商家订单列表
     */
    List<TakeoutOrder> getMerchantOrders(Long merchantId);
    
    /**
     * 完成订单
     */
    boolean completeOrder(Long orderId);
    
    /**
     * 申请退款
     */
    boolean applyRefund(Long orderId, String reason);
    
    /**
     * 获取订单统计信息
     */
    Map<String, Object> getOrderStatistics(Long merchantId);
    
    /**
     * 释放超时占用的外卖柜
     */
    Integer releaseTimeoutLockers(Integer hours);
}