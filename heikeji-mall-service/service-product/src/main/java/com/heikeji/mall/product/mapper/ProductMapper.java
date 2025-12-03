package com.heikeji.mall.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.product.dto.ProductSearchDTO;
import com.heikeji.mall.product.entity.Product;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品Mapper接口
 */
public interface ProductMapper extends BaseMapper<Product> {

    /**
     * 分页查询商品列表
     */
    Page<Product> selectProductPage(Page<Product> page, 
                                   @Param("categoryId") Long categoryId,
                                   @Param("keyword") String keyword,
                                   @Param("status") Integer status);

    /**
     * 根据商家ID查询商品列表
     */
    List<Product> selectByMerchantId(@Param("merchantId") Long merchantId);

    /**
     * 根据分类ID查询商品列表
     */
    List<Product> selectByCategoryId(@Param("categoryId") Long categoryId);

    /**
     * 更新商品库存
     */
    int updateStock(@Param("id") Long id, @Param("quantity") Integer quantity);

    /**
     * 更新商品销量
     */
    int updateSales(@Param("id") Long id, @Param("sales") Integer sales);
    
    /**
     * 扣减商品库存（使用乐观锁）
     */
    int deductStock(@Param("id") Long id, @Param("quantity") Integer quantity, @Param("version") Integer version);
    
    /**
     * 恢复商品库存（使用乐观锁）
     */
    int restoreStock(@Param("id") Long id, @Param("quantity") Integer quantity, @Param("version") Integer version);
    
    /**
     * 锁定商品库存（使用乐观锁）
     */
    int lockStock(@Param("id") Long id, @Param("quantity") Integer quantity, @Param("version") Integer version);
    
    /**
     * 释放锁定的商品库存（使用乐观锁）
     */
    int unlockStock(@Param("id") Long id, @Param("quantity") Integer quantity, @Param("version") Integer version);
    
    /**
     * 高级搜索商品（支持多条件和排序）
     */
    Page<Product> advancedSearch(Page<Product> page, @Param("search") ProductSearchDTO searchDTO);
    
    /**
     * 根据分类和子分类查询商品
     */
    List<Product> selectByCategoryAndChildren(@Param("categoryId") Long categoryId);
    
    /**
     * 查询热门商品
     */
    List<Product> selectHotProducts(@Param("limit") Integer limit);
    
    /**
     * 查询新品
     */
    List<Product> selectNewProducts(@Param("limit") Integer limit);
    
    /**
     * 查询推荐商品
     */
    List<Product> selectRecommendProducts(@Param("limit") Integer limit);
    
    /**
     * 根据用户浏览历史推荐商品
     */
    List<Product> selectPersonalizedRecommendProducts(
            @Param("userId") Long userId,
            @Param("recentProductIds") List<Long> recentProductIds,
            @Param("categoryIds") List<Long> categoryIds,
            @Param("excludedProductIds") List<Long> excludedProductIds,
            @Param("limit") Integer limit);
    
    /**
     * 获取用户购买过的商品分类
     */
    List<Long> selectUserPurchasedCategoryIds(@Param("userId") Long userId, @Param("limit") Integer limit);
    
    /**
     * 获取用户购买过的商品ID列表
     */
    List<Long> selectUserPurchasedProductIds(@Param("userId") Long userId, @Param("limit") Integer limit);
}