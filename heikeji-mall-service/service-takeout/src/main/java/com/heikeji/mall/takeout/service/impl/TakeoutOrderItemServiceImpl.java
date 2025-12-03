package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.TakeoutOrderItem;
import com.heikeji.mall.takeout.mapper.TakeoutOrderItemMapper;
import com.heikeji.mall.takeout.service.TakeoutOrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 外卖订单商品详情服务实现类
 */
@Service
public class TakeoutOrderItemServiceImpl extends ServiceImpl<TakeoutOrderItemMapper, TakeoutOrderItem> implements TakeoutOrderItemService {

    @Autowired
    private TakeoutOrderItemMapper takeoutOrderItemMapper;

    @Override
    public List<TakeoutOrderItem> getOrderItemsByOrderId(Long orderId) {
        return takeoutOrderItemMapper.selectByOrderId(orderId);
    }

    @Override
    public boolean saveBatchOrderItems(List<TakeoutOrderItem> orderItems) {
        // 设置创建时间和更新时间
        Date now = new Date();
        for (TakeoutOrderItem item : orderItems) {
            item.setCreateTime(now);
            item.setUpdateTime(now);
        }
        
        // 批量保存
        return saveBatch(orderItems);
    }

}