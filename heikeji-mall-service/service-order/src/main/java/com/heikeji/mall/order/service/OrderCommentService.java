package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.OrderComment;

import java.util.List;
import java.util.Map;

/**
 * 订单评价Service
 */
public interface OrderCommentService extends IService<OrderComment> {
    /**
     * 提交订单评价
     * @param orderComment 订单评价
     * @return 是否成功
     */
    boolean submitOrderComment(OrderComment orderComment);
    
    /**
     * 根据订单ID获取订单评价
     * @param orderId 订单ID
     * @return 订单评价列表
     */
    List<OrderComment> getOrderCommentsByOrderId(Long orderId);
    
    /**
     * 根据商品ID获取商品评价
     * @param productId 商品ID
     * @return 商品评价列表
     */
    List<OrderComment> getProductComments(Long productId);
    
    /**
     * 根据商品ID获取商品评价（分页）
     * @param productId 商品ID
     * @param page 页码
     * @param limit 每页条数
     * @return 商品评价分页结果
     */
    Map<String, Object> getProductCommentsByPage(Long productId, Integer page, Integer limit);
    
    /**
     * 获取商品评价统计
     * @param productId 商品ID
     * @return 评价统计信息
     */
    Map<String, Object> getProductCommentStatistics(Long productId);
    
    /**
     * 更新订单评价状态
     * @param id 评价ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateCommentStatus(Long id, Integer status);
    
    /**
     * 回复订单评价
     * @param id 评价ID
     * @param replyContent 回复内容
     * @return 是否成功
     */
    boolean replyOrderComment(Long id, String replyContent);
    
    /**
     * 删除订单评价
     * @param id 评价ID
     * @return 是否成功
     */
    boolean deleteOrderComment(Long id);
}