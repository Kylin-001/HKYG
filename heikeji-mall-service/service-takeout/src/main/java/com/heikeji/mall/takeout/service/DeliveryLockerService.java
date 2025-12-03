package com.heikeji.mall.takeout.service;

import com.heikeji.mall.takeout.entity.DeliveryLocker;
import java.util.List;

/**
 * 外卖柜服务接口
 */
public interface DeliveryLockerService {
    
    /**
     * 获取所有可用的外卖柜
     * @return 外卖柜列表
     */
    List<DeliveryLocker> getAvailableLockers();
    
    /**
     * 根据编码查询外卖柜
     * @param lockerCode 外卖柜编码
     * @return 外卖柜
     */
    DeliveryLocker getByCode(String lockerCode);
    
    /**
     * 分配柜口
     * @param lockerCode 外卖柜编码
     * @return 柜口号
     */
    String allocateCell(String lockerCode);
    
    /**
     * 释放柜口
     * @param lockerCode 外卖柜编码
     * @param cellNo 柜口号
     * @return 是否成功
     */
    Boolean releaseCell(String lockerCode, String cellNo);

    /** 新增外卖柜 */
    boolean create(DeliveryLocker locker);

    /** 编辑外卖柜 */
    boolean update(DeliveryLocker locker);
}