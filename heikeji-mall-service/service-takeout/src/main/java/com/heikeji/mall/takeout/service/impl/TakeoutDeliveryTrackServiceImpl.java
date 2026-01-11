package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.TakeoutDeliveryTrack;
import com.heikeji.mall.takeout.mapper.TakeoutDeliveryTrackMapper;
import com.heikeji.mall.takeout.service.TakeoutDeliveryTrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 外卖配送轨迹服务实现类
 */
@Service
public class TakeoutDeliveryTrackServiceImpl extends ServiceImpl<TakeoutDeliveryTrackMapper, TakeoutDeliveryTrack> implements TakeoutDeliveryTrackService {

    @Autowired
    private TakeoutDeliveryTrackMapper deliveryTrackMapper;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean createTrack(TakeoutDeliveryTrack track) {
        Date now = new Date();
        track.setCreateTime(now);
        track.setUpdateTime(now);
        return save(track);
    }

    @Override
    public List<TakeoutDeliveryTrack> getTracksByTakeoutOrderId(Long takeoutOrderId) {
        return deliveryTrackMapper.selectByTakeoutOrderId(takeoutOrderId);
    }

    @Override
    public List<TakeoutDeliveryTrack> getTracksByOrderNo(String orderNo) {
        return deliveryTrackMapper.selectByOrderNo(orderNo);
    }

    @Override
    public TakeoutDeliveryTrack getLatestTrackByTakeoutOrderId(Long takeoutOrderId) {
        return deliveryTrackMapper.selectLatestByTakeoutOrderId(takeoutOrderId);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean updateTrackStatus(Long takeoutOrderId, Integer status, String statusDesc) {
        // 获取最新轨迹
        TakeoutDeliveryTrack latestTrack = getLatestTrackByTakeoutOrderId(takeoutOrderId);
        if (latestTrack != null) {
            // 创建新的轨迹记录，记录状态变化
            TakeoutDeliveryTrack newTrack = new TakeoutDeliveryTrack();
            newTrack.setTakeoutOrderId(takeoutOrderId);
            newTrack.setOrderNo(latestTrack.getOrderNo());
            newTrack.setDeliveryPersonId(latestTrack.getDeliveryPersonId());
            newTrack.setDeliveryPersonName(latestTrack.getDeliveryPersonName());
            newTrack.setStatus(status);
            newTrack.setStatusDesc(statusDesc);
            newTrack.setLatitude(latestTrack.getLatitude());
            newTrack.setLongitude(latestTrack.getLongitude());
            newTrack.setLocationDesc(latestTrack.getLocationDesc());
            return createTrack(newTrack);
        }
        return false;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean updateTrackLocation(Long takeoutOrderId, Double latitude, Double longitude, String locationDesc) {
        // 获取最新轨迹
        TakeoutDeliveryTrack latestTrack = getLatestTrackByTakeoutOrderId(takeoutOrderId);
        if (latestTrack != null) {
            // 创建新的轨迹记录，记录位置变化
            TakeoutDeliveryTrack newTrack = new TakeoutDeliveryTrack();
            newTrack.setTakeoutOrderId(takeoutOrderId);
            newTrack.setOrderNo(latestTrack.getOrderNo());
            newTrack.setDeliveryPersonId(latestTrack.getDeliveryPersonId());
            newTrack.setDeliveryPersonName(latestTrack.getDeliveryPersonName());
            newTrack.setStatus(latestTrack.getStatus());
            newTrack.setStatusDesc(latestTrack.getStatusDesc());
            newTrack.setLatitude(latitude);
            newTrack.setLongitude(longitude);
            newTrack.setLocationDesc(locationDesc);
            return createTrack(newTrack);
        }
        return false;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean batchCreateTracks(List<TakeoutDeliveryTrack> tracks) {
        Date now = new Date();
        for (TakeoutDeliveryTrack track : tracks) {
            track.setCreateTime(now);
            track.setUpdateTime(now);
        }
        return saveBatch(tracks);
    }
}
