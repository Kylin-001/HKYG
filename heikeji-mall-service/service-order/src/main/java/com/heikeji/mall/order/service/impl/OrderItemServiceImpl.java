package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.entity.OrderItem;
import com.heikeji.mall.order.mapper.OrderItemMapper;
import com.heikeji.mall.order.service.OrderItemService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 璁㈠崟鍟嗗搧鏄庣粏鏈嶅姟瀹炵幇绫? */
@Service
public class OrderItemServiceImpl extends ServiceImpl<OrderItemMapper, OrderItem> implements OrderItemService {

    /**
     * 鏍规嵁璁㈠崟ID鏌ヨ璁㈠崟鍟嗗搧鏄庣粏鍒楄〃
     */
    @Override
    public List<OrderItem> getByOrderId(Long orderId) {
        QueryWrapper<OrderItem> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id", orderId);
        return this.list(queryWrapper);
    }

    /**
     * 鏍规嵁璁㈠崟鍙锋煡璇㈣鍗曞晢鍝佹槑缁嗗垪琛?     */
    @Override
    public List<OrderItem> getByOrderNo(String orderNo) {
        QueryWrapper<OrderItem> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo);
        return this.list(queryWrapper);
    }

    /**
     * 鎵归噺淇濆瓨璁㈠崟鍟嗗搧鏄庣粏
     */
    @Override
    public boolean saveBatchOrderItems(List<OrderItem> orderItems) {
        return this.saveBatch(orderItems);
    }
}
