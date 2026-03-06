package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("point_record")
public class PointRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private Integer points;
    
    private Integer balance;
    
    private Integer type;
    
    private String source;
    
    private String orderNo;
    
    private String remark;
    
    private LocalDateTime createTime;
}
