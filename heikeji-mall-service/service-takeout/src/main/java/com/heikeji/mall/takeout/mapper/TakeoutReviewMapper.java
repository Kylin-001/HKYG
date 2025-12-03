package com.heikeji.mall.takeout.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.takeout.entity.TakeoutReview;

import java.util.List;

/**
 * 外卖评价Mapper接口
 */
public interface TakeoutReviewMapper extends BaseMapper<TakeoutReview> {

    /**
     * 根据商家ID查询评价列表
     */
    List<TakeoutReview> selectByMerchantId(Long merchantId);

    /**
     * 根据用户ID查询评价列表
     */
    List<TakeoutReview> selectByUserId(Long userId);

    /**
     * 根据订单ID查询评价
     */
    TakeoutReview selectByOrderId(Long orderId);

    /**
     * 查询高分评价
     */
    List<TakeoutReview> selectHighRatingReviews(Long merchantId, Integer limit);

    /**
     * 根据标签查询评价
     */
    List<TakeoutReview> selectByTags(Long merchantId, List<String> tags);

    /**
     * 更新评价有用数量
     */
    int updateHelpfulCount(Long reviewId);

}