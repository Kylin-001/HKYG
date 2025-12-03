package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.OrderItem;

import java.util.List;

/**
 * 璁㈠崟鍟嗗搧鏄庣粏鏈嶅姟鎺ュ彛
 */
public interface OrderItemService extends IService<OrderItem> {
    
    /**
     * 鏍规嵁璁㈠崟ID鏌ヨ璁㈠崟鍟嗗搧鏄庣粏鍒楄〃
     * @param orderId 璁㈠崟ID
     * @return 璁㈠崟鍟嗗搧鏄庣粏鍒楄〃
     */
    List<OrderItem> getByOrderId(Long orderId);
    
    /**
     * 鏍规嵁璁㈠崟鍙锋煡璇㈣鍗曞晢鍝佹槑缁嗗垪琛?     * @param orderNo 璁㈠崟鍙?     * @return 璁㈠崟鍟嗗搧鏄庣粏鍒楄〃
     */
    List<OrderItem> getByOrderNo(String orderNo);
    
    /**
     * 鎵归噺淇濆瓨璁㈠崟鍟嗗搧鏄庣粏
     * @param orderItems 璁㈠崟鍟嗗搧鏄庣粏鍒楄〃
     * @return 鏄惁淇濆瓨鎴愬姛
     */
    boolean saveBatchOrderItems(List<OrderItem> orderItems);
}
