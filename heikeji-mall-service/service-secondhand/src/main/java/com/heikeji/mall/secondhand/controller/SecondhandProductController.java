package com.heikeji.mall.secondhand.controller;

import com.heikeji.mall.secondhand.entity.SecondhandProduct;
import com.heikeji.mall.secondhand.service.SecondhandProductService;
import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/secondhand")
@Tag(name = "二手商品管理", description = "二手商品相关接口")
@Slf4j
public class SecondhandProductController {

    @Autowired
    private SecondhandProductService secondhandProductService;

    @PostMapping("/publish")
    @Operation(summary = "发布二手商品")
    public R<Long> publishProduct(@RequestBody SecondhandProduct product) {
        try {
            Long productId = secondhandProductService.publishProduct(product);
            return R.success(productId);
        } catch (Exception e) {
            log.error("发布商品失败", e);
            return R.error("发布失败: " + e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "获取商品详情")
    public R<SecondhandProduct> getProductDetail(@PathVariable Long id) {
        try {
            SecondhandProduct product = secondhandProductService.getProductDetail(id);
            if (product == null) {
                return R.error("商品不存在");
            }
            return R.success(product);
        } catch (Exception e) {
            log.error("获取商品详情失败", e);
            return R.error("获取详情失败: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    @Operation(summary = "获取商品列表")
    public R<List<SecondhandProduct>> getProductList(@RequestParam Map<String, Object> params) {
        try {
            List<SecondhandProduct> list = secondhandProductService.getProductList(params);
            return R.success(list);
        } catch (Exception e) {
            log.error("获取商品列表失败", e);
            return R.error("获取列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "搜索商品")
    public R<Map<String, Object>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Map<String, Object> result = secondhandProductService.searchProducts(keyword, categoryId, sort, page, size);
            return R.success(result);
        } catch (Exception e) {
            log.error("搜索商品失败", e);
            return R.error("搜索失败: " + e.getMessage());
        }
    }

    @GetMapping("/hot")
    @Operation(summary = "获取热门商品")
    public R<List<SecondhandProduct>> getHotProducts(@RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<SecondhandProduct> list = secondhandProductService.getHotProducts(limit);
            return R.success(list);
        } catch (Exception e) {
            log.error("获取热门商品失败", e);
            return R.error("获取热门商品失败: " + e.getMessage());
        }
    }

    @GetMapping("/recommend")
    @Operation(summary = "获取推荐商品")
    public R<List<SecondhandProduct>> getRecommendProducts(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<SecondhandProduct> list = secondhandProductService.getRecommendProducts(userId, limit);
            return R.success(list);
        } catch (Exception e) {
            log.error("获取推荐商品失败", e);
            return R.error("获取推荐商品失败: " + e.getMessage());
        }
    }

    @PutMapping("/audit/{id}")
    @Operation(summary = "审核商品")
    public R<Boolean> auditProduct(
            @PathVariable Long id,
            @RequestParam Integer status,
            @RequestParam(required = false) String auditRemark) {
        try {
            boolean result = secondhandProductService.auditProduct(id, status, auditRemark);
            return R.success(result);
        } catch (Exception e) {
            log.error("审核商品失败", e);
            return R.error("审核失败: " + e.getMessage());
        }
    }

    @PutMapping("/status/{id}")
    @Operation(summary = "更新商品状态")
    public R<Boolean> updateProductStatus(@PathVariable Long id, @RequestParam Integer status) {
        try {
            boolean result = secondhandProductService.updateProductStatus(id, status);
            return R.success(result);
        } catch (Exception e) {
            log.error("更新商品状态失败", e);
            return R.error("更新状态失败: " + e.getMessage());
        }
    }
}
