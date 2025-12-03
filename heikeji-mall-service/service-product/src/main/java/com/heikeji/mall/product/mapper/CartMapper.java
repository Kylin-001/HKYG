package com.heikeji.mall.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.product.entity.Cart;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 购物车Mapper接口
 */
public interface CartMapper extends BaseMapper<Cart> {
    
    /**
     * 根据用户ID和商品ID查询购物车记录
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 购物车记录
     */
    Cart selectByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    /**
     * 根据用户ID查询购物车列表
     * @param userId 用户ID
     * @return 购物车列表
     */
    List<Cart> selectByUserId(Long userId);
    
    /**
     * 根据用户ID删除购物车记录
     * @param userId 用户ID
     * @return 删除数量
     */
    int deleteByUserId(Long userId);
    
    /**
     * 根据用户ID和商品ID列表删除购物车记录
     * @param userId 用户ID
     * @param productIds 商品ID列表
     * @return 删除数量
     */
    int deleteByUserIdAndProductIds(@Param("userId") Long userId, @Param("productIds") List<Long> productIds);
    
    /**
     * 根据用户ID和商品ID删除购物车记录
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 删除数量
     */
    int deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    /**
     * 更新购物车商品数量
     * @param userId 用户ID
     * @param productId 商品ID
     * @param quantity 数量
     * @return 更新数量
     */
    int updateQuantity(@Param("userId") Long userId, @Param("productId") Long productId, @Param("quantity") Integer quantity);
    
    /**
     * 更新购物车商品选中状态
     * @param userId 用户ID
     * @param productId 商品ID
     * @param selected 是否选中
     * @return 更新数量
     */
    int updateSelectedStatus(@Param("userId") Long userId, @Param("productId") Long productId, @Param("selected") Integer selected);
    
    /**
     * 批量更新购物车商品选中状态
     * @param userId 用户ID
     * @param productIds 商品ID列表
     * @param selected 是否选中
     * @return 更新数量
     */
    int updateBatchSelectedStatus(@Param("userId") Long userId, @Param("productIds") List<Long> productIds, @Param("selected") Integer selected);
    
    /**
     * 更新用户所有购物车商品选中状态
     * @param userId 用户ID
     * @param selected 是否选中
     * @return 更新数量
     */
    int updateAllSelectedStatus(@Param("userId") Long userId, @Param("selected") Integer selected);
    
    /**
     * 查询购物车商品总数
     * @param userId 用户ID
     * @return 商品总数
     */
    int selectCartItemCount(@Param("userId") Long userId);
    
    /**
     * 查询用户选中的购物车商品
     * @param userId 用户ID
     * @return 选中的购物车商品列表
     */
    List<Cart> selectSelectedCartItems(@Param("userId") Long userId);
}