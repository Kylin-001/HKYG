package com.heikeji.mall.delivery.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.vo.DeliveryUserInfoVO;

/**
 * 配送员服务接口
 */
public interface DeliveryUserService extends IService<DeliveryUser> {

    /**
     * 根据用户ID获取配送员信息
     */
    DeliveryUser getByUserId(Long userId);

    /**
     * 注册配送员
     */
    boolean register(DeliveryUser deliveryUser);

    /**
     * 验证配送员身份信息
     */
    boolean verifyIdentity(Long deliveryUserId, String realName, String idCard);

    /**
     * 更新配送员信息
     */
    boolean updateInfo(DeliveryUser deliveryUser);

    /**
     * 获取配送员详情
     */
    DeliveryUserInfoVO getDeliveryUserInfo(Long deliveryUserId);

    /**
     * 更新配送状态
     */
    boolean updateDeliveryStatus(Long deliveryUserId, Integer status);

    /**
     * 检查配送员是否已实名认证
     */
    boolean checkVerified(Long deliveryUserId);

    /**
     * 更新配送员位置
     */
    boolean updateLocation(Long deliveryUserId, Double latitude, Double longitude);
}
