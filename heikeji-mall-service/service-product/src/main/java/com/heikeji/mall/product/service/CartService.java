package com.heikeji.mall.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.product.entity.Cart;

import java.util.List;

/**
 * 购物车Service接口
 */
public interface CartService extends IService<Cart> {
    
    /**
     * 添加购物车
     * @param cart 购物车对象
     * @return 是否成功
     */
    boolean addCart(Cart cart);
    
    /**
     * 更新购物车商品数量
     * @param userId 用户ID
     * @param productId 商品ID
     * @param quantity 数量
     * @return 是否成功
     */
    boolean updateQuantity(Long userId, Long productId, Integer quantity);
    
    /**
     * 更新购物车商品选中状态
     * @param userId 用户ID
     * @param productId 商品ID
     * @param selected 是否选中(0:未选中, 1:选中)
     * @return 是否成功
     */
    boolean updateSelectedStatus(Long userId, Long productId, Integer selected);
    
    /**
     * 批量更新购物车商品选中状态
     * @param userId 用户ID
     * @param productIds 商品ID列表
     * @param selected 是否选中(0:未选中, 1:选中)
     * @return 是否成功
     */
    boolean updateBatchSelectedStatus(Long userId, List<Long> productIds, Integer selected);
    
    /**
     * 更新用户所有购物车商品选中状态
     * @param userId 用户ID
     * @param selected 是否选中(0:未选中, 1:选中)
     * @return 是否成功
     */
    boolean updateAllSelectedStatus(Long userId, Integer selected);

    /**
     * 删除购物车商品
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 是否成功
     */
    boolean deleteCart(Long userId, Long productId);
    
    /**
     * 批量删除购物车商品
     * @param userId 用户ID
     * @param productIds 商品ID列表
     * @return 是否成功
     */
    boolean deleteBatchCart(Long userId, List<Long> productIds);
    
    /**
     * 清空购物车
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean clearCart(Long userId);
    
    /**
     * 根据用户ID获取购物车列表
     * @param userId 用户ID
     * @return 购物车列表
     */
    List<Cart> getCartList(Long userId);
    
    /**
     * 获取用户购物车商品总数
     * @param userId 用户ID
     * @return 商品总数
     */
    int getCartItemCount(Long userId);
    
    /**
     * 获取用户选中的购物车商品
     * @param userId 用户ID
     * @return 选中的购物车商品列表
     */
    List<Cart> getSelectedCartItems(Long userId);
    
    /**
     * 检查购物车商品库存
     * @param userId 用户ID
     * @return 库存不足的商品信息列表
     */
    List<String> checkCartStock(Long userId);
    
    /**
     * 添加商品到购物车
     * @param userId 用户ID
     * @param productId 商品ID
     * @param quantity 数量
     * @return 购物车对象
     */
    Cart addToCart(Long userId, Long productId, Integer quantity);
}