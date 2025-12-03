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

}