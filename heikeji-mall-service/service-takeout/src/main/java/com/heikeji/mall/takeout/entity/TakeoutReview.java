package com.heikeji.mall.takeout.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

/**
 * 外卖评价实体类
 */
@Data
@TableName("takeout_review")
public class TakeoutReview implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 评分，1-5星
     */
    private Integer rating;

    /**
     * 评价内容
     */
    private String content;

    /**
     * 评价图片（JSON数组格式）
     */
    private String images;

    /**
     * 评价类型，0-商品评价 1-商家评价
     */
    private Integer type;

    /**
     * 是否匿名，0-否 1-是
     */
    private Integer isAnonymous;

    /**
     * 商家回复
     */
    private String reply;

    /**
     * 回复时间
     */
    private Date replyTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 评价标签（JSON数组格式）
     */
    private String tags;

    /**
     * 有用数量
     */
    private Integer helpfulCount;

    /**
     * 更新时间
     */
    private Date updateTime;

}