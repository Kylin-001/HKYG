package com.heikeji.mall.delivery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 配送评价实体
 */
@Data
@TableName("delivery_review")
public class DeliveryReview {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 配送订单ID
     */
    private Long deliveryOrderId;

    /**
     * 用户ID（评价人）
     */
    private Long userId;

    /**
     * 配送员ID（被评价人）
     */
    private Long deliveryUserId;

    /**
     * 评价评分（1-5星）
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
     * 评价状态：0-正常，1-已删除
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否置顶：0-否，1-是
     */
    private Integer isTop;

    /**
     * 点赞数量
     */
    private Integer likeCount;

    /**
     * 有用数量
     */
    private Integer helpfulCount;
}
