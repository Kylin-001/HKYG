package com.heikeji.mall.delivery.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.delivery.entity.DeliveryReview;
import com.heikeji.mall.delivery.vo.DeliveryReviewVO;

import java.util.List;
import java.util.Map;

/**
 * 配送评价服务接口
 */
public interface DeliveryReviewService extends IService<DeliveryReview> {

    /**
     * 提交评价
     * @param review 评价信息
     * @return 评价ID
     */
    Long submitReview(DeliveryReview review);

    /**
     * 获取评价详情
     * @param reviewId 评价ID
     * @return 评价详情
     */
    DeliveryReviewVO getReviewDetail(Long reviewId);

    /**
     * 根据配送订单ID获取评价
     * @param deliveryOrderId 配送订单ID
     * @return 评价信息
     */
    DeliveryReview getReviewByDeliveryOrderId(Long deliveryOrderId);

    /**
     * 根据配送员ID获取评价列表
     * @param deliveryUserId 配送员ID
     * @param params 查询参数
     * @return 评价列表
     */
    List<DeliveryReviewVO> getReviewsByDeliveryUserId(Long deliveryUserId, Map<String, Object> params);

    /**
     * 根据用户ID获取评价列表
     * @param userId 用户ID
     * @param params 查询参数
     * @return 评价列表
     */
    List<DeliveryReviewVO> getReviewsByUserId(Long userId, Map<String, Object> params);

    /**
     * 获取配送员评价统计信息
     * @param deliveryUserId 配送员ID
     * @return 评价统计信息
     */
    Map<String, Object> getReviewStats(Long deliveryUserId);

    /**
     * 配送员回复评价
     * @param reviewId 评价ID
     * @param reply 回复内容
     * @param deliveryUserId 配送员ID
     * @return 是否成功
     */
    boolean replyReview(Long reviewId, String reply, Long deliveryUserId);

    /**
     * 点赞评价
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean likeReview(Long reviewId, Long userId);

    /**
     * 取消点赞评价
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean unlikeReview(Long reviewId, Long userId);

    /**
     * 标记评价为有用
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean markHelpful(Long reviewId, Long userId);

    /**
     * 取消标记评价为有用
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean unmarkHelpful(Long reviewId, Long userId);

    /**
     * 删除评价
     * @param reviewId 评价ID
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean deleteReview(Long reviewId, Long userId);

    /**
     * 置顶评价
     * @param reviewId 评价ID
     * @param deliveryUserId 配送员ID
     * @return 是否成功
     */
    boolean topReview(Long reviewId, Long deliveryUserId);

    /**
     * 取消置顶评价
     * @param reviewId 评价ID
     * @param deliveryUserId 配送员ID
     * @return 是否成功
     */
    boolean untopReview(Long reviewId, Long deliveryUserId);

    /**
     * 检查订单是否已评价
     * @param deliveryOrderId 配送订单ID
     * @return 是否已评价
     */
    boolean isOrderReviewed(Long deliveryOrderId);

    /**
     * 获取配送员平均评分
     * @param deliveryUserId 配送员ID
     * @return 平均评分
     */
    Double getAverageRating(Long deliveryUserId);

    /**
     * 获取配送员评价数量
     * @param deliveryUserId 配送员ID
     * @return 评价数量
     */
    Integer getReviewCount(Long deliveryUserId);

    /**
     * 获取评价分布（1-5星）
     * @param deliveryUserId 配送员ID
     * @return 评价分布
     */
    Map<Integer, Integer> getRatingDistribution(Long deliveryUserId);
}
