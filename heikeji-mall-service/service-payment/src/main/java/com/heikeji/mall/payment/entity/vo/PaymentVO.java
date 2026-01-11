package com.heikeji.mall.payment.entity.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 支付VO类
 * 用于API响应，只返回必要的支付信息，保护敏感数据
 */
@Data
public class PaymentVO {
    private Long id;
    private String orderNo;
    private Long userId;
    private BigDecimal amount;
    private Integer paymentType;
    private Integer status;
    private Date createTime;
    private Date updateTime;
    private String payTradeNo;
    private Date payTime;
    private Integer refundStatus;
    private BigDecimal refundAmount;
}
