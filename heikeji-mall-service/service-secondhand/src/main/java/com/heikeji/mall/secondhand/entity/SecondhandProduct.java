package com.heikeji.mall.secondhand.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 二手商品实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("secondhand_product")
public class SecondhandProduct {

    /**
     * 商品ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 商品名称
     */
    @TableField("product_name")
    private String productName;

    /**
     * 商品描述
     */
    @TableField("product_desc")
    private String productDesc;

    /**
     * 商品分类ID
     */
    @TableField("category_id")
    private Long categoryId;

    /**
     * 商品价格
     */
    @TableField("price")
    private BigDecimal price;

    /**
     * 商品原价
     */
    @TableField("original_price")
    private BigDecimal originalPrice;

    /**
     * 商品状态：0-待审核，1-上架，2-下架，3-已售出，4-审核失败
     */
    @TableField("status")
    private Integer status;

    /**
     * 商品图片，多个图片用逗号分隔
     */
    @TableField("images")
    private String images;

    /**
     * 商品标签，多个标签用逗号分隔
     */
    @TableField("tags")
    private String tags;

    /**
     * 商品成色：0-全新，1-九成新，2-八成新，3-七成新，4-六成新及以下
     */
    @TableField("condition")
    private Integer condition;

    /**
     * 浏览量
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 收藏量
     */
    @TableField("collect_count")
    private Integer collectCount;

    /**
     * 留言数
     */
    @TableField("comment_count")
    private Integer commentCount;

    /**
     * 交易方式：0-面交，1-快递，2-均可
     */
    @TableField("trade_type")
    private Integer tradeType;

    /**
     * 交易地点
     */
    @TableField("trade_location")
    private String tradeLocation;

    /**
     * 审核意见
     */
    @TableField("audit_remark")
    private String auditRemark;

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

    /**
     * 删除标记：0-正常，1-删除
     */
    @TableField("del_flag")
    private Integer delFlag;

}