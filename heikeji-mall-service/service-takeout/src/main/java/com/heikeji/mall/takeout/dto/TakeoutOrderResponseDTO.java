package com.heikeji.mall.takeout.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 外卖订单响应DTO
 */
@Data
public class TakeoutOrderResponseDTO {
    private Long id;
    private String orderSn;
    private Long merchantId;
    private String merchantName;
    private Long userId;
    private String deliveryMethod;
    private String deliveryLocation;
    private String receiverName;
    private String receiverPhone;
    private String deliveryStatus;
    private String deliveryStatusText;
    private Long courierId;
    private String courierName;
    private BigDecimal totalAmount;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}