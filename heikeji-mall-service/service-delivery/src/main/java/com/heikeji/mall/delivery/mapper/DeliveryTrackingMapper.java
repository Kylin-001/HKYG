package com.heikeji.mall.delivery.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.delivery.entity.DeliveryTracking;

/**
 * 配送跟踪Mapper
 */
public interface DeliveryTrackingMapper extends BaseMapper<DeliveryTracking> {

    /**
     * 根据订单ID查询配送跟踪信息
     */
    DeliveryTracking selectByOrderId(Long orderId);
}