package com.heikeji.mall.member.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponDTO {
    
    private Long id;
    
    private String name;
    
    private String couponCode;
    
    private Integer type;
    
    private BigDecimal value;
    
    private BigDecimal discount;
    
    private BigDecimal minAmount;
    
    private BigDecimal maxAmount;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private Integer totalCount;
    
    private Integer usedCount;
    
    private Integer perUserLimit;
    
    private Integer status;
    
    private String description;
    
    private Integer userReceivedCount;
    
    private Boolean canReceive;
}
