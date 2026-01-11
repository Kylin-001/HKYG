package com.heikeji.mall.delivery.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.entity.DeliveryReview;
import com.heikeji.mall.delivery.entity.DeliveryUser;
import com.heikeji.mall.delivery.mapper.DeliveryOrderMapper;
import com.heikeji.mall.delivery.mapper.DeliveryReviewMapper;
import com.heikeji.mall.delivery.mapper.DeliveryUserMapper;
import com.heikeji.mall.delivery.service.DeliveryOrderService;
import com.heikeji.mall.delivery.service.DeliveryReviewService;
import com.heikeji.mall.delivery.vo.DeliveryReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 配送评价服务实现
 */
@Service
public class DeliveryReviewServiceImpl extends ServiceImpl<DeliveryReviewMapper, DeliveryReview> implements DeliveryReviewService {

    @Autowired
    private DeliveryReviewMapper deliveryReviewMapper;

    @Autowired
    private DeliveryOrderMapper deliveryOrderMapper;

    @Autowired
    private DeliveryUserMapper deliveryUserMapper;

    @Autowired
    private DeliveryOrderService deliveryOrderService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long submitReview(DeliveryReview review) {
        // 检查订单是否存在
        DeliveryOrder order = deliveryOrderMapper.selectById(review.getDeliveryOrderId());
        if (order == null) {
            throw new BaseException("订单不存在");
        }

        // 检查订单是否已完成
        if (order.getStatus() != 3) { // 3-已完成
            throw new BaseException("只有已完成的订单才能评价");
        }

        // 检查订单是否已评价
        DeliveryReview existingReview = deliveryReviewMapper.selectByDeliveryOrderId(review.getDeliveryOrderId());
        if (existingReview != null) {
            throw new BaseException("该订单已评价");
        }

        // 设置默认值
        review.setStatus(0); // 正常
        review.setCreateTime(new Date());
        review.setUpdateTime(new Date());
        review.setLikeCount(0);
        review.setHelpfulCount(0);
        review.setIsTop(0); // 未置顶
        review.setIsAnonymous(review.getIsAnonymous() == null ? 0 : review.getIsAnonymous());

        // 保存评价
        save(review);

        return review.getId();
    }

    @Override
    public DeliveryReviewVO getReviewDetail(Long reviewId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null || review.getStatus() == 1) { // 1-已删除
            return null;
        }

        // 构建VO对象
        DeliveryReviewVO vo = new DeliveryReviewVO();
        vo.setId(review.getId());
        vo.setDeliveryOrderId(review.getDeliveryOrderId());
        vo.setDeliveryUserId(review.getDeliveryUserId());
        vo.setUserId(review.getUserId());
        vo.setRating(review.getRating());
        vo.setContent(review.getContent());
        vo.setImages(review.getImages());
        vo.setTags(review.getTags());
        vo.setIsAnonymous(review.getIsAnonymous());
        vo.setReply(review.getReply());
        vo.setReplyTime(review.getReplyTime());
        vo.setCreateTime(review.getCreateTime());
        vo.setLikeCount(review.getLikeCount());
        vo.setHelpfulCount(review.getHelpfulCount());

        // 获取订单信息
        DeliveryOrder order = deliveryOrderMapper.selectById(review.getDeliveryOrderId());
        if (order != null) {
            vo.setOrderNo(order.getOrderNo());
            vo.setOrderType(order.getOrderType());
        }

        // 获取配送员信息
        DeliveryUser deliveryUser = deliveryUserMapper.selectById(review.getDeliveryUserId());
        if (deliveryUser != null) {
            vo.setDeliveryUserName(deliveryUser.getName());
        }

