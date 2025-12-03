package com.heikeji.mall.order.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.order.domain.dto.OrderReviewDTO;
import com.heikeji.mall.order.domain.vo.OrderReviewVO;
import com.heikeji.mall.order.service.OrderReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单评价控制器
 */
@RestController
@RequestMapping("/api/order/review")
@Tag(name = "订单评价管理", description = "订单评价相关接口")
@Slf4j
public class OrderReviewController {

    @Autowired
    private OrderReviewService orderReviewService;

    /**
     * 提交订单评价
     */
    @PostMapping
    @Operation(summary = "提交订单评价", description = "用户提交订单商品的评价信息")
    public R<Boolean> submitReview(@RequestBody OrderReviewDTO dto, @RequestHeader("X-User-Id") Long userId) {
        try {
            log.info("用户{}提交订单评价: {}", userId, dto.getOrderNo());
            Boolean result = orderReviewService.submitReview(userId, dto);
            return R.success(result);
        } catch (Exception e) {
            log.error("提交订单评价失败", e);
            return R.error(e.getMessage());
        }
    }

    /**
     * 根据订单编号获取评价列表
     */
    @GetMapping("/order/{orderNo}")
    @Operation(summary = "根据订单编号获取评价列表", description = "获取指定订单的所有评价信息")
    public R<List<OrderReviewVO>> getReviewsByOrderNo(@PathVariable String orderNo) {
        try {
            List<OrderReviewVO> reviews = orderReviewService.getReviewsByOrderNo(orderNo);
            return R.success(reviews);
        } catch (Exception e) {
            log.error("获取订单评价列表失败", e);
            return R.error("获取评价列表失败");
        }
    }

    /**
     * 根据商品ID获取评价列表
     */
    @GetMapping("/product/{productId}")
    @Operation(summary = "根据商品ID获取评价列表", description = "获取指定商品的所有评价信息")
    public R<List<OrderReviewVO>> getReviewsByProductId(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<OrderReviewVO> reviews = orderReviewService.getReviewsByProductId(productId, page, limit);
            return R.success(reviews);
        } catch (Exception e) {
            log.error("获取商品评价列表失败", e);
            return R.error("获取评价列表失败");
        }
    }

    /**
     * 获取商品的评价统计信息
     */
    @GetMapping("/product/{productId}/stats")
    @Operation(summary = "获取商品评价统计信息", description = "获取商品评价的统计数据，包括好评率等")
    public R<?> getProductReviewStats(@PathVariable Long productId) {
        try {
            Double avgRating = orderReviewService.getAverageRatingByProductId(productId);
            Integer reviewCount = orderReviewService.getReviewCountByProductId(productId);
            
            // 创建统计信息对象
            java.util.HashMap<String, Object> stats = new java.util.HashMap<>();
            stats.put("averageRating", avgRating);
            stats.put("reviewCount", reviewCount);
            
            return R.success(stats);
        } catch (Exception e) {
            log.error("获取商品评价统计失败", e);
            return R.error("获取评价统计失败");
        }
    }

    /**
     * 检查订单是否已评价
     */
    @GetMapping("/check-reviewed/{orderNo}")
    @Operation(summary = "检查订单是否已评价", description = "检查用户是否已对指定订单进行评价")
    public R<Boolean> checkOrderReviewed(@PathVariable String orderNo) {
        try {
            Boolean isReviewed = orderReviewService.isOrderReviewed(orderNo);
            return R.success(isReviewed);
        } catch (Exception e) {
            log.error("检查订单评价状态失败", e);
            return R.error("检查失败");
        }
    }

    /**
     * 获取订单中可评价的商品列表
     */
    @GetMapping("/reviewable/{orderNo}")
    @Operation(summary = "获取订单中可评价的商品列表", description = "获取用户可进行评价的订单商品列表")
    public R<List<Long>> getReviewableProducts(
            @PathVariable String orderNo,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<Long> productIds = orderReviewService.getReviewableProducts(orderNo, userId);
            return R.success(productIds);
        } catch (Exception e) {
            log.error("获取可评价商品列表失败", e);
            return R.error("获取失败");
        }
    }
}