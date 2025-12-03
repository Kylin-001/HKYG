package com.heikeji.mall.takeout.mapper;

import com.heikeji.mall.takeout.entity.TakeoutProduct;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 外卖商品Mapper接口
 */
@Mapper
public interface TakeoutProductMapper extends BaseMapper<TakeoutProduct> {

    /**
     * 根据商家ID获取商品列表
     * @param merchantId 商家ID
     * @return 商品列表
     */
    List<TakeoutProduct> selectByMerchantId(@Param("merchantId") Long merchantId);

    /**
     * 根据分类获取商品列表
     * @param categoryId 分类ID
     * @return 商品列表
     */
    List<TakeoutProduct> selectByCategory(@Param("categoryId") Long categoryId);

    /**
     * 搜索商品
     * @param keyword 关键词
     * @param merchantId 商家ID（可选）
     * @return 商品列表
     */
    List<TakeoutProduct> searchProducts(@Param("keyword") String keyword, 
                                       @Param("merchantId") Long merchantId);

    /**
     * 根据分类ID获取商品列表
     * @param categoryId 分类ID
     * @return 商品列表
     */
    List<TakeoutProduct> selectByCategoryId(@Param("categoryId") Long categoryId);

    /**
     * 获取推荐商品
     * @param merchantId 商家ID
     * @param limit 限制数量
     * @return 推荐商品列表
     */
    List<TakeoutProduct> selectRecommendedProducts(@Param("merchantId") Long merchantId, 
                                                   @Param("limit") Integer limit);
}