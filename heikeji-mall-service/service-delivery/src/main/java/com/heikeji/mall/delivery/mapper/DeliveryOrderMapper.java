package com.heikeji.mall.delivery.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.vo.DeliveryOrderDetailVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderListVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderStatusVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 配送订单Mapper
 */
public interface DeliveryOrderMapper extends BaseMapper<DeliveryOrder> {

    /**
     * 获取订单详情
     */
    DeliveryOrderDetailVO getOrderDetail(@Param("orderId") Long orderId);

    /**
     * 获取订单列表
     */
    List<DeliveryOrderListVO> getOrderList(@Param("params") Map<String, Object> params);

    /**
     * 获取配送员待处理订单
     */
    List<DeliveryOrderListVO> getDeliveryPendingOrders(@Param("deliveryUserId") Long deliveryUserId);

    /**
     * 获取配送员历史订单
     */
    List<DeliveryOrderListVO> getDeliveryHistoryOrders(
        @Param("deliveryUserId") Long deliveryUserId,
        @Param("params") Map<String, Object> params
    );

    /**
     * 获取订单状态统计
     */
    DeliveryOrderStatusVO getOrderStatusCount(@Param("params") Map<String, Object> params);

    /**
     * 根据订单号查询
     */
    DeliveryOrder getByOrderNo(@Param("orderNo") String orderNo);
}
