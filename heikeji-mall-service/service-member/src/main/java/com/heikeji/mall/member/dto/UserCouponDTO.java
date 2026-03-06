package com.heikeji.mall.member.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserCouponDTO {
    
    private Long id;
    
    private Long userId;
    
    private Long couponId;
    
    private String couponName;
    
    private Integer type;
    
    private Integer status;
    
    private LocalDateTime usedAt;
    
    private String orderNo;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
    
    private Boolean canUse;
    
    private String statusText;
}
