package com.heikeji.mall.takeout.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.takeout.entity.TakeoutDeliveryTrack;

import java.util.List;

/**
 * 外卖配送轨迹Mapper接口
 */
public interface TakeoutDeliveryTrackMapper extends BaseMapper<TakeoutDeliveryTrack> {
    
    /**
     * 根据外卖订单ID查询配送轨迹
     */
    List<TakeoutDeliveryTrack> selectByTakeoutOrderId(Long takeoutOrderId);
    
    /**
     * 根据订单号查询配送轨迹
     */
    List<TakeoutDeliveryTrack> selectByOrderNo(String orderNo);
    
    /**
     * 获取最新的配送轨迹记录
     */
    TakeoutDeliveryTrack selectLatestByTakeoutOrderId(Long takeoutOrderId);
}
