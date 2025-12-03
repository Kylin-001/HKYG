package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.TakeoutReview;
import com.heikeji.mall.takeout.mapper.TakeoutReviewMapper;
import com.heikeji.mall.takeout.service.TakeoutReviewService;
import com.heikeji.mall.takeout.utils.FileUploadUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * 外卖评价服务实现类
 */
@Service
public class TakeoutReviewServiceImpl extends ServiceImpl<TakeoutReviewMapper, TakeoutReview> implements TakeoutReviewService {

    private static final Logger log = LoggerFactory.getLogger(TakeoutReviewServiceImpl.class);

    @Autowired
    private TakeoutReviewMapper takeoutReviewMapper;

    @Autowired
    private FileUploadUtils fileUploadUtils;

    @Override
    public TakeoutReview createReview(TakeoutReview review) {
        // 设置创建时间和更新时间
        review.setCreateTime(new Date());
        review.setUpdateTime(new Date());
        
        // 保存评价
        takeoutReviewMapper.insert(review);
        
        return review;
    }

    @Override
    public List<TakeoutReview> getReviewsByMerchantId(Long merchantId) {
        return takeoutReviewMapper.selectByMerchantId(merchantId);
    }

    @Override
    public List<TakeoutReview> getReviewsByUserId(Long userId) {
        return takeoutReviewMapper.selectByUserId(userId);
    }

    @Override
    public TakeoutReview getReviewByOrderId(Long orderId) {
        return takeoutReviewMapper.selectByOrderId(orderId);
    }

    @Override
    public List<TakeoutReview> getHighRatingReviews(Long merchantId, Integer limit) {
        return takeoutReviewMapper.selectHighRatingReviews(merchantId, limit);
    }

    @Override
    public boolean replyReview(Long reviewId, String reply) {
        TakeoutReview review = takeoutReviewMapper.selectById(reviewId);
        if (review == null) {
            return false;
        }
        
        // 更新回复信息
        review.setReply(reply);
        review.setReplyTime(new Date());
        review.setUpdateTime(new Date());
        
        return takeoutReviewMapper.updateById(review) > 0;
    }

    @Override
    public List<String> uploadReviewImages(List<MultipartFile> files) throws IOException {
        return fileUploadUtils.uploadImages(files);
    }

    @Override
    public boolean deleteReviewImage(String imageUrl) {
        try {
            fileUploadUtils.deleteImage(imageUrl);
            return true;
        } catch (Exception e) {
            log.error("删除图片失败: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateHelpfulCount(Long reviewId) {
        // 直接使用mapper的updateHelpfulCount方法进行批量更新
        return takeoutReviewMapper.updateHelpfulCount(reviewId) > 0;
    }

    @Override
    public List<TakeoutReview> getReviewsByTags(Long merchantId, List<String> tags) {
        // 实现根据标签查询评价的逻辑
        return takeoutReviewMapper.selectByTags(merchantId, tags);
    }

}