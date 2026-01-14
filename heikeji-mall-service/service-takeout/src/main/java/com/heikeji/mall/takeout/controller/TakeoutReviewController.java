package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutReview;
import com.heikeji.mall.takeout.service.TakeoutReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 外卖评价控制器
 */
@RestController
@RequestMapping("/api/takeout/reviews")
@Tag(name = "外卖评价管理")
public class TakeoutReviewController {

    @Autowired
    private TakeoutReviewService takeoutReviewService;

    /**
     * 创建评价
     */
    @PostMapping
    @Operation(summary = "创建评价")
    public R<TakeoutReview> createReview(@RequestBody TakeoutReview review) {
        TakeoutReview createdReview = takeoutReviewService.createReview(review);
        return R.success(createdReview);
    }

    /**
     * 根据商家ID获取评价列表
     */
    @GetMapping("/merchant/{merchantId}")
    @Operation(summary = "根据商家ID获取评价列表")
    public R<List<TakeoutReview>> getReviewsByMerchantId(@PathVariable Long merchantId) {
        List<TakeoutReview> reviews = takeoutReviewService.getReviewsByMerchantId(merchantId);
        return R.success(reviews);
    }

    /**
     * 根据用户ID获取评价列表
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "根据用户ID获取评价列表")
    public R<List<TakeoutReview>> getReviewsByUserId(@PathVariable Long userId) {
        List<TakeoutReview> reviews = takeoutReviewService.getReviewsByUserId(userId);
        return R.success(reviews);
    }

    /**
     * 根据订单ID获取评价
     */
    @GetMapping("/order/{orderId}")
    @Operation(summary = "根据订单ID获取评价")
    public R<TakeoutReview> getReviewByOrderId(@PathVariable Long orderId) {
        TakeoutReview review = takeoutReviewService.getReviewByOrderId(orderId);
        return R.ok(review);
    }

    /**
     * 获取高分评价
     */
    @GetMapping("/high-rating/{merchantId}")
    @Operation(summary = "获取高分评价")
    public R<List<TakeoutReview>> getHighRatingReviews(@PathVariable Long merchantId, @RequestParam(defaultValue = "5") Integer limit) {
        List<TakeoutReview> reviews = takeoutReviewService.getHighRatingReviews(merchantId, limit);
        return R.success(reviews);
    }

    @Operation(summary = "根据标签查询评价")
    @GetMapping("/by-tags")
    public R<List<TakeoutReview>> getReviewsByTags(@RequestParam Long merchantId, @RequestParam List<String> tags) {
        return R.success(takeoutReviewService.getReviewsByTags(merchantId, tags));
    }

    /**
     * 商家回复评价
     */
    @PutMapping("/{reviewId}/reply")
    @Operation(summary = "商家回复评价")
    public R<Boolean> replyReview(@PathVariable Long reviewId, @RequestParam String reply) {
        return R.success(takeoutReviewService.replyReview(reviewId, reply));
    }

    @Operation(summary = "上传评价图片")
    @PostMapping("/upload/images")
    public R<List<String>> uploadReviewImages(@RequestParam("files") List<MultipartFile> files) throws IOException {
        return R.success(takeoutReviewService.uploadReviewImages(files));
    }

    @Operation(summary = "删除评价图片")
    @DeleteMapping("/images")
    public R<Boolean> deleteReviewImage(@RequestParam String imageUrl) {
        return R.success(takeoutReviewService.deleteReviewImage(imageUrl));
    }

    @Operation(summary = "更新评价有用数量")
    @PutMapping("/{reviewId}/helpful")
    public R<Boolean> updateHelpfulCount(@PathVariable Long reviewId) {
        return R.success(takeoutReviewService.updateHelpfulCount(reviewId));
    }

}