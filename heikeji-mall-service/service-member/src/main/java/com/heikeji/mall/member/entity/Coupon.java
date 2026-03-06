package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("coupon")
public class Coupon {
    
    @TableId(type = IdType.AUTO)
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
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
