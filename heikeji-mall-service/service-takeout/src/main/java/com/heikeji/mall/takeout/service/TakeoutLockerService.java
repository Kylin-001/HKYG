package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.TakeoutLocker;

import java.util.List;

/**
 * 外卖柜服务接口
 */
public interface TakeoutLockerService extends IService<TakeoutLocker> {

    /**
     * 获取可用的外卖柜列表
     */
    List<TakeoutLocker> getAvailableLockers();

    /**
     * 根据编码获取外卖柜
     */
    TakeoutLocker getLockerByCode(String lockerCode);

    /**
     * 占用外卖柜格子
     */
    boolean occupySlot(String lockerCode);

    /**
     * 释放外卖柜格子
     */
    boolean releaseSlot(String lockerCode);

    /**
     * 更新外卖柜状态
     */
    boolean updateLockerStatus(String lockerCode, Integer status);

}