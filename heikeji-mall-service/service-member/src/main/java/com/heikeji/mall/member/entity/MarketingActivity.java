package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("marketing_activity")
public class MarketingActivity {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private Integer type;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private Integer status;
    
    private String config;
    
    private String description;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
