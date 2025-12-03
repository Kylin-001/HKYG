package com.heikeji.mall.takeout.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.takeout.entity.TakeoutReview;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 外卖评价服务接口
 */
public interface TakeoutReviewService extends IService<TakeoutReview> {

    /**
     * 创建评价
     */
    TakeoutReview createReview(TakeoutReview review);

    /**
     * 根据商家ID获取评价列表
     */
    List<TakeoutReview> getReviewsByMerchantId(Long merchantId);

    /**
     * 根据用户ID获取评价列表
     */
    List<TakeoutReview> getReviewsByUserId(Long userId);

    /**
     * 根据订单ID获取评价
     */
    TakeoutReview getReviewByOrderId(Long orderId);

    /**
     * 获取高评分评价
     */
    List<TakeoutReview> getHighRatingReviews(Long merchantId, Integer limit);

    /**
     * 商家回复评价
     */
    boolean replyReview(Long reviewId, String reply);

    /**
     * 上传评价图片
     */
    List<String> uploadReviewImages(List<MultipartFile> files) throws IOException;

    /**
     * 删除评价图片
     */
    boolean deleteReviewImage(String imageUrl);

    /**
     * 根据标签查询评价
     */
    List<TakeoutReview> getReviewsByTags(Long merchantId, List<String> tags);

    /**
     * 更新评价有用数量
     */
    boolean updateHelpfulCount(Long reviewId);

}