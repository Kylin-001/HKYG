package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.Coupon;
import com.heikeji.mall.order.entity.UserCoupon;

import java.math.BigDecimal;
import java.util.List;

/**
 * 优惠券服务接口
 */
public interface CouponService extends IService<Coupon> {
    
    /**
     * 根据优惠券码查询优惠券
     * @param couponCode 优惠券码
     * @return 优惠券信息
     */
    Coupon getByCode(String couponCode);
    
    /**
     * 获取用户可用的优惠券列表
     * @param userId 用户ID
     * @param amount 订单金额
     * @return 可用优惠券列表
     */
    List<Coupon> getAvailableCoupons(Long userId, BigDecimal amount);
    
    /**
     * 应用优惠券计算优惠后的金额
     * @param originalAmount 原始金额
     * @param couponCode 优惠券码
     * @param userId 用户ID
     * @return 优惠后的金额
     */
    BigDecimal applyCoupon(BigDecimal originalAmount, String couponCode, Long userId);
    
    /**
     * 使用优惠券
     * @param couponCode 优惠券码
     * @param userId 用户ID
     * @param orderNo 订单号
     * @return 是否使用成功
     */
    boolean useCoupon(String couponCode, Long userId, String orderNo);
    
    /**
     * 返还优惠券
     * @param orderNo 订单号
     * @return 是否返还成功
     */
    boolean returnCoupon(String orderNo);
    
    /**
     * 获取用户优惠券
     * @param userId 用户ID
     * @param couponId 优惠券ID
     * @return 用户优惠券
     */
    UserCoupon getUserCoupon(Long userId, Long couponId);
}