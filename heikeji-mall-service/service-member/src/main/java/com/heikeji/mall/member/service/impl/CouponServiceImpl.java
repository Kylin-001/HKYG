package com.heikeji.mall.member.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.member.dto.CouponDTO;
import com.heikeji.mall.member.dto.UserCouponDTO;
import com.heikeji.mall.member.entity.Coupon;
import com.heikeji.mall.member.entity.UserCoupon;
import com.heikeji.mall.member.mapper.CouponMapper;
import com.heikeji.mall.member.mapper.UserCouponMapper;
import com.heikeji.mall.member.service.CouponService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {

    @Autowired
    private UserCouponMapper userCouponMapper;

    @Override
    public List<CouponDTO> getAvailableCoupons(Long userId) {
        LambdaQueryWrapper<Coupon> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Coupon::getStatus, 0)
                .le(Coupon::getStartTime, LocalDateTime.now())
                .ge(Coupon::getEndTime, LocalDateTime.now())
                .orderByDesc(Coupon::getCreateTime);

        List<Coupon> coupons = list(wrapper);

        return coupons.stream().map(coupon -> {
            CouponDTO dto = new CouponDTO();
            BeanUtils.copyProperties(coupon, dto);

            LambdaQueryWrapper<UserCoupon> userCouponWrapper = new LambdaQueryWrapper<>();
            userCouponWrapper.eq(UserCoupon::getUserId, userId)
                    .eq(UserCoupon::getCouponId, coupon.getId())
                    .in(UserCoupon::getStatus, 0, 1);
            Long userReceivedCount = userCouponMapper.selectCount(userCouponWrapper);

            dto.setUserReceivedCount(userReceivedCount.intValue());
            dto.setCanReceive(userReceivedCount < coupon.getPerUserLimit() && 
                             coupon.getUsedCount() < coupon.getTotalCount());

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public CouponDTO getCouponDetail(Long couponId, Long userId) {
        Coupon coupon = getById(couponId);
        if (coupon == null) {
            throw new RuntimeException("优惠券不存在");
        }

        CouponDTO dto = new CouponDTO();
        BeanUtils.copyProperties(coupon, dto);

        LambdaQueryWrapper<UserCoupon> userCouponWrapper = new LambdaQueryWrapper<>();
        userCouponWrapper.eq(UserCoupon::getUserId, userId)
                .eq(UserCoupon::getCouponId, couponId)
                .in(UserCoupon::getStatus, 0, 1);
        Long userReceivedCount = userCouponMapper.selectCount(userCouponWrapper);

        dto.setUserReceivedCount(userReceivedCount.intValue());
        dto.setCanReceive(userReceivedCount < coupon.getPerUserLimit() && 
                         coupon.getUsedCount() < coupon.getTotalCount());

        return dto;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean receiveCoupon(Long couponId, Long userId) {
        Coupon coupon = getById(couponId);
        if (coupon == null) {
            throw new RuntimeException("优惠券不存在");
        }

        if (coupon.getStatus() != 0) {
            throw new RuntimeException("优惠券已失效");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartTime()) || now.isAfter(coupon.getEndTime())) {
            throw new RuntimeException("优惠券不在领取时间范围内");
        }

        if (coupon.getUsedCount() >= coupon.getTotalCount()) {
            throw new RuntimeException("优惠券已领完");
        }

        LambdaQueryWrapper<UserCoupon> userCouponWrapper = new LambdaQueryWrapper<>();
        userCouponWrapper.eq(UserCoupon::getUserId, userId)
                .eq(UserCoupon::getCouponId, couponId)
                .in(UserCoupon::getStatus, 0, 1);
        Long userReceivedCount = userCouponMapper.selectCount(userCouponWrapper);

        if (userReceivedCount >= coupon.getPerUserLimit()) {
            throw new RuntimeException("已达到领取上限");
        }

        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUserId(userId);
        userCoupon.setCouponId(couponId);
        userCoupon.setStatus(0);
        userCouponMapper.insert(userCoupon);

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        updateById(coupon);

        log.info("用户{}领取优惠券{}成功", userId, couponId);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean useCoupon(Long userCouponId, String orderNo) {
        UserCoupon userCoupon = userCouponMapper.selectById(userCouponId);
        if (userCoupon == null) {
            throw new RuntimeException("用户优惠券不存在");
        }

        if (userCoupon.getStatus() != 0) {
            throw new RuntimeException("优惠券不可用");
        }

        Coupon coupon = getById(userCoupon.getCouponId());
        if (coupon == null || coupon.getStatus() != 0) {
            throw new RuntimeException("优惠券已失效");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartTime()) || now.isAfter(coupon.getEndTime())) {
            throw new RuntimeException("优惠券不在使用时间范围内");
        }

        userCoupon.setStatus(1);
        userCoupon.setUsedAt(now);
        userCoupon.setOrderNo(orderNo);
        userCouponMapper.updateById(userCoupon);

        log.info("用户{}使用优惠券{}成功，订单号：{}", userCoupon.getUserId(), userCouponId, orderNo);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancelCoupon(Long userCouponId, String orderNo) {
        UserCoupon userCoupon = userCouponMapper.selectById(userCouponId);
        if (userCoupon == null) {
            throw new RuntimeException("用户优惠券不存在");
        }

        if (userCoupon.getStatus() != 1) {
            throw new RuntimeException("优惠券未使用");
        }

        if (!orderNo.equals(userCoupon.getOrderNo())) {
            throw new RuntimeException("订单号不匹配");
        }

        userCoupon.setStatus(0);
        userCoupon.setUsedAt(null);
        userCoupon.setOrderNo(null);
        userCouponMapper.updateById(userCoupon);

        log.info("用户{}取消使用优惠券{}成功，订单号：{}", userCoupon.getUserId(), userCouponId, orderNo);
        return true;
    }
}
