package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.entity.Coupon;
import com.heikeji.mall.order.entity.UserCoupon;
import com.heikeji.mall.order.mapper.CouponMapper;
import com.heikeji.mall.order.mapper.UserCouponMapper;
import com.heikeji.mall.order.service.CouponService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 优惠券服务实现类
 */
@Slf4j
@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {
    
    @Autowired
    private CouponMapper couponMapper;
    
    @Autowired
    private UserCouponMapper userCouponMapper;
    
    /**
     * 根据优惠券码查询优惠券
     */
    @Override
    public Coupon getByCode(String couponCode) {
        QueryWrapper<Coupon> wrapper = new QueryWrapper<>();
        wrapper.eq("coupon_code", couponCode);
        return couponMapper.selectOne(wrapper);
    }
    
    /**
     * 获取用户可用的优惠券列表
     */
    @Override
    public List<Coupon> getAvailableCoupons(Long userId, BigDecimal amount) {
        // 查询用户未使用的优惠券
        QueryWrapper<UserCoupon> userCouponWrapper = new QueryWrapper<>();
        userCouponWrapper.eq("user_id", userId)
                        .eq("status", 0);
        List<UserCoupon> userCoupons = userCouponMapper.selectList(userCouponWrapper);
        
        // 如果用户没有优惠券，返回空列表
        if (userCoupons.isEmpty()) {
            return List.of();
        }
        
        // 提取优惠券ID列表
        List<Long> couponIds = userCoupons.stream()
                                         .map(UserCoupon::getCouponId)
                                         .toList();
        
        // 查询优惠券详情
        QueryWrapper<Coupon> couponWrapper = new QueryWrapper<>();
        couponWrapper.in("id", couponIds)
                     .eq("status", 0) // 优惠券状态正常
                     .le("min_amount", amount) // 满足最低使用金额
                     .le("start_time", new Date()) // 优惠券已开始
                     .ge("end_time", new Date()); // 优惠券未结束
        
        return couponMapper.selectList(couponWrapper);
    }
    
    /**
     * 应用优惠券计算优惠后的金额
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public BigDecimal applyCoupon(BigDecimal originalAmount, String couponCode, Long userId) {
        // 查找优惠券
        Coupon coupon = getByCode(couponCode);
        if (coupon == null) {
            log.error("优惠券不存在: {}", couponCode);
            throw new RuntimeException("优惠券不存在");
        }
        
        // 检查优惠券是否可用
        if (!isCouponAvailable(coupon, userId, originalAmount)) {
            log.error("优惠券不可用: {}", couponCode);
            throw new RuntimeException("优惠券不可用");
        }
        
        // 根据优惠券类型计算优惠后的金额
        BigDecimal discountedAmount = originalAmount;
        if (coupon.getType() == 1) { // 满减券
            discountedAmount = originalAmount.subtract(coupon.getValue());
            // 确保优惠后金额不小于0
            if (discountedAmount.compareTo(BigDecimal.ZERO) < 0) {
                discountedAmount = BigDecimal.ZERO;
            }
        } else if (coupon.getType() == 2) { // 折扣券
            discountedAmount = originalAmount.multiply(coupon.getDiscount()).divide(BigDecimal.TEN, 2, BigDecimal.ROUND_HALF_UP);
        }
        
        return discountedAmount;
    }
    
    /**
     * 使用优惠券
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean useCoupon(String couponCode, Long userId, String orderNo) {
        // 查找优惠券
        Coupon coupon = getByCode(couponCode);
        if (coupon == null) {
            log.error("优惠券不存在: {}", couponCode);
            return false;
        }
        
        // 检查优惠券是否可用
        if (!isCouponAvailable(coupon, userId, null)) {
            log.error("优惠券不可用: {}", couponCode);
            return false;
        }
        
        // 查找用户优惠券
        QueryWrapper<UserCoupon> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId)
                .eq("coupon_id", coupon.getId())
                .eq("status", 0);
        UserCoupon userCoupon = userCouponMapper.selectOne(wrapper);
        
        if (userCoupon == null) {
            log.error("用户没有该优惠券: userId={}, couponId={}", userId, coupon.getId());
            return false;
        }
        
        // 更新用户优惠券状态为已使用
        userCoupon.setStatus(1);
        userCoupon.setUsedAt(new Date());
        userCoupon.setUpdatedAt(new Date());
        int userCouponResult = userCouponMapper.updateById(userCoupon);
        
        // 更新优惠券已使用数量
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        int couponResult = couponMapper.updateById(coupon);
        
        return userCouponResult > 0 && couponResult > 0;
    }
    
    /**
     * 返还优惠券
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean returnCoupon(String orderNo) {
        // 查找订单使用的优惠券
        // 假设订单表中有coupon_code字段
        // 实际项目中需要根据订单号查询使用的优惠券
        // 这里简化处理
        return true;
    }
    
    /**
     * 获取用户优惠券
     */
    @Override
    public UserCoupon getUserCoupon(Long userId, Long couponId) {
        QueryWrapper<UserCoupon> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId)
                .eq("coupon_id", couponId);
        return userCouponMapper.selectOne(wrapper);
    }
    
    /**
     * 检查优惠券是否可用
     */
    private boolean isCouponAvailable(Coupon coupon, Long userId, BigDecimal amount) {
        // 检查优惠券状态
        if (coupon.getStatus() != 0) {
            log.error("优惠券已失效: {}", coupon.getId());
            return false;
        }
        
        // 检查优惠券有效期
        Date now = new Date();
        if (coupon.getStartTime().after(now) || coupon.getEndTime().before(now)) {
            log.error("优惠券不在有效期内: {}", coupon.getId());
            return false;
        }
        
        // 检查用户是否有该优惠券且未使用
        QueryWrapper<UserCoupon> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId)
                .eq("coupon_id", coupon.getId())
                .eq("status", 0);
        UserCoupon userCoupon = userCouponMapper.selectOne(wrapper);
        if (userCoupon == null) {
            log.error("用户没有该优惠券或已使用: userId={}, couponId={}", userId, coupon.getId());
            return false;
        }
        
        // 检查是否满足最低使用金额
        if (amount != null && coupon.getMinAmount().compareTo(amount) > 0) {
            log.error("订单金额不满足优惠券最低使用金额: orderAmount={}, minAmount={}", amount, coupon.getMinAmount());
            return false;
        }
        
        return true;
    }
}