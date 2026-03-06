package com.heikeji.mall.member.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_activity_record")
public class UserActivityRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private Long activityId;
    
    private Integer rewardType;
    
    private String rewardValue;
    
    private Integer status;
    
    private LocalDateTime completeTime;
    
    private LocalDateTime createTime;
}
