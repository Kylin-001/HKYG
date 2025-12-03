package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.TakeoutProduct;

import java.util.List;

/**
 * 外卖商品服务接口
 */
public interface TakeoutProductService extends IService<TakeoutProduct> {

    /**
     * 根据商家ID获取商品列表
     */
    List<TakeoutProduct> getProductsByMerchantId(Long merchantId);

    /**
     * 根据分类ID获取商品列表
     */
    List<TakeoutProduct> getProductsByCategoryId(Long categoryId);

    /**
     * 获取推荐商品
     */
    List<TakeoutProduct> getRecommendedProducts(Long merchantId, Integer limit);
    
    /**
     * 根据ID获取商品详情
     */
    TakeoutProduct getProductById(Long productId);

}