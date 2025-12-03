package com.heikeji.mall.takeout.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.takeout.entity.TakeoutOrderItem;

import java.util.List;

/**
 * 外卖订单商品详情Mapper接口
 */
public interface TakeoutOrderItemMapper extends BaseMapper<TakeoutOrderItem> {

    /**
     * 根据订单ID查询订单商品列表
     */
    List<TakeoutOrderItem> selectByOrderId(Long orderId);

    /**
     * 根据商品ID查询销售记录
     */
    List<TakeoutOrderItem> selectByProductId(Long productId);

}