package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.TakeoutCategory;
import com.heikeji.mall.takeout.mapper.TakeoutCategoryMapper;
import com.heikeji.mall.takeout.service.TakeoutCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 外卖商品分类服务实现类
 */
@Service
public class TakeoutCategoryServiceImpl extends ServiceImpl<TakeoutCategoryMapper, TakeoutCategory> implements TakeoutCategoryService {

    @Autowired
    private TakeoutCategoryMapper takeoutCategoryMapper;

    @Override
    public List<TakeoutCategory> getCategoriesByMerchantId(Long merchantId) {
        return takeoutCategoryMapper.selectByMerchantId(merchantId);
    }

    @Override
    public boolean createCategory(TakeoutCategory category) {
        Date now = new Date();
        category.setCreateTime(now);
        category.setUpdateTime(now);
        return save(category);
    }

    @Override
    public boolean updateCategory(TakeoutCategory category) {
        category.setUpdateTime(new Date());
        return updateById(category);
    }

    @Override
    public boolean deleteCategory(Long categoryId) {
        return removeById(categoryId);
    }

    @Override
    public TakeoutCategory getCategoryById(Long categoryId) {
        return getById(categoryId);
    }

    @Override
    public boolean batchDeleteCategories(List<Long> categoryIds) {
        return removeByIds(categoryIds);
    }

    @Override
    public boolean updateCategorySort(Long categoryId, Integer sort) {
        TakeoutCategory category = new TakeoutCategory();
        category.setId(categoryId);
        category.setSort(sort);
        category.setUpdateTime(new Date());
        return updateById(category);
    }

}