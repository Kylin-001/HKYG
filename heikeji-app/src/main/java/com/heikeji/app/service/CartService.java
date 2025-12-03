package com.heikeji.app.service;

import com.heikeji.app.model.response.AppResponse;

/**
 * 购物车服务接口
 */
public interface CartService {

    /**
     * 获取购物车列表
     */
    AppResponse<?> getCartList();

    /**
     * 添加商品到购物车
     */
    AppResponse<?> addToCart(Long productId, Integer quantity, String skuId);

    /**
     * 更新购物车商品数量
     */
    AppResponse<?> updateCartItem(Long id, Integer quantity);

    /**
     * 删除购物车商品
     */
    AppResponse<?> deleteCartItem(Long id);

    /**
     * 清空购物车
     */
    AppResponse<?> clearCart();

    /**
     * 批量删除购物车商品
     */
    AppResponse<?> batchDeleteCartItems(Long[] ids);
}