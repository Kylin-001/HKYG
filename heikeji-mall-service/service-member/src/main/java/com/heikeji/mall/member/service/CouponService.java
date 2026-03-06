package com.heikeji.mall.member.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.member.dto.CouponDTO;
import com.heikeji.mall.member.dto.UserCouponDTO;
import com.heikeji.mall.member.entity.Coupon;

import java.util.List;

public interface CouponService extends IService<Coupon> {
    
    List<CouponDTO> getAvailableCoupons(Long userId);
    
    CouponDTO getCouponDetail(Long couponId, Long userId);
    
    boolean receiveCoupon(Long couponId, Long userId);
    
    List<UserCouponDTO> getUserCoupons(Long userId, Integer status);
    
    boolean useCoupon(Long userCouponId, String orderNo);
    
    boolean cancelCoupon(Long userCouponId, String orderNo);
}
