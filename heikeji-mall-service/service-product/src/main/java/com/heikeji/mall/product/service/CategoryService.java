package com.heikeji.mall.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.product.entity.Category;

import java.util.List;

/**
 * 商品分类服务接口
 */
public interface CategoryService extends IService<Category> {

    /**
     * 获取所有启用状态的分类列表
     * @return 分类列表
     */
    List<Category> getEnabledCategories();
    
    /**
     * 根据状态查询分类列表
     * @param status 状态（0-禁用，1-启用）
     * @return 分类列表
     */
    List<Category> getByStatus(Integer status);
    
    /**
     * 获取所有分类，按排序字段排序
     * @return 分类列表
     */
    List<Category> getCategoriesBySort();
    
    /**
     * 启用分类
     * @param categoryId 分类ID
     * @return 是否成功
     */
    Boolean enableCategory(Long categoryId);
    
    /**
     * 禁用分类
     * @param categoryId 分类ID
     * @return 是否成功
     */
    Boolean disableCategory(Long categoryId);
    
    /**
     * 根据父分类ID获取子分类
     * @param parentId 父分类ID
     * @return 子分类列表
     */
    List<Category> getSubCategories(Long parentId);
    
    /**
     * 获取所有分类树（包含所有层级）
     * @return 分类树列表
     */
    List<Category> getAllCategoryTree();
    
    /**
     * 获取启用的分类树
     * @return 启用的分类树列表
     */
    List<Category> getEnabledCategoryTree();
    
    /**
     * 根据分类ID获取其所有父分类（从顶级到当前）
     * @param categoryId 分类ID
     * @return 父分类列表
     */
    List<Category> getParentCategories(Long categoryId);
}