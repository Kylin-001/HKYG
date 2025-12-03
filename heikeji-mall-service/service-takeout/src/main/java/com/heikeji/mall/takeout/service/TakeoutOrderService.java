package com.heikeji.mall.takeout.service;

import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * 外卖订单服务接口
 */
public interface TakeoutOrderService extends TakeoutService {

    /**
     * 根据ID获取订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    TakeoutOrder getOrderDetail(Long orderId);

    /**
     * 获取用户订单列表
     * @param userId 用户ID
     * @return 订单列表
     */
    List<TakeoutOrder> getUserOrders(Long userId);

    /**
     * 取消订单
     * @param orderId 订单ID
     */
    void cancelOrder(Long orderId);
}