package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.TakeoutOrderItem;

import java.util.List;

/**
 * 外卖订单商品详情服务接口
 */
public interface TakeoutOrderItemService extends IService<TakeoutOrderItem> {

    /**
     * 根据订单ID获取订单商品列表
     */
    List<TakeoutOrderItem> getOrderItemsByOrderId(Long orderId);

    /**
     * 批量保存订单商品
     */
    boolean saveBatchOrderItems(List<TakeoutOrderItem> orderItems);

}