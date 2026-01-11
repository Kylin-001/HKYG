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

    /**
     * 创建菜品
     */
    boolean createProduct(TakeoutProduct product);

    /**
     * 更新菜品
     */
    boolean updateProduct(TakeoutProduct product);

    /**
     * 删除菜品
     */
    boolean deleteProduct(Long productId);

    /**
     * 批量删除菜品
     */
    boolean batchDeleteProducts(List<Long> productIds);

    /**
     * 更新菜品状态（上架/下架）
     */
    boolean updateProductStatus(Long productId, Integer status);

    /**
     * 更新菜品库存
     */
    boolean updateProductStock(Long productId, Integer stock);

    /**
     * 批量更新菜品库存
     */
    boolean batchUpdateProductStock(List<Long> productIds, Integer stock);

    /**
     * 更新菜品推荐状态
     */
    boolean updateProductRecommendation(Long productId, Integer isRecommended);

}