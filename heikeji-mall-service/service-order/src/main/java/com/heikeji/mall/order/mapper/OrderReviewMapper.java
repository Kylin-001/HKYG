package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.order.entity.OrderReview;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 订单评价Mapper接口
 */
@Mapper
public interface OrderReviewMapper extends BaseMapper<OrderReview> {
    
    /**
     * 根据订单编号查询评价列表
     */
    List<OrderReview> selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据用户ID查询评价列表
     */
    List<OrderReview> selectByUserId(@Param("userId") Long userId);
    
    /**
     * 根据商品ID查询评价列表
     */
    List<OrderReview> selectByProductId(@Param("productId") Long productId);
    
    /**
     * 统计商品评分
     */
    Double getAverageRatingByProductId(@Param("productId") Long productId);
    
    /**
     * 统计商品评价数量
     */
    Integer getReviewCountByProductId(@Param("productId") Long productId);
}