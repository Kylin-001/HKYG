package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.mapper.DeliveryUserMapper;
import com.heikeji.mall.delivery.service.DeliveryUserService;
import com.heikeji.mall.delivery.vo.DeliveryUserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * 配送用户服务实现
 */
@Service
public class DeliveryUserServiceImpl extends ServiceImpl<DeliveryUserMapper, DeliveryUser> implements DeliveryUserService {

    @Autowired
    private DeliveryUserMapper deliveryUserMapper;

    @Override
    public DeliveryUser getByUserId(Long userId) {
        return deliveryUserMapper.getByUserId(userId);
    }

    @Override
    @Transactional
    public boolean register(DeliveryUser deliveryUser) {
        // 检查是否已经注册过配送员
        DeliveryUser existing = getByUserId(deliveryUser.getUserId());
        if (existing != null) {
            return false;
        }
        // 设置初始状态
        deliveryUser.setStatus(0); // 待审核
        return save(deliveryUser);
    }

    @Override
    @Transactional
    public boolean verifyIdentity(Long deliveryUserId, String realName, String idCard) {
        // 查询配送员信息
        DeliveryUser deliveryUser = getById(deliveryUserId);
        if (deliveryUser == null) {
            throw new BaseException("配送员不存在");
        }
        
        // 检查当前状态
        if (deliveryUser.getStatus() == 2) { // 审核失败
            // 重新提交审核
            deliveryUser.setStatus(0); // 待审核
        } else if (deliveryUser.getStatus() != 0 && deliveryUser.getStatus() != 3) {
            // 只有待审核和已禁用状态可以重新验证
            throw new BaseException("当前状态不允许验证身份");
        }
        
        // 更新身份信息
        deliveryUser.setName(realName);
        deliveryUser.setIdCard(idCard);
        deliveryUser.setUpdateTime(new Date());
        
        // 这里可以添加身份证信息的格式验证
        if (!isValidIdCard(idCard)) {
            throw new BaseException("身份证格式不正确");
        }
        
        return updateById(deliveryUser);
    }
    
    /**
     * 简单的身份证格式验证
     */
    private boolean isValidIdCard(String idCard) {
        // 18位身份证号码验证
        if (idCard == null || idCard.length() != 18) {
            return false;
        }
        // 验证是否全部是数字和最后一位可能是X
        return idCard.matches("^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$");
    }

    @Override
    @Transactional
    public boolean updateInfo(DeliveryUser deliveryUser) {
        return updateById(deliveryUser);
    }

    @Override
    public DeliveryUserInfoVO getDeliveryUserInfo(Long deliveryUserId) {
        // 简单实现，后续可以完善
        DeliveryUser user = getById(deliveryUserId);
        if (user != null) {
            DeliveryUserInfoVO vo = new DeliveryUserInfoVO();
            vo.setId(user.getId());
            vo.setUserId(user.getUserId());
            vo.setName(user.getName());
            vo.setPhone(user.getPhone());
            vo.setStatus(user.getStatus());
            return vo;
        }
        return null;
    }

    @Override
    @Transactional
    public boolean updateDeliveryStatus(Long deliveryUserId, Integer status) {
        DeliveryUser user = new DeliveryUser();
        user.setId(deliveryUserId);
        user.setStatus(status);
        return updateById(user);
    }

    @Override
    public boolean checkVerified(Long deliveryUserId) {
        DeliveryUser user = getById(deliveryUserId);
        return user != null && user.getStatus() == 1; // 1-已审核
    }

    @Override
    public boolean updateLocation(Long deliveryUserId, Double latitude, Double longitude) {
        // 简单实现，后续可以完善
        DeliveryUser user = new DeliveryUser();
        user.setId(deliveryUserId);
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        return updateById(user);
    }
}
