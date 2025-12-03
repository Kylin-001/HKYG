package com.heikeji.mall.takeout.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 外卖订单Mapper
 */
@Mapper
public interface TakeoutOrderMapper extends BaseMapper<TakeoutOrder> {
    /**
     * 查询已送达但超过指定时间未完成的订单
     * @param status 订单状态
     * @param hours 超过的小时数
     * @return 超时订单列表
     */
    List<TakeoutOrder> selectOverdueDeliveredOrders(@Param("status") Integer status, @Param("hours") Integer hours);
}