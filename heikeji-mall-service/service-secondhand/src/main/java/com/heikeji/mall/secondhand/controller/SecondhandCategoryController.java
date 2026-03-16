package com.heikeji.mall.secondhand.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.secondhand.entity.SecondhandCategory;
import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/secondhand/category")
@Tag(name = "二手商品分类", description = "二手商品分类相关接口")
@Slf4j
public class SecondhandCategoryController {

    @Autowired
    private IService<SecondhandCategory> categoryService;

    @GetMapping("/list")
    @Operation(summary = "获取分类列表")
    public R<List<SecondhandCategory>> getCategoryList() {
        try {
            QueryWrapper<SecondhandCategory> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("status", 1);
            queryWrapper.orderByAsc("sort");
            List<SecondhandCategory> list = categoryService.list(queryWrapper);
            return R.success(list);
        } catch (Exception e) {
            log.error("获取分类列表失败", e);
            return R.error("获取分类列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情")
    public R<SecondhandCategory> getCategoryDetail(@PathVariable Long id) {
        try {
            SecondhandCategory category = categoryService.getById(id);
            if (category == null) {
                return R.error("分类不存在");
            }
            return R.success(category);
        } catch (Exception e) {
            log.error("获取分类详情失败", e);
            return R.error("获取分类详情失败: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "创建分类")
    public R<Boolean> createCategory(@RequestBody SecondhandCategory category) {
        try {
            category.setCreateTime(new Date());
            category.setUpdateTime(new Date());
            if (category.getStatus() == null) {
                category.setStatus(1);
            }
            boolean result = categoryService.save(category);
            return R.success(result);
        } catch (Exception e) {
            log.error("创建分类失败", e);
            return R.error("创建分类失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类")
    public R<Boolean> updateCategory(@PathVariable Long id, @RequestBody SecondhandCategory category) {
        try {
            category.setId(id);
            category.setUpdateTime(new Date());
            boolean result = categoryService.updateById(category);
            return R.success(result);
        } catch (Exception e) {
            log.error("更新分类失败", e);
            return R.error("更新分类失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类")
    public R<Boolean> deleteCategory(@PathVariable Long id) {
        try {
            boolean result = categoryService.removeById(id);
            return R.success(result);
        } catch (Exception e) {
            log.error("删除分类失败", e);
            return R.error("删除分类失败: " + e.getMessage());
        }
    }

    @PutMapping("/status/{id}")
    @Operation(summary = "更新分类状态")
    public R<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        try {
            SecondhandCategory category = new SecondhandCategory();
            category.setId(id);
            category.setStatus(status);
            category.setUpdateTime(new Date());
            boolean result = categoryService.updateById(category);
            return R.success(result);
        } catch (Exception e) {
            log.error("更新分类状态失败", e);
            return R.error("更新分类状态失败: " + e.getMessage());
        }
    }
}
