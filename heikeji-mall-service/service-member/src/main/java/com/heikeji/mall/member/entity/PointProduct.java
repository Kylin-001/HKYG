package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("point_product")
public class PointProduct {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private String image;
    
    private Integer points;
    
    private Integer stock;
    
    private Integer soldCount;
    
    private String description;
    
    private Integer status;
    
    private LocalDateTime createTime;
    
    private LocalDateTime updateTime;
}
