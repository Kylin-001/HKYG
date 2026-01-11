package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.DeliveryLocker;
import java.util.List;
import java.util.Map;

/**
 * 外卖柜服务接口
 */
public interface DeliveryLockerService extends IService<DeliveryLocker> {
    
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

    /** 删除外卖柜 */
    boolean delete(Long id);

    /** 批量删除外卖柜 */
    boolean batchDelete(List<Long> ids);

    /** 更新外卖柜状态 */
    boolean updateStatus(Long id, Integer status);

    /** 根据ID获取外卖柜详情 */
    DeliveryLocker getById(Long id);

    /** 根据校区获取外卖柜 */
    List<DeliveryLocker> getByCampusArea(String campusArea);

    /** 获取外卖柜统计信息 */
    Map<String, Object> getLockerStats();

    /** 批量更新外卖柜状态 */
    boolean batchUpdateStatus(List<Long> ids, Integer status);
}