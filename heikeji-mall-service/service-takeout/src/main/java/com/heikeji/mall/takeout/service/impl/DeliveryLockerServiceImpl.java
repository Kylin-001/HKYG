package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.constants.TakeoutConstants;
import com.heikeji.mall.takeout.entity.DeliveryLocker;
import com.heikeji.mall.takeout.exception.TakeoutException;
import com.heikeji.mall.takeout.mapper.DeliveryLockerMapper;
import com.heikeji.mall.takeout.service.DeliveryLockerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 外卖柜服务实现类
 */
@Service
public class DeliveryLockerServiceImpl extends ServiceImpl<DeliveryLockerMapper, DeliveryLocker> implements DeliveryLockerService {

    @Autowired
    private DeliveryLockerMapper deliveryLockerMapper;

    public List<DeliveryLocker> getAllDeliveryLockers() {
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByAsc(DeliveryLocker::getCampusArea);
        return deliveryLockerMapper.selectList(queryWrapper);
    }

    public List<DeliveryLocker> getAvailableDeliveryLockers() {
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getStatus, 1); // 状态为可用
        queryWrapper.gt(DeliveryLocker::getAvailableCount, 0); // 可用格口数大于0
        return deliveryLockerMapper.selectList(queryWrapper);
    }

    public List<DeliveryLocker> getDeliveryLockersByCampusId(Long campusId) {
        if (campusId == null) {
            throw new IllegalArgumentException("校区ID不能为空");
        }
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getCampusArea, campusId);
        return deliveryLockerMapper.selectList(queryWrapper);
    }

    @Override
    public DeliveryLocker getByCode(String lockerCode) {
        if (lockerCode == null || lockerCode.trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜编码不能为空");
        }
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, lockerCode);
        DeliveryLocker locker = deliveryLockerMapper.selectOne(queryWrapper);
        if (locker == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "外卖柜不存在");
        }
        return locker;
    }

    public DeliveryLocker getDeliveryLockerById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("外卖柜ID不能为空");
        }
        DeliveryLocker locker = deliveryLockerMapper.selectById(id);
        if (locker == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "外卖柜不存在");
        }
        return locker;
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateDeliveryLockerStatus(Long id, Integer status) {
        if (id == null) {
            throw new IllegalArgumentException("外卖柜ID不能为空");
        }
        if (status == null || (status != 1 && status != 0)) {
            throw new IllegalArgumentException("无效的状态值，状态必须为0（禁用）或1（可用）");
        }
        
        DeliveryLocker locker = deliveryLockerMapper.selectById(id);
        if (locker == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "外卖柜不存在");
        }
        
        locker.setStatus(status);
        deliveryLockerMapper.updateById(locker);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean occupySlot(String lockerCode) {
        if (lockerCode == null || lockerCode.trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜编码不能为空");
        }
        
        // 获取外卖柜信息
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, lockerCode);
        DeliveryLocker locker = deliveryLockerMapper.selectOne(queryWrapper);
        
        if (locker == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "外卖柜不存在");
        }
        
        // 检查状态
        if (locker.getStatus() != 1) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "外卖柜当前不可用");
        }
        
        // 检查是否有可用格口
        if (locker.getAvailableCount() <= 0) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "外卖柜无可用格口");
        }
        
        // 占用格口
        locker.setAvailableCount(locker.getAvailableCount() - 1);
        deliveryLockerMapper.updateById(locker);
        
        return true;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean releaseSlot(String lockerCode) {
        if (lockerCode == null || lockerCode.trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜编码不能为空");
        }
        
        // 获取外卖柜信息
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, lockerCode);
        DeliveryLocker locker = deliveryLockerMapper.selectOne(queryWrapper);
        
        if (locker == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "外卖柜不存在");
        }
        
        // 检查是否有被占用的格口
        if (locker.getAvailableCount() >= locker.getTotalCells()) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "无格口需要释放");
        }
        
        // 释放格口
        locker.setAvailableCount(locker.getAvailableCount() + 1);
        deliveryLockerMapper.updateById(locker);
        
        return true;
    }
    
    @Override
    public Boolean releaseCell(String lockerCode, String cellNo) {
        // 实现简单的格口释放逻辑
        return releaseSlot(lockerCode);
    }
    
    @Override
    public List<DeliveryLocker> getAvailableLockers() {
        // 复用现有的可用外卖柜查询逻辑
        return getAvailableDeliveryLockers();
    }
    
    @Override
    public String allocateCell(String lockerCode) {
        // 实现简单的格口分配逻辑
        boolean success = occupySlot(lockerCode);
        if (success) {
            return "1"; // 返回格口号，这里简单返回"1"
        }
        return null;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean create(DeliveryLocker locker) {
        if (locker == null) {
            throw new IllegalArgumentException("外卖柜信息不能为空");
        }
        
        // 验证必填字段
        validateLockerInfo(locker);
        
        // 检查编码是否已存在
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, locker.getLockerCode());
        if (deliveryLockerMapper.selectCount(queryWrapper) > 0) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "外卖柜编码已存在");
        }
        
        // 初始化可用格口数
        locker.setAvailableCount(locker.getTotalCells());
        
        deliveryLockerMapper.insert(locker);
        return true;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean update(DeliveryLocker locker) {
        if (locker == null || locker.getId() == null) {
            throw new IllegalArgumentException("外卖柜ID不能为空");
        }
        
        // 验证必填字段
        validateLockerInfo(locker);
        
        // 检查是否存在
        DeliveryLocker existingLocker = deliveryLockerMapper.selectById(locker.getId());
        if (existingLocker == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "外卖柜不存在");
        }
        
        // 检查编码是否与其他外卖柜冲突
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, locker.getLockerCode());
        queryWrapper.ne(DeliveryLocker::getId, locker.getId());
        if (deliveryLockerMapper.selectCount(queryWrapper) > 0) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "外卖柜编码已存在");
        }
        
        // 处理格口数量更新
        if (locker.getTotalCells() > existingLocker.getTotalCells()) {
            // 增加了总格口数，相应增加可用格口数
            int addedCells = locker.getTotalCells() - existingLocker.getTotalCells();
            locker.setAvailableCount(existingLocker.getAvailableCount() + addedCells);
        } else if (locker.getTotalCells() < existingLocker.getTotalCells()) {
            // 减少了总格口数，确保可用格口数不超过新的总格口数
            locker.setAvailableCount(Math.min(existingLocker.getAvailableCount(), locker.getTotalCells()));
        } else {
            // 总格口数不变，保持原有可用格口数
            locker.setAvailableCount(existingLocker.getAvailableCount());
        }
        
        deliveryLockerMapper.updateById(locker);
        return true;
    }

    // 移除未在接口中定义的deleteDeliveryLocker方法

    /**
     * 验证外卖柜信息
     */
    private void validateLockerInfo(DeliveryLocker locker) {
        if (locker.getLockerCode() == null || locker.getLockerCode().trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜编码不能为空");
        }
        if (locker.getName() == null || locker.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜名称不能为空");
        }
        if (locker.getLocation() == null || locker.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜位置不能为空");
        }
        if (locker.getCampusArea() == null || locker.getCampusArea().trim().isEmpty()) {
            throw new IllegalArgumentException("校区不能为空");
        }
        if (locker.getTotalCells() == null || locker.getTotalCells() <= 0) {
            throw new IllegalArgumentException("总格口数必须大于0");
        }
    }
}