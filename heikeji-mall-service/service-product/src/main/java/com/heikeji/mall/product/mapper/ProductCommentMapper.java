package com.heikeji.mall.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.product.entity.ProductComment;
import com.heikeji.mall.product.entity.ProductCommentStats;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 商品评价Mapper接口
 */
public interface ProductCommentMapper extends BaseMapper<ProductComment> {
    /**
     * 获取商品评价统计
     * @param productId 商品ID
     * @return 评价统计
     */
    ProductCommentStats getCommentStats(@Param("productId") Long productId);
    
    /**
     * 获取商品评价列表
     * @param productId 商品ID
     * @param score 评分
     * @param hasImage 是否有图片
     * @param page 页码
     * @param size 每页大小
     * @return 评价列表
     */
    List<ProductComment> getCommentList(@Param("productId") Long productId, 
                                       @Param("score") Integer score, 
                                       @Param("hasImage") Integer hasImage, 
                                       @Param("page") Integer page, 
                                       @Param("size") Integer size);
    
    /**
     * 获取用户评价列表
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 评价列表
     */
    List<ProductComment> getUserCommentList(@Param("userId") Long userId, 
                                           @Param("page") Integer page, 
                                           @Param("size") Integer size);
    
    /**
     * 统计评价数量
     * @param productId 商品ID
     * @param score 评分
     * @param hasImage 是否有图片
     * @return 评价数量
     */
    Integer countComments(@Param("productId") Long productId, 
                         @Param("score") Integer score, 
                         @Param("hasImage") Integer hasImage);
    
    /**
     * 更新商品评价统计
     * @param productId 商品ID
     * @return 更新数量
     */
    Integer updateCommentStats(@Param("productId") Long productId);
    
    /**
     * 计算商品评价统计
     * @param productId 商品ID
     * @return 评价统计数据
     */
    Map<String, Object> calculateCommentStats(@Param("productId") Long productId);
}
