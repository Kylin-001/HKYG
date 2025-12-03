package com.heikeji.mall.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.product.entity.ProductViewHistory;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户浏览历史Mapper接口
 * @author heikeji
 * @date 2024-04-21
 */
public interface ProductViewHistoryMapper extends BaseMapper<ProductViewHistory> {

    /**
     * 记录或更新用户浏览历史
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 影响行数
     */
    int recordOrUpdateViewHistory(@Param("userId") Long userId, @Param("productId") Long productId);

    /**
     * 根据用户ID获取最近浏览的商品ID列表
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 商品ID列表
     */
    List<Long> getRecentViewedProductIds(@Param("userId") Long userId, @Param("limit") Integer limit);

    /**
     * 根据用户ID获取浏览最多的商品分类ID列表
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 分类ID列表
     */
    List<Long> getMostViewedCategoryIds(@Param("userId") Long userId, @Param("limit") Integer limit);

    /**
     * 根据用户ID和商品ID删除浏览记录
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 影响行数
     */
    int deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    /**
     * 根据用户ID删除所有浏览记录
     * @param userId 用户ID
     * @return 影响行数
     */
    int deleteByUserId(@Param("userId") Long userId);
}