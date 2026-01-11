package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutCategory;
import com.heikeji.mall.takeout.service.TakeoutCategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外卖商品分类控制器
 */
@RestController
@RequestMapping("/api/takeout/category")
@Api(tags = "外卖商品分类管理")
public class TakeoutCategoryController {

    @Autowired
    private TakeoutCategoryService takeoutCategoryService;

    /**
     * 根据商家ID获取分类列表
     */
    @GetMapping("/merchant/{merchantId}")
    @ApiOperation("根据商家ID获取分类列表")
    public R<List<TakeoutCategory>> getCategoriesByMerchantId(@PathVariable Long merchantId) {
        List<TakeoutCategory> categories = takeoutCategoryService.getCategoriesByMerchantId(merchantId);
        return R.success(categories);
    }

    /**
     * 创建菜品分类
     */
    @PostMapping
    @ApiOperation("创建菜品分类")
    public R<Boolean> createCategory(@RequestBody TakeoutCategory category) {
        boolean success = takeoutCategoryService.createCategory(category);
        return R.success(success);
    }

    /**
     * 更新菜品分类
     */
    @PutMapping
    @ApiOperation("更新菜品分类")
    public R<Boolean> updateCategory(@RequestBody TakeoutCategory category) {
        boolean success = takeoutCategoryService.updateCategory(category);
        return R.success(success);
    }

    /**
     * 删除菜品分类
     */
    @DeleteMapping("/{categoryId}")
    @ApiOperation("删除菜品分类")
    public R<Boolean> deleteCategory(@PathVariable Long categoryId) {
        boolean success = takeoutCategoryService.deleteCategory(categoryId);
        return R.success(success);
    }

    /**
     * 根据ID获取分类详情
     */
    @GetMapping("/{categoryId}")
    @ApiOperation("根据ID获取分类详情")
    public R<TakeoutCategory> getCategoryById(@PathVariable Long categoryId) {
        TakeoutCategory category = takeoutCategoryService.getCategoryById(categoryId);
        return R.success(category);
    }

    /**
     * 批量删除菜品分类
     */
    @DeleteMapping("/batch")
    @ApiOperation("批量删除菜品分类")
    public R<Boolean> batchDeleteCategories(@RequestBody List<Long> categoryIds) {
        boolean success = takeoutCategoryService.batchDeleteCategories(categoryIds);
        return R.success(success);
    }

    /**
     * 更新分类排序
     */
    @PutMapping("/{categoryId}/sort")
    @ApiOperation("更新分类排序")
    public R<Boolean> updateCategorySort(@PathVariable Long categoryId, @RequestParam Integer sort) {
        boolean success = takeoutCategoryService.updateCategorySort(categoryId, sort);
        return R.success(success);
    }

}