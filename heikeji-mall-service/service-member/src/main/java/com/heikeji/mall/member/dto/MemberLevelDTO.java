package com.heikeji.mall.member.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MemberLevelDTO {
    
    private Long id;
    
    private String name;
    
    private Integer minPoints;
    
    private Integer maxPoints;
    
    private BigDecimal discount;
    
    private String description;
    
    private String privileges;
    
    private Integer status;
    
    private Integer sort;
    
    private Boolean isCurrent;
}
