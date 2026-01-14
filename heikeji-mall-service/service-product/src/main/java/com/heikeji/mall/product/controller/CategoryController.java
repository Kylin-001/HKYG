package com.heikeji.mall.product.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.product.entity.Category;
import com.heikeji.mall.product.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品分类控制器
 */
@RestController
@RequestMapping("/api/category")
@Tag(name = "商品分类管理")
@Validated
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 获取所有分类列表（按排序字段排序）
     */
    @GetMapping
    @Operation(summary = "获取所有分类列表")
    public R<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getCategoriesBySort();
        return R.success(categories);
    }

    /**
     * 获取分类树结构
     */
    @GetMapping("/tree")
    @Operation(summary = "获取分类树结构")
    public R<List<Category>> getCategoryTree() {
        List<Category> categories = categoryService.getAllCategoryTree();
        return R.success(categories);
    }

    /**
     * 根据父分类ID获取子分类
     */
    @GetMapping("/parent/{parentId}")
    @Operation(summary = "获取子分类")
    public R<List<Category>> getCategoriesByParentId(
            @Parameter(description = "父分类ID，0表示顶级分类") @PathVariable Long parentId) {
        List<Category> categories = categoryService.getSubCategories(parentId);
        return R.success(categories);
    }

    /**
     * 获取启用状态的分类列表
     */
    @GetMapping("/enabled")
    @Operation(summary = "获取启用的分类")
    public R<List<Category>> getEnabledCategories() {
        List<Category> categories = categoryService.getEnabledCategories();
        return R.success(categories);
    }

    /**
     * 获取启用的分类树结构
     */
    @GetMapping("/enabled/tree")
    @Operation(summary = "获取启用的分类树结构")
    public R<List<Category>> getEnabledCategoryTree() {
        List<Category> categories = categoryService.getEnabledCategoryTree();
        return R.success(categories);
    }

    /**
     * 根据分类ID获取所有父分类（从顶级到当前）
     */
    @GetMapping("/path/{categoryId}")
    @Operation(summary = "获取分类路径")
    public R<List<Category>> getCategoryPath(
            @Parameter(description = "分类ID") @PathVariable Long categoryId) {
        List<Category> categories = categoryService.getParentCategories(categoryId);
        return R.success(categories);
    }

    /**
     * 获取完整分类路径（包含当前分类）
     */
    @GetMapping("/full-path/{categoryId}")
    @Operation(summary = "获取完整分类路径")
    public R<List<Category>> getFullCategoryPath(
            @Parameter(description = "分类ID") @PathVariable Long categoryId) {
        List<Category> categories = ((com.heikeji.mall.product.service.impl.CategoryServiceImpl)categoryService).getCompleteCategoryPath(categoryId);
        return R.success(categories);
    }

    /**
     * 根据ID获取分类详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情")
    public R<Category> getCategoryById(@Parameter(description = "分类ID") @PathVariable Long id) {
        Category category = categoryService.getById(id);
        return R.success(category);
    }

    /**
     * 新增分类
     */
    @PostMapping
    @Operation(summary = "新增分类")
    public R<Boolean> addCategory(@Parameter(description = "分类信息") @RequestBody Category category) {
        try {
            validateCategoryParams(category);
            boolean result = categoryService.save(category);
            return R.success(result);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }

    /**
     * 批量新增分类
     */
    @PostMapping("/batch")
    @Operation(summary = "批量新增分类")
    public R<Boolean> batchAddCategories(@Parameter(description = "分类信息列表") @RequestBody List<Category> categories) {
        try {
            for (Category category : categories) {
                validateCategoryParams(category);
            }
            boolean result = categoryService.saveBatch(categories);
            return R.success(result);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }

    /**
     * 更新分类
     */
    @PutMapping
    @Operation(summary = "更新分类")
    public R<Boolean> updateCategory(@Parameter(description = "分类信息") @RequestBody Category category) {
        try {
            if (category.getId() == null) {
                return R.error("分类ID不能为空");
            }
            validateCategoryParams(category);
            boolean result = categoryService.updateById(category);
            return R.success(result);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }

    /**
     * 批量更新分类
     */
    @PutMapping("/batch")
    @Operation(summary = "批量更新分类")
    public R<Boolean> batchUpdateCategories(@Parameter(description = "分类信息列表") @RequestBody List<Category> categories) {
        try {
            for (Category category : categories) {
                if (category.getId() == null) {
                    return R.error("分类ID不能为空");
                }
                validateCategoryParams(category);
            }
            boolean result = categoryService.updateBatchById(categories);
            return R.success(result);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }

    /**
     * 启用分类
     */
    @PutMapping("/enable/{id}")
    @Operation(summary = "启用分类")
    public R<Boolean> enableCategory(@Parameter(description = "分类ID") @PathVariable Long id) {
        boolean result = categoryService.enableCategory(id);
        return R.success(result);
    }
    
    /**
     * 批量启用分类
     */
    @PutMapping("/enable/batch")
    @Operation(summary = "批量启用分类")
    public R<Boolean> batchEnableCategories(@Parameter(description = "分类ID列表") @RequestBody List<Long> ids) {
        boolean allSuccess = true;
        for (Long id : ids) {
            boolean success = categoryService.enableCategory(id);
            if (!success) {
                allSuccess = false;
            }
        }
        return R.success(allSuccess);
    }
    
    /**
     * 禁用分类
     */
    @PutMapping("/disable/{id}")
    @Operation(summary = "禁用分类")
    public R<Boolean> disableCategory(@Parameter(description = "分类ID") @PathVariable Long id) {
        try {
            boolean result = categoryService.disableCategory(id);
            if (!result) {
                return R.error("禁用失败，可能存在启用状态的子分类");
            }
            return R.success(true);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    /**
     * 批量禁用分类
     */
    @PutMapping("/disable/batch")
    @Operation(summary = "批量禁用分类")
    public R<Boolean> batchDisableCategories(@Parameter(description = "分类ID列表") @RequestBody List<Long> ids) {
        boolean allSuccess = true;
        for (Long id : ids) {
            boolean success = categoryService.disableCategory(id);
            if (!success) {
                allSuccess = false;
            }
        }
        if (!allSuccess) {
            return R.error("部分分类禁用失败，可能存在启用状态的子分类");
        }
        return R.success(true);
    }

    /**
     * 删除分类
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类")
    public R<Boolean> deleteCategory(@Parameter(description = "分类ID") @PathVariable Long id) {
        try {
            boolean result = categoryService.removeById(id);
            return R.success(result);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    /**
     * 批量删除分类
     */
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除分类")
    public R<Boolean> deleteCategories(@Parameter(description = "分类ID列表") @RequestBody List<Long> ids) {
        try {
            boolean result = categoryService.removeByIds(ids);
            return R.success(result);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    /**
     * 验证分类参数
     */
    private void validateCategoryParams(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new RuntimeException("分类名称不能为空");
        }
        if (category.getName().length() > 50) {
            throw new RuntimeException("分类名称不能超过50个字符");
        }
        if (category.getSortOrder() != null && category.getSortOrder() > 9999) {
            throw new RuntimeException("排序值不能超过9999");
        }
    }
    
    /**
     * 检查分类层级是否合法
     */
    @GetMapping("/check-level/{parentId}")
    @Operation(summary = "检查分类层级是否合法")
    public R<Boolean> checkCategoryLevel(@Parameter(description = "父分类ID") @PathVariable Long parentId) {
        boolean isValid = ((com.heikeji.mall.product.service.impl.CategoryServiceImpl)categoryService).checkCategoryLevel(parentId);
        return R.success(isValid);
    }
    
    /**
     * 获取分类层级限制
     */
    @GetMapping("/max-level")
    @Operation(summary = "获取分类最大层级限制")
    public R<Integer> getMaxCategoryLevel() {
        return R.success(3); // 最大支持3级分类
    }
}