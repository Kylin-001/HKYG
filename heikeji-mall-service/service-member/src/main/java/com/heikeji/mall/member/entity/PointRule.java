package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("point_rule")
public class PointRule {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Integer type;
    
    private String ruleName;
    
    private Integer points;
    
    private String ruleConfig;
    
    private Integer status;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
