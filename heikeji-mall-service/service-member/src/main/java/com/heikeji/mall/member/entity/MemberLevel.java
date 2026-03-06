package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("member_level")
public class MemberLevel {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private Integer minPoints;
    
    private Integer maxPoints;
    
    private BigDecimal discount;
    
    private String description;
    
    private String privileges;
    
    private Integer status;
    
    private Integer sort;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
