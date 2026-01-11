package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.TakeoutDeliveryTrack;

import java.util.List;

/**
 * 外卖配送轨迹服务接口
 */
public interface TakeoutDeliveryTrackService extends IService<TakeoutDeliveryTrack> {
    
    /**
     * 创建配送轨迹
     */
    boolean createTrack(TakeoutDeliveryTrack track);
    
    /**
     * 根据外卖订单ID查询配送轨迹
     */
    List<TakeoutDeliveryTrack> getTracksByTakeoutOrderId(Long takeoutOrderId);
    
    /**
     * 根据订单号查询配送轨迹
     */
    List<TakeoutDeliveryTrack> getTracksByOrderNo(String orderNo);
    
    /**
     * 获取最新的配送轨迹
     */
    TakeoutDeliveryTrack getLatestTrackByTakeoutOrderId(Long takeoutOrderId);
    
    /**
     * 更新配送轨迹状态
     */
    boolean updateTrackStatus(Long takeoutOrderId, Integer status, String statusDesc);
    
    /**
     * 更新配送位置
     */
    boolean updateTrackLocation(Long takeoutOrderId, Double latitude, Double longitude, String locationDesc);
    
    /**
     * 批量创建配送轨迹
     */
    boolean batchCreateTracks(List<TakeoutDeliveryTrack> tracks);
}
