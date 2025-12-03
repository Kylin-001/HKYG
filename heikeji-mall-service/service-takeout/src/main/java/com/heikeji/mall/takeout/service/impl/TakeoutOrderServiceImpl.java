package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.service.TakeoutOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 外卖订单服务实现类（保持向后兼容性）
 */
@Service
public class TakeoutOrderServiceImpl extends TakeoutServiceImpl implements TakeoutOrderService {

    @Override
    public TakeoutOrder getOrderDetail(Long orderId) {
        return super.getTakeoutOrderById(orderId);
    }

    @Override
    public List<TakeoutOrder> getUserOrders(Long userId) {
        return super.getUserTakeoutOrders(userId, null);
    }

    @Override
    public void cancelOrder(Long orderId) {
        // 这里userId为null，需要在TakeoutServiceImpl中处理
        super.cancelOrder(orderId, null);
    }
}