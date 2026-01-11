package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.OrderReviewLike;

/**
 * 订单评价点赞Service接口
 */
public interface OrderReviewLikeService extends IService<OrderReviewLike> {
    /**
     * 点赞评价
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否点赞成功
     */
    boolean likeReview(Long reviewId, Long userId);
    
    /**
     * 取消点赞评价
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否取消点赞成功
     */
    boolean unlikeReview(Long reviewId, Long userId);
    
    /**
     * 检查用户是否已点赞评价
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否已点赞
     */
    boolean checkUserLiked(Long reviewId, Long userId);
    
    /**
     * 获取评价的点赞数量
     * @param reviewId 评价ID
     * @return 点赞数量
     */
    Integer getReviewLikeCount(Long reviewId);
}
