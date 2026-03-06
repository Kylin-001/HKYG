package com.heikeji.mall.member.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MarketingActivityDTO {
    
    private Long id;
    
    private String name;
    
    private Integer type;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private Integer status;
    
    private String config;
    
    private String description;
    
    private Boolean canParticipate;
    
    private Boolean isCompleted;
}
