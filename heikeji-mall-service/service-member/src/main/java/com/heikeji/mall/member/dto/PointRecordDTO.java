package com.heikeji.mall.member.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PointRecordDTO {
    
    private Long id;
    
    private Long userId;
    
    private Integer points;
    
    private Integer balance;
    
    private Integer type;
    
    private String source;
    
    private String orderNo;
    
    private String remark;
    
    private LocalDateTime createTime;
    
    private String typeText;
}
