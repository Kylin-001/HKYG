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
@TableName("order")
public class Order {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long userId;
    private Long merchantId;
    private Long shopId;
    private Integer orderType;
    private BigDecimal totalAmount;
    private BigDecimal payAmount;
    private BigDecimal freightAmount;
    private BigDecimal deliveryFee;
    private String deliveryDormBuilding;
    private String deliveryDormRoom;
    private Long addressId;
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private Integer deliveryType;
    private String deliveryLockerCode;
    private String deliverySpecialPlace;
    private Integer status;
    private Integer payStatus;
    private Integer payType;
    private Date payTime;
    private Date deliveryTime;
    private Date completeTime;
    private String remark;
    private String orderRemark;
    private String couponCode;
    private String payTradeNo;
    private Date createTime;
    private Date updateTime;
    private Date endTime;
    @TableField("version")
    private Integer version;
}
