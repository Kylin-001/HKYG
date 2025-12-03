package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.OrderReview;
import com.heikeji.mall.order.domain.dto.OrderReviewDTO;
import com.heikeji.mall.order.domain.vo.OrderReviewVO;

import java.util.List;

/**
 * 订单评价服务接口
 */
public interface OrderReviewService extends IService<OrderReview> {
    
    /**
     * 提交订单评价
     * @param userId 用户ID
     * @param dto 评价数据传输对象
     * @return 是否成功
     */
    Boolean submitReview(Long userId, OrderReviewDTO dto);
    
    /**
     * 根据订单编号获取评价列表
     * @param orderNo 订单编号
     * @return 评价列表
     */
    List<OrderReviewVO> getReviewsByOrderNo(String orderNo);
    
    /**
     * 根据商品ID获取评价列表
     * @param productId 商品ID
     * @param page 页码
     * @param limit 每页数量
     * @return 评价列表
     */
    List<OrderReviewVO> getReviewsByProductId(Long productId, Integer page, Integer limit);
    
    /**
     * 根据用户ID获取评价列表
     * @param userId 用户ID
     * @param page 页码
     * @param limit 每页数量
     * @return 评价列表
     */
    List<OrderReviewVO> getReviewsByUserId(Long userId, Integer page, Integer limit);
    
    /**
     * 获取商品的平均评分
     * @param productId 商品ID
     * @return 平均评分
     */
    Double getAverageRatingByProductId(Long productId);
    
    /**
     * 获取商品的评价数量
     * @param productId 商品ID
     * @return 评价数量
     */
    Integer getReviewCountByProductId(Long productId);
    
    /**
     * 检查订单是否已评价
     * @param orderNo 订单编号
     * @return 是否已评价
     */
    Boolean isOrderReviewed(String orderNo);
    
    /**
     * 获取订单中可评价的商品列表
     * @param orderNo 订单编号
     * @param userId 用户ID
     * @return 可评价商品列表
     */
    List<Long> getReviewableProducts(String orderNo, Long userId);
}