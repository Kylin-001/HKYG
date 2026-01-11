package com.heikeji.mall.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 璁㈠崟涓昏〃瀹炰綋绫?
 */
@Data
@TableName("`order`")
public class Order {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long userId;
    @TableField("store_id")
    private Long merchantId;
    @TableField(exist = false)
    private Long shopId;
    @TableField(exist = false)
    private Integer orderType;
    private BigDecimal totalAmount;
    private BigDecimal payAmount;
    @TableField(exist = false)
    private BigDecimal freightAmount;
    private BigDecimal deliveryFee;
    @TableField(exist = false)
    private String deliveryDormBuilding;
    @TableField(exist = false)
    private String deliveryDormRoom;
    @TableField(exist = false)
    private Long addressId;
    @TableField("contact_name")
    private String receiverName;
    @TableField("contact_phone")
    private String receiverPhone;
    @TableField("delivery_address")
    private String receiverAddress;
    private Integer deliveryType;
    private String deliveryLockerCode;
    @TableField(exist = false)
    private String deliverySpecialPlace;
    private Integer status;
    private Integer payStatus;
    @TableField(exist = false)
    private Integer payType;
    @TableField("paid_at")
    private Date payTime;
    @TableField("delivered_at")
    private Date deliveryTime;
    @TableField("completed_at")
    private Date completeTime;
    @TableField("remarks")
    private String remark;
    @TableField(exist = false)
    private String orderRemark;
    @TableField(exist = false)
    private String couponCode;
    @TableField(exist = false)
    private String payTradeNo;
    @TableField("created_at")
    private Date createTime;
    @TableField("updated_at")
    private Date updateTime;
    @TableField(exist = false)
    private Date endTime;
    @TableField(exist = false)
    private Integer version;
    
    // 退款相关字段（数据库中不存在）
    @TableField(exist = false)
    private Integer refundStatus;
    @TableField(exist = false)
    private BigDecimal refundAmount;
    @TableField(exist = false)
    private String refundReason;
    @TableField(exist = false)
    private String refundReviewRemark;
    @TableField(exist = false)
    private Date refundApplyTime;
    @TableField(exist = false)
    private Date refundReviewTime;
    @TableField(exist = false)
    private Date refundSuccessTime;
    @TableField(exist = false)
    private Long refundOperatorId;
    @TableField(exist = false)
    private String refundOperatorName;
}
