package com.heikeji.mall.member.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PointProductDTO {
    
    private Long id;
    
    private String name;
    
    private String image;
    
    private Integer points;
    
    private Integer stock;
    
    private Integer soldCount;
    
    private String description;
    
    private Integer status;
    
    private Boolean canExchange;
}
