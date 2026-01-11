package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.TakeoutCategory;

import java.util.List;

/**
 * 外卖商品分类服务接口
 */
public interface TakeoutCategoryService extends IService<TakeoutCategory> {

    /**
     * 根据商家ID获取分类列表
     */
    List<TakeoutCategory> getCategoriesByMerchantId(Long merchantId);

    /**
     * 创建菜品分类
     */
    boolean createCategory(TakeoutCategory category);

    /**
     * 更新菜品分类
     */
    boolean updateCategory(TakeoutCategory category);

    /**
     * 删除菜品分类
     */
    boolean deleteCategory(Long categoryId);

    /**
     * 根据ID获取分类详情
     */
    TakeoutCategory getCategoryById(Long categoryId);

    /**
     * 批量删除菜品分类
     */
    boolean batchDeleteCategories(List<Long> categoryIds);

    /**
     * 更新分类排序
     */
    boolean updateCategorySort(Long categoryId, Integer sort);

}