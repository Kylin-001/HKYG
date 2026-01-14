package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.entity.DeliveryReview;
import com.heikeji.mall.delivery.service.DeliveryReviewService;
import com.heikeji.mall.delivery.vo.DeliveryReviewVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 配送评价控制器
 */
@Tag(name = "配送评价管理")
@RestController
@RequestMapping("/api/delivery/review")
public class DeliveryReviewController {

    @Autowired
    private DeliveryReviewService deliveryReviewService;

    /**
     * 提交评价
     */
    @Operation(summary = "提交评价")
    @PostMapping
    public R<Long> submitReview(@Parameter(description = "评价信息") @RequestBody DeliveryReview review) {
        // 设置默认用户ID（简化处理）
        if (review.getUserId() == null) {
            review.setUserId(1L);
        }
        Long reviewId = deliveryReviewService.submitReview(review);
        return R.success(reviewId);
    }

    /**
     * 获取评价详情
     */
    @Operation(summary = "获取评价详情")
    @GetMapping("/detail/{reviewId}")
    public R<DeliveryReviewVO> getReviewDetail(@Parameter(description = "评价ID") @PathVariable Long reviewId) {
        DeliveryReviewVO review = deliveryReviewService.getReviewDetail(reviewId);
        return R.success(review);
    }

    /**
     * 根据配送员ID获取评价列表
     */
    @Operation(summary = "根据配送员ID获取评价列表")
    @GetMapping("/delivery/{deliveryUserId}")
    public R<List<DeliveryReviewVO>> getReviewsByDeliveryUserId(@Parameter(description = "配送员ID") @PathVariable Long deliveryUserId,
                                                               @Parameter(description = "查询参数") @RequestParam Map<String, Object> params) {
        List<DeliveryReviewVO> reviews = deliveryReviewService.getReviewsByDeliveryUserId(deliveryUserId, params);
        return R.success(reviews);
    }

    /**
     * 根据用户ID获取评价列表
     */
    @Operation(summary = "根据用户ID获取评价列表")
    @GetMapping("/user/{userId}")
    public R<List<DeliveryReviewVO>> getReviewsByUserId(@Parameter(description = "用户ID") @PathVariable Long userId,
                                                      @Parameter(description = "查询参数") @RequestParam Map<String, Object> params) {
        List<DeliveryReviewVO> reviews = deliveryReviewService.getReviewsByUserId(userId, params);
        return R.success(reviews);
    }

    /**
     * 获取配送员评价统计信息
     */
    @Operation(summary = "获取配送员评价统计信息")
    @GetMapping("/stats/{deliveryUserId}")
    public R<Map<String, Object>> getReviewStats(@Parameter(description = "配送员ID") @PathVariable Long deliveryUserId) {
        Map<String, Object> stats = deliveryReviewService.getReviewStats(deliveryUserId);
        return R.success(stats);
    }

    /**
     * 配送员回复评价
     */
    @Operation(summary = "配送员回复评价")
    @PostMapping("/reply/{reviewId}")
    public R<Boolean> replyReview(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                                 @Parameter(description = "回复内容") @RequestParam String reply,
                                 @Parameter(description = "配送员ID") @RequestParam Long deliveryUserId) {
        boolean success = deliveryReviewService.replyReview(reviewId, reply, deliveryUserId);
        return R.success(success);
    }

    /**
     * 点赞评价
     */
    @Operation(summary = "点赞评价")
    @PostMapping("/like/{reviewId}")
    public R<Boolean> likeReview(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                                @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = deliveryReviewService.likeReview(reviewId, userId);
        return R.success(success);
    }

    /**
     * 取消点赞评价
     */
    @Operation(summary = "取消点赞评价")
    @PostMapping("/unlike/{reviewId}")
    public R<Boolean> unlikeReview(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                                 @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = deliveryReviewService.unlikeReview(reviewId, userId);
        return R.success(success);
    }

    /**
     * 标记评价为有用
     */
    @Operation(summary = "标记评价为有用")
    @PostMapping("/helpful/{reviewId}")
    public R<Boolean> markHelpful(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                                 @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = deliveryReviewService.markHelpful(reviewId, userId);
        return R.success(success);
    }

    /**
     * 取消标记评价为有用
     */
    @Operation(summary = "取消标记评价为有用")
    @PostMapping("/unhelpful/{reviewId}")
    public R<Boolean> unmarkHelpful(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                                  @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = deliveryReviewService.unmarkHelpful(reviewId, userId);
        return R.success(success);
    }

    /**
     * 删除评价
     */
    @Operation(summary = "删除评价")
    @DeleteMapping("/{reviewId}")
    public R<Boolean> deleteReview(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                                  @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = deliveryReviewService.deleteReview(reviewId, userId);
        return R.success(success);
    }

    /**
     * 置顶评价
     */
    @Operation(summary = "置顶评价")
    @PostMapping("/top/{reviewId}")
    public R<Boolean> topReview(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                              @Parameter(description = "配送员ID") @RequestParam Long deliveryUserId) {
        boolean success = deliveryReviewService.topReview(reviewId, deliveryUserId);
        return R.success(success);
    }

    /**
     * 取消置顶评价
     */
    @Operation(summary = "取消置顶评价")
    @PostMapping("/untop/{reviewId}")
    public R<Boolean> untopReview(@Parameter(description = "评价ID") @PathVariable Long reviewId,
                               @Parameter(description = "配送员ID") @RequestParam Long deliveryUserId) {
        boolean success = deliveryReviewService.untopReview(reviewId, deliveryUserId);
        return R.success(success);
    }

    /**
     * 检查订单是否已评价
     */
    @Operation(summary = "检查订单是否已评价")
    @GetMapping("/check-reviewed/{deliveryOrderId}")
    public R<Boolean> isOrderReviewed(@Parameter(description = "配送订单ID") @PathVariable Long deliveryOrderId) {
        boolean isReviewed = deliveryReviewService.isOrderReviewed(deliveryOrderId);
        return R.success(isReviewed);
    }

    /**
     * 获取配送员平均评分
     */
    @Operation(summary = "获取配送员平均评分")
    @GetMapping("/average-rating/{deliveryUserId}")
    public R<Double> getAverageRating(@Parameter(description = "配送员ID") @PathVariable Long deliveryUserId) {
        Double averageRating = deliveryReviewService.getAverageRating(deliveryUserId);
        return R.success(averageRating);
    }

    /**
     * 获取配送员评价数量
     */
    @Operation(summary = "获取配送员评价数量")
    @GetMapping("/count/{deliveryUserId}")
    public R<Integer> getReviewCount(@Parameter(description = "配送员ID") @PathVariable Long deliveryUserId) {
        Integer reviewCount = deliveryReviewService.getReviewCount(deliveryUserId);
        return R.success(reviewCount);
    }

    /**
     * 获取评价分布（1-5星）
     */
    @Operation(summary = "获取评价分布")
    @GetMapping("/distribution/{deliveryUserId}")
    public R<Map<Integer, Integer>> getRatingDistribution(@Parameter(description = "配送员ID") @PathVariable Long deliveryUserId) {
        Map<Integer, Integer> distribution = deliveryReviewService.getRatingDistribution(deliveryUserId);
        return R.success(distribution);
    }
}
