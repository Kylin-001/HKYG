package com.heikeji.mall.delivery.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.vo.DeliveryOrderDetailVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderListVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderStatusVO;
import com.heikeji.mall.delivery.vo.OrderAcceptRequest;

import java.util.List;
import java.util.Map;

/**
 * 配送订单服务接口
 */
public interface DeliveryOrderService extends IService<DeliveryOrder> {

    /**
     * 创建配送订单
     */
    DeliveryOrder createOrder(DeliveryOrder order);

    /**
     * 获取订单详情
     */
    DeliveryOrderDetailVO getOrderDetail(Long orderId);

    /**
     * 获取订单列表
     */
    List<DeliveryOrderListVO> getOrderList(Map<String, Object> params);

    /**
     * 更新订单状态
     */
    boolean updateOrderStatus(Long orderId, Integer status);

    /**
     * 配送员接单
     */
    boolean acceptOrder(OrderAcceptRequest request);

    /**
     * 开始配送
     */
    boolean startDelivery(Long orderId, Long deliveryUserId);

    /**
     * 完成配送
     */
    boolean completeDelivery(Long orderId);

    /**
     * 取消订单
     */
    boolean cancelOrder(Long orderId, String reason);

    /**
     * 获取订单状态统计
     */
    DeliveryOrderStatusVO getOrderStatusCount(Map<String, Object> params);

    /**
     * 获取配送员待处理订单
     */
    List<DeliveryOrderListVO> getDeliveryPendingOrders(Long deliveryUserId);

    /**
     * 获取配送员历史订单
     */
    List<DeliveryOrderListVO> getDeliveryHistoryOrders(Long deliveryUserId, Map<String, Object> params);
}
