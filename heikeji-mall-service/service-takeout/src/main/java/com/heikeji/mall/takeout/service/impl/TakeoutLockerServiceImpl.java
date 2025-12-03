package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.TakeoutLocker;
import com.heikeji.mall.takeout.mapper.TakeoutLockerMapper;
import com.heikeji.mall.takeout.service.TakeoutLockerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 外卖柜服务实现类
 */
@Service
public class TakeoutLockerServiceImpl extends ServiceImpl<TakeoutLockerMapper, TakeoutLocker> implements TakeoutLockerService {

    @Autowired
    private TakeoutLockerMapper takeoutLockerMapper;

    @Override
    public List<TakeoutLocker> getAvailableLockers() {
        return takeoutLockerMapper.selectAvailableLockers("");
    }

    @Override
    public TakeoutLocker getLockerByCode(String lockerCode) {
        return takeoutLockerMapper.selectByLockerCode(lockerCode);
    }

    @Override
    public boolean occupySlot(String lockerCode) {
        TakeoutLocker locker = takeoutLockerMapper.selectByLockerCode(lockerCode);
        if (locker == null || locker.getAvailableSlots() <= 0) {
            return false;
        }
        
        // 减少空闲格子数量
        locker.setAvailableSlots(locker.getAvailableSlots() - 1);
        locker.setUpdateTime(new Date());
        
        return takeoutLockerMapper.updateById(locker) > 0;
    }

    @Override
    public boolean releaseSlot(String lockerCode) {
        TakeoutLocker locker = takeoutLockerMapper.selectByLockerCode(lockerCode);
        if (locker == null || locker.getAvailableSlots() >= locker.getTotalSlots()) {
            return false;
        }
        
        // 增加空闲格子数量
        locker.setAvailableSlots(locker.getAvailableSlots() + 1);
        locker.setUpdateTime(new Date());
        
        return takeoutLockerMapper.updateById(locker) > 0;
    }

    @Override
    public boolean updateLockerStatus(String lockerCode, Integer status) {
        TakeoutLocker locker = takeoutLockerMapper.selectByLockerCode(lockerCode);
        if (locker == null) {
            return false;
        }
        
        // 更新状态
        locker.setStatus(status);
        locker.setUpdateTime(new Date());
        
        // 如果是在线状态，更新最后在线时间
        if (status == 1) {
            locker.setLastOnlineTime(new Date());
        }
        
        return takeoutLockerMapper.updateById(locker) > 0;
    }

}