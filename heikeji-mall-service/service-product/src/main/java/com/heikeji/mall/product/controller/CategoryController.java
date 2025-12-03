package com.heikeji.mall.product.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.product.entity.Category;
import com.heikeji.mall.product.service.CategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品分类控制器
 */
@RestController
@RequestMapping("/api/category")
@Api(tags = "商品分类管理")
@Validated
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 获取所有分类列表（按排序字段排序）
     */
    @GetMapping
    @ApiOperation("获取所有分类列表")
    public R<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getCategoriesBySort();
        return R.success(categories);
    }

    /**
     * 获取分类树结构
     */
    @GetMapping("/tree")
    @ApiOperation("获取分类树结构")
    public R<List<Category>> getCategoryTree() {
        List<Category> categories = categoryService.getAllCategoryTree();
        return R.success(categories);
    }

    /**
     * 根据父分类ID获取子分类
     */
    @GetMapping("/parent/{parentId}")
    @ApiOperation("获取子分类")
    public R<List<Category>> getCategoriesByParentId(
            @ApiParam("父分类ID，0表示顶级分类") @PathVariable Long parentId) {
        List<Category> categories = categoryService.getSubCategories(parentId);
        return R.success(categories);
    }

    /**
     * 获取启用状态的分类列表
     */
    @GetMapping("/enabled")
    @ApiOperation("获取启用的分类")
    public R<List<Category>> getEnabledCategories() {
        List<Category> categories = categoryService.getEnabledCategories();
        return R.success(categories);
    }

    /**
     * 获取启用的分类树结构
     */
    @GetMapping("/enabled/tree")
    @ApiOperation("获取启用的分类树结构")
    public R<List<Category>> getEnabledCategoryTree() {
        List<Category> categories = categoryService.getEnabledCategoryTree();
        return R.success(categories);
    }

    /**
     * 根据分类ID获取所有父分类（从顶级到当前）
     */
    @GetMapping("/path/{categoryId}")
    @ApiOperation("获取分类路径")
    public R<List<Category>> getCategoryPath(
            @ApiParam("分类ID") @PathVariable Long categoryId) {
        List<Category> categories = categoryService.getParentCategories(categoryId);
        return R.success(categories);
    }

    /**
     * 获取完整分类路径（包含当前分类）
     */
    @GetMapping("/full-path/{categoryId}")
    @ApiOperation("获取完整分类路径")
    public R<List<Category>> getFullCategoryPath(
            @ApiParam("分类ID") @PathVariable Long categoryId) {
        List<Category> categories = ((com.heikeji.mall.product.service.impl.CategoryServiceImpl)categoryService).getCompleteCategoryPath(categoryId);
        return R.success(categories);
    }

    /**
     * 根据ID获取分类详情
     */
    @GetMapping("/{id}")
    @ApiOperation("获取分类详情")
    public R<Category> getCategoryById(@ApiParam("分类ID") @PathVariable Long id) {
        Category category = categoryService.getById(id);
        return R.success(category);
    }

    /**
     * 新增分类
     */
    @PostMapping
    @ApiOperation("新增分类")
    public R<Boolean> addCategory(@ApiParam("分类信息") @RequestBody Category category) {
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
    @ApiOperation("批量新增分类")
    public R<Boolean> batchAddCategories(@ApiParam("分类信息列表") @RequestBody List<Category> categories) {
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
    @ApiOperation("更新分类")
    public R<Boolean> updateCategory(@ApiParam("分类信息") @RequestBody Category category) {
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
    @ApiOperation("批量更新分类")
    public R<Boolean> batchUpdateCategories(@ApiParam("分类信息列表") @RequestBody List<Category> categories) {
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
    @ApiOperation("启用分类")
    public R<Boolean> enableCategory(@ApiParam("分类ID") @PathVariable Long id) {
        boolean result = categoryService.enableCategory(id);
        return R.success(result);
    }
    
    /**
     * 批量启用分类
     */
    @PutMapping("/enable/batch")
    @ApiOperation("批量启用分类")
    public R<Boolean> batchEnableCategories(@ApiParam("分类ID列表") @RequestBody List<Long> ids) {
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
    @ApiOperation("禁用分类")
    public R<Boolean> disableCategory(@ApiParam("分类ID") @PathVariable Long id) {
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
    @ApiOperation("批量禁用分类")
    public R<Boolean> batchDisableCategories(@ApiParam("分类ID列表") @RequestBody List<Long> ids) {
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
    @ApiOperation("删除分类")
    public R<Boolean> deleteCategory(@ApiParam("分类ID") @PathVariable Long id) {
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
    @ApiOperation("批量删除分类")
    public R<Boolean> deleteCategories(@ApiParam("分类ID列表") @RequestBody List<Long> ids) {
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
    @ApiOperation("检查分类层级是否合法")
    public R<Boolean> checkCategoryLevel(@ApiParam("父分类ID") @PathVariable Long parentId) {
        boolean isValid = ((com.heikeji.mall.product.service.impl.CategoryServiceImpl)categoryService).checkCategoryLevel(parentId);
        return R.success(isValid);
    }
    
    /**
     * 获取分类层级限制
     */
    @GetMapping("/max-level")
    @ApiOperation("获取分类最大层级限制")
    public R<Integer> getMaxCategoryLevel() {
        return R.success(3); // 最大支持3级分类
    }
}