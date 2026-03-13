package com.heikeji.mall.member.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.member.dto.CouponDTO;
import com.heikeji.mall.member.dto.UserCouponDTO;
import com.heikeji.mall.member.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/member/coupon")
@Tag(name = "优惠券管理", description = "优惠券相关接口")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/list")
    @Operation(summary = "获取可用优惠券列表")
    public R<List<CouponDTO>> getAvailableCoupons(
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        List<CouponDTO> coupons = couponService.getAvailableCoupons(userId);
        return R.ok(coupons);
    }

    @GetMapping("/detail/{couponId}")
    @Operation(summary = "获取优惠券详情")
    public R<CouponDTO> getCouponDetail(
            @Parameter(description = "优惠券ID") @PathVariable Long couponId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        CouponDTO coupon = couponService.getCouponDetail(couponId, userId);
        return R.ok(coupon);
    }

    @PostMapping("/receive/{couponId}")
    @Operation(summary = "领取优惠券")
    public R<Boolean> receiveCoupon(
            @Parameter(description = "优惠券ID") @PathVariable Long couponId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = couponService.receiveCoupon(couponId, userId);
        return R.ok(success);
    }

    @GetMapping("/user/list")
    @Operation(summary = "获取用户优惠券列表")
    public R<List<UserCouponDTO>> getUserCoupons(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "状态：0-未使用，1-已使用，2-已过期") @RequestParam(required = false) Integer status) {
        List<UserCouponDTO> userCoupons = couponService.getUserCoupons(userId, status);
        return R.ok(userCoupons);
    }

    @PostMapping("/use/{userCouponId}")
    @Operation(summary = "使用优惠券")
    public R<Boolean> useCoupon(
            @Parameter(description = "用户优惠券ID") @PathVariable Long userCouponId,
            @Parameter(description = "订单号") @RequestParam String orderNo) {
        boolean success = couponService.useCoupon(userCouponId, orderNo);
        return R.ok(success);
    }

    @PostMapping("/cancel/{userCouponId}")
    @Operation(summary = "取消使用优惠券")
    public R<Boolean> cancelCoupon(
            @Parameter(description = "用户优惠券ID") @PathVariable Long userCouponId,
            @Parameter(description = "订单号") @RequestParam String orderNo) {
        boolean success = couponService.cancelCoupon(userCouponId, orderNo);
        return R.ok(success);
    }
}