        return vo;
    }

    @Override
    public DeliveryReview getReviewByDeliveryOrderId(Long deliveryOrderId) {
        return deliveryReviewMapper.selectByDeliveryOrderId(deliveryOrderId);
    }

    @Override
    public List<DeliveryReviewVO> getReviewsByDeliveryUserId(Long deliveryUserId, Map<String, Object> params) {
        return deliveryReviewMapper.selectByDeliveryUserId(deliveryUserId, params);
    }

    @Override
    public List<DeliveryReviewVO> getReviewsByUserId(Long userId, Map<String, Object> params) {
        return deliveryReviewMapper.selectByUserId(userId, params);
    }

    @Override
    public Map<String, Object> getReviewStats(Long deliveryUserId) {
        Map<String, Object> stats = deliveryReviewMapper.getReviewStats(deliveryUserId);
        if (stats == null) {
            stats = new HashMap<>();
        }

        // 计算平均评分
        Double avgRating = getAverageRating(deliveryUserId);
        stats.put("averageRating", avgRating);

        // 计算评价数量
        Integer reviewCount = getReviewCount(deliveryUserId);
        stats.put("reviewCount", reviewCount);

        // 计算评价分布
        Map<Integer, Integer> distribution = getRatingDistribution(deliveryUserId);
        stats.put("ratingDistribution", distribution);

        return stats;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean replyReview(Long reviewId, String reply, Long deliveryUserId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null) {
            throw new BaseException("评价不存在");
        }

        // 检查是否是该评价的配送员
        if (!review.getDeliveryUserId().equals(deliveryUserId)) {
            throw new BaseException("无权回复该评价");
        }

        // 更新回复信息
        review.setReply(reply);
        review.setReplyTime(new Date());
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean likeReview(Long reviewId, Long userId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null || review.getStatus() == 1) { // 1-已删除
            throw new BaseException("评价不存在");
        }

        // 增加点赞数量
        review.setLikeCount(review.getLikeCount() + 1);
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean unlikeReview(Long reviewId, Long userId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null || review.getStatus() == 1) { // 1-已删除
            throw new BaseException("评价不存在");
        }

        // 减少点赞数量，确保不小于0
        review.setLikeCount(Math.max(review.getLikeCount() - 1, 0));
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean markHelpful(Long reviewId, Long userId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null || review.getStatus() == 1) { // 1-已删除
            throw new BaseException("评价不存在");
        }

        // 增加有用数量
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean unmarkHelpful(Long reviewId, Long userId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null || review.getStatus() == 1) { // 1-已删除
            throw new BaseException("评价不存在");
        }

        // 减少有用数量，确保不小于0
        review.setHelpfulCount(Math.max(review.getHelpfulCount() - 1, 0));
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteReview(Long reviewId, Long userId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null) {
            throw new BaseException("评价不存在");
        }

        // 检查是否是评价的用户或管理员
        if (!review.getUserId().equals(userId)) {
            throw new BaseException("无权删除该评价");
        }

        // 更新评价状态为已删除
        review.setStatus(1); // 已删除
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean topReview(Long reviewId, Long deliveryUserId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null) {
            throw new BaseException("评价不存在");
        }

        // 检查是否是该评价的配送员
        if (!review.getDeliveryUserId().equals(deliveryUserId)) {
            throw new BaseException("无权置顶该评价");
        }

        // 设置为置顶
        review.setIsTop(1); // 已置顶
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean untopReview(Long reviewId, Long deliveryUserId) {
        // 查询评价信息
        DeliveryReview review = getById(reviewId);
        if (review == null) {
            throw new BaseException("评价不存在");
        }

        // 检查是否是该评价的配送员
        if (!review.getDeliveryUserId().equals(deliveryUserId)) {
            throw new BaseException("无权取消置顶该评价");
        }

        // 取消置顶
        review.setIsTop(0); // 未置顶
        review.setUpdateTime(new Date());

        return updateById(review);
    }

    @Override
    public boolean isOrderReviewed(Long deliveryOrderId) {
        DeliveryReview review = deliveryReviewMapper.selectByDeliveryOrderId(deliveryOrderId);
        return review != null;
    }

    @Override
    public Double getAverageRating(Long deliveryUserId) {
        return deliveryReviewMapper.getAverageRating(deliveryUserId);
    }

    @Override
    public Integer getReviewCount(Long deliveryUserId) {
        return deliveryReviewMapper.getReviewCount(deliveryUserId);
    }

    @Override
    public Map<Integer, Integer> getRatingDistribution(Long deliveryUserId) {
        Map<Integer, Integer> distribution = deliveryReviewMapper.getRatingDistribution(deliveryUserId);
        if (distribution == null) {
            distribution = new HashMap<>();
        }

        // 确保所有评分级别都有数据（1-5星）
        for (int i = 1; i <= 5; i++) {
            distribution.putIfAbsent(i, 0);
        }

        return distribution;
    }
}
