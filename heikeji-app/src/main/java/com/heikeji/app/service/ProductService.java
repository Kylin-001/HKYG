package com.heikeji.app.service;

import com.heikeji.app.model.response.AppResponse;

/**
 * 产品服务接口
 */
public interface ProductService {

    /**
     * 获取产品列表
     */
    AppResponse<?> getProductList(Integer page, Integer limit, Long categoryId, String keyword, String sortBy);

    /**
     * 获取产品详情
     */
    AppResponse<?> getProductDetail(Long productId);

    /**
     * 获取推荐产品
     */
    AppResponse<?> getRecommendProducts(Integer limit);

    /**
     * 获取热销产品
     */
    AppResponse<?> getHotProducts(Integer limit);
}