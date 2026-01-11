package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.order.entity.OrderItem;

import java.util.List;

/**
 * 璁㈠崟鍟嗗搧鏄庣粏Mapper鎺ュ彛
 */
public interface OrderItemMapper extends BaseMapper<OrderItem> {
    /**
     * 根据订单号查询商品列表
     * @param orderNo 订单号
     * @return 商品列表
     */
    List<OrderItem> selectByOrderNo(String orderNo);
}
