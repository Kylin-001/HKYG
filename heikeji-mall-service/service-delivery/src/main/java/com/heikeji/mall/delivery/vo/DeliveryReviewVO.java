package com.heikeji.mall.delivery.vo;

import lombok.Data;

import java.util.Date;

/**
 * 配送评价VO
 */
@Data
public class DeliveryReviewVO {
    /**
     * 评价ID
     */
    private Long id;
    /**
     * 配送订单ID
     */
    private Long deliveryOrderId;
    /**
     * 订单号
     */
    private String orderNo;
    /**
     * 配送员ID
     */
    private Long deliveryUserId;
    /**
     * 配送员姓名
     */
    private String deliveryUserName;
    /**
     * 用户ID
     */
    private Long userId;
    /**
     * 用户名（匿名则显示"匿名用户"）
     */
    private String userName;
    /**
     * 评分（1-5星）
     */
    private Integer rating;
    /**
     * 评价内容
     */
    private String content;
    /**
     * 评价图片（JSON格式）
     */
    private String images;
    /**
     * 评价标签（JSON格式）
     */
    private String tags;
    /**
     * 是否匿名评价（0-否，1-是）
     */
    private Integer isAnonymous;
    /**
     * 配送员回复
     */
    private String reply;
    /**
     * 回复时间
     */
    private Date replyTime;
    /**
     * 评价时间
     */
    private Date createTime;
    /**
     * 点赞数量
     */
    private Integer likeCount;
    /**
     * 有用数量
     */
    private Integer helpfulCount;
    /**
     * 评价类型文本
     */
    private String ratingText;
    /**
     * 订单类型
     */
    private Integer orderType;
    /**
     * 订单类型文本
     */
    private String orderTypeText;

    /**
     * 获取评分文本
     * @return 评分文本
     */
    public String getRatingText() {
        switch (rating) {
            case 1: return "非常不满意";
            case 2: return "不满意";
            case 3: return "一般";
            case 4: return "满意";
            case 5: return "非常满意";
            default: return "未知";
        }
    }

    /**
     * 获取订单类型文本
     * @return 订单类型文本
     */
    public String getOrderTypeText() {
        switch (orderType) {
            case 1: return "快递取件";
            case 2: return "快递送件";
            case 3: return "跑腿代购";
            case 4: return "文件配送";
            default: return "未知";
        }
    }

    /**
     * 获取用户名（匿名处理）
     * @return 用户名
     */
    public String getUserName() {
        if (isAnonymous != null && isAnonymous == 1) {
            return "匿名用户";
        }
        return userName;
    }
}
