package com.heikeji.mall.product.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.product.service.ProductRecommendService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 商品推荐控制器
 */
@Api(tags = "商品推荐")
@RestController
@RequestMapping("/api/product/recommend")
public class ProductRecommendController {

    @Autowired
    private ProductRecommendService productRecommendService;

    /**
     * 获取个性化商品推荐
     */
    @ApiOperation("获取个性化商品推荐")
    @GetMapping("/personalized")
    public R<List<Map<String, Object>>> getPersonalizedRecommendations(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> recommendations = productRecommendService.getPersonalizedRecommendations(userId, limit);
        return R.success(recommendations);
    }

    /**
     * 获取热门商品推荐
     */
    @ApiOperation("获取热门商品推荐")
    @GetMapping("/hot")
    public R<List<Map<String, Object>>> getHotProductRecommendations(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> recommendations = productRecommendService.getHotProductRecommendations(limit);
        return R.success(recommendations);
    }

    /**
     * 获取相似商品推荐
     */
    @ApiOperation("获取相似商品推荐")
    @GetMapping("/similar/{productId}")
    public R<List<Map<String, Object>>> getSimilarProductRecommendations(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> recommendations = productRecommendService.getSimilarProductRecommendations(productId, limit);
        return R.success(recommendations);
    }

    /**
     * 获取商品推荐理由
     */
    @ApiOperation("获取商品推荐理由")
    @GetMapping("/reason")
    public R<String> getRecommendReason(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        String reason = productRecommendService.getRecommendReason(userId, productId);
        return R.success(reason);
    }

    /**
     * 更新推荐模型
     */
    @ApiOperation("更新推荐模型")
    @PostMapping("/update-model")
    public R<Boolean> updateRecommendModel() {
        boolean success = productRecommendService.updateRecommendModel();
        return R.success(success);
    }

    /**
     * 获取推荐统计信息
     */
    @ApiOperation("获取推荐统计信息")
    @GetMapping("/statistics")
    public R<Map<String, Object>> getRecommendStatistics() {
        Map<String, Object> statistics = productRecommendService.getRecommendStatistics();
        return R.success(statistics);
    }
}
