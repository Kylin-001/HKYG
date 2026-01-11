package com.heikeji.mall.delivery.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.delivery.entity.DeliveryReview;
import com.heikeji.mall.delivery.vo.DeliveryReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 配送评价Mapper
 */
@Mapper
public interface DeliveryReviewMapper extends BaseMapper<DeliveryReview> {

    /**
     * 根据配送订单ID查询评价
     * @param deliveryOrderId 配送订单ID
     * @return 评价信息
     */
    DeliveryReview selectByDeliveryOrderId(@Param("deliveryOrderId") Long deliveryOrderId);

    /**
     * 根据配送员ID查询评价列表
     * @param deliveryUserId 配送员ID
     * @param params 查询参数
     * @return 评价列表
     */
    List<DeliveryReviewVO> selectByDeliveryUserId(@Param("deliveryUserId") Long deliveryUserId, @Param("params") Map<String, Object> params);

    /**
     * 根据用户ID查询评价列表
     * @param userId 用户ID
     * @param params 查询参数
     * @return 评价列表
     */
    List<DeliveryReviewVO> selectByUserId(@Param("userId") Long userId, @Param("params") Map<String, Object> params);

    /**
     * 获取配送评价统计信息
     * @param deliveryUserId 配送员ID
     * @return 评价统计信息
     */
    Map<String, Object> getReviewStats(@Param("deliveryUserId") Long deliveryUserId);

    /**
     * 查询配送员的平均评分
     * @param deliveryUserId 配送员ID
     * @return 平均评分
     */
    Double getAverageRating(@Param("deliveryUserId") Long deliveryUserId);

    /**
     * 查询配送员的评价数量
     * @param deliveryUserId 配送员ID
     * @return 评价数量
     */
    Integer getReviewCount(@Param("deliveryUserId") Long deliveryUserId);

    /**
     * 查询评价分布（1-5星）
     * @param deliveryUserId 配送员ID
     * @return 评价分布
     */
    Map<Integer, Integer> getRatingDistribution(@Param("deliveryUserId") Long deliveryUserId);
}
