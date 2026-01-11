package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.entity.OrderReview;
import com.heikeji.mall.order.entity.OrderReviewLike;
import com.heikeji.mall.order.mapper.OrderReviewLikeMapper;
import com.heikeji.mall.order.mapper.OrderReviewMapper;
import com.heikeji.mall.order.service.OrderReviewLikeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 订单评价点赞Service实现类
 */
@Service
@Slf4j
public class OrderReviewLikeServiceImpl extends ServiceImpl<OrderReviewLikeMapper, OrderReviewLike> implements OrderReviewLikeService {
    
    @Autowired
    private OrderReviewLikeMapper orderReviewLikeMapper;
    
    @Autowired
    private OrderReviewMapper orderReviewMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean likeReview(Long reviewId, Long userId) {
        log.info("用户{}点赞评价{}", userId, reviewId);
        
        // 检查是否已点赞
        QueryWrapper<OrderReviewLike> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("review_id", reviewId);
        queryWrapper.eq("user_id", userId);
        
        if (orderReviewLikeMapper.selectCount(queryWrapper) > 0) {
            log.warn("用户{}已点赞评价{}", userId, reviewId);
            return false;
        }
        
        // 添加点赞记录
        OrderReviewLike like = new OrderReviewLike();
        like.setReviewId(reviewId);
        like.setUserId(userId);
        like.setCreateTime(new java.util.Date());
        like.setUpdateTime(new java.util.Date());
        
        int insertResult = orderReviewLikeMapper.insert(like);
        
        if (insertResult > 0) {
            // 更新评价的点赞数量
            OrderReview review = orderReviewMapper.selectById(reviewId);
            if (review != null) {
                Integer likeCount = review.getLikeCount() == null ? 0 : review.getLikeCount();
                review.setLikeCount(likeCount + 1);
                orderReviewMapper.updateById(review);
            }
            return true;
        }
        
        return false;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean unlikeReview(Long reviewId, Long userId) {
        log.info("用户{}取消点赞评价{}", userId, reviewId);
        
        // 删除点赞记录
        QueryWrapper<OrderReviewLike> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("review_id", reviewId);
        queryWrapper.eq("user_id", userId);
        
        int deleteResult = orderReviewLikeMapper.delete(queryWrapper);
        
        if (deleteResult > 0) {
            // 更新评价的点赞数量
            OrderReview review = orderReviewMapper.selectById(reviewId);
            if (review != null) {
                Integer likeCount = review.getLikeCount() == null ? 0 : review.getLikeCount();
                review.setLikeCount(Math.max(0, likeCount - 1));
                orderReviewMapper.updateById(review);
            }
            return true;
        }
        
        return false;
    }
    
    @Override
    public boolean checkUserLiked(Long reviewId, Long userId) {
        QueryWrapper<OrderReviewLike> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("review_id", reviewId);
        queryWrapper.eq("user_id", userId);
        
        return orderReviewLikeMapper.selectCount(queryWrapper) > 0;
    }
    
    @Override
    public Integer getReviewLikeCount(Long reviewId) {
        QueryWrapper<OrderReviewLike> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("review_id", reviewId);
        
        return Math.toIntExact(orderReviewLikeMapper.selectCount(queryWrapper));
    }
}
