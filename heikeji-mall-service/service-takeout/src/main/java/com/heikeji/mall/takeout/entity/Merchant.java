package com.heikeji.mall.takeout.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 商家实体类
 */
@Data
@TableName("takeout_merchant")
public class Merchant implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 商家名称
     */
    private String name;

    /**
     * 商家描述
     */
    private String description;

    /**
     * 商家logo
     */
    private String logo;

    /**
     * 商家地址
     */
    private String address;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 营业时间
     */
    @TableField("business_hours")
    private String businessHours;

    /**
     * 起送价
     */
    @TableField("min_delivery_amount")
    private BigDecimal minPrice;

    /**
     * 配送费
     */
    @TableField("delivery_fee")
    private BigDecimal deliveryFee;

    /**
     * 平均评分
     */
    private BigDecimal rating;

    /**
     * 评分人数
     */
    @TableField("rating_count")
    private Integer ratingCount;

    /**
     * 月销量
     */
    @TableField("monthly_sales")
    private Integer sales;

    /**
     * 状态：0-歇业，1-营业中
     */
    private Integer status;

    /**
     * 是否推荐：0-否，1-是
     */
    @TableField("is_recommended")
    private Integer isRecommended;

    /**
     * 排序
     */
    @TableField("sort_order")
    private Integer sortOrder;

    /**
     * 是否删除：0-否，1-是
     */
    @TableField("is_deleted")
    private Integer isDeleted;

    /**
     * 创建时间
     */
    @TableField("create_time")
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField("update_time")
    private Date updateTime;
}
