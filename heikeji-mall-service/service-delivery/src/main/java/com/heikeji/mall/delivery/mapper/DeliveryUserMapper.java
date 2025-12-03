package com.heikeji.mall.delivery.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.vo.DeliveryUserInfoVO;
import org.apache.ibatis.annotations.Param;

/**
 * 配送员Mapper
 */
public interface DeliveryUserMapper extends BaseMapper<DeliveryUser> {

    /**
     * 根据用户ID获取配送员信息
     */
    DeliveryUser getByUserId(@Param("userId") Long userId);

    /**
     * 获取配送员详情
     */
    DeliveryUserInfoVO getDeliveryUserInfo(@Param("deliveryUserId") Long deliveryUserId);

    /**
     * 更新配送员位置
     */
    int updateLocation(@Param("id") Long id,
                      @Param("latitude") Double latitude,
                      @Param("longitude") Double longitude);
}
