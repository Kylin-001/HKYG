package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutCategory;
import com.heikeji.mall.takeout.service.TakeoutCategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外卖商品分类控制器
 */
@RestController
@RequestMapping("/api/takeout/category")
@Tag(name = "外卖商品分类管理")
public class TakeoutCategoryController {

    @Autowired
    private TakeoutCategoryService takeoutCategoryService;

    /**
     * 根据商家ID获取分类列表
     */
    @GetMapping("/merchant/{merchantId}")
    @Operation(summary = "根据商家ID获取分类列表")
    public R<List<TakeoutCategory>> getCategoriesByMerchantId(@PathVariable Long merchantId) {
        List<TakeoutCategory> categories = takeoutCategoryService.getCategoriesByMerchantId(merchantId);
        return R.success(categories);
    }

    /**
     * 创建菜品分类
     */
    @PostMapping
    @Operation(summary = "创建菜品分类")
    public R<Boolean> createCategory(@RequestBody TakeoutCategory category) {
        boolean success = takeoutCategoryService.createCategory(category);
        return R.success(success);
    }

    /**
     * 更新菜品分类
     */
    @PutMapping
    @Operation(summary = "更新菜品分类")
    public R<Boolean> updateCategory(@RequestBody TakeoutCategory category) {
        boolean success = takeoutCategoryService.updateCategory(category);
        return R.success(success);
    }

    /**
     * 删除菜品分类
     */
    @DeleteMapping("/{categoryId}")
    @Operation(summary = "删除菜品分类")
    public R<Boolean> deleteCategory(@PathVariable Long categoryId) {
        boolean success = takeoutCategoryService.deleteCategory(categoryId);
        return R.success(success);
    }

    /**
     * 根据ID获取分类详情
     */
    @GetMapping("/{categoryId}")
    @Operation(summary = "根据ID获取分类详情")
    public R<TakeoutCategory> getCategoryById(@PathVariable Long categoryId) {
        TakeoutCategory category = takeoutCategoryService.getCategoryById(categoryId);
        return R.success(category);
    }

    /**
     * 批量删除菜品分类
     */
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除菜品分类")
    public R<Boolean> batchDeleteCategories(@RequestBody List<Long> categoryIds) {
        boolean success = takeoutCategoryService.batchDeleteCategories(categoryIds);
        return R.success(success);
    }

    /**
     * 更新分类排序
     */
    @PutMapping("/{categoryId}/sort")
    @Operation(summary = "更新分类排序")
    public R<Boolean> updateCategorySort(@PathVariable Long categoryId, @RequestParam Integer sort) {
        boolean success = takeoutCategoryService.updateCategorySort(categoryId, sort);
        return R.success(success);
    }

}