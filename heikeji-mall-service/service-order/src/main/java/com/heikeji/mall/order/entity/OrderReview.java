package com.heikeji.mall.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 订单评价实体类
 */
@Data
@TableName("order_review")
public class OrderReview {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 订单编号
     */
    private String orderNo;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 评分（1-5星）
     */
    private Integer rating;
    
    /**
     * 评价内容
     */
    private String content;
    
    /**
     * 评价图片（JSON格式存储图片URL列表）
     */
    private String images;
    
    /**
     * 评价时间
     */
    private Date createTime;
    
    /**
     * 更新时间
     */
    private Date updateTime;
    
    /**
     * 商品名称（冗余字段，便于展示）
     */
    private String productName;
    
    /**
     * 商品图片（冗余字段，便于展示）
     */
    private String productImage;
    
    /**
     * 点赞数量
     */
    private Integer likeCount;
}