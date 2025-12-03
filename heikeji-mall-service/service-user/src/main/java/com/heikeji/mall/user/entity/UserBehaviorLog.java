package com.heikeji.mall.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户行为日志实体类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("user_behavior_log")
@Schema(description = "用户行为日志实体类")
public class UserBehaviorLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    /**
     * 用户ID
     */
    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 行为类型：如登录、浏览、购买等
     */
    @TableField("behavior_type")
    @Schema(description = "行为类型：如登录、浏览、购买等")
    private String behaviorType;

    /**
     * 行为内容：如商品ID、页面URL等
     */
    @TableField("behavior_content")
    @Schema(description = "行为内容：如商品ID、页面URL等")
    private String behaviorContent;

    /**
     * 行为时间
     */
    @TableField(value = "behavior_time", fill = FieldFill.INSERT)
    @Schema(description = "行为时间")
    private LocalDateTime behaviorTime;

    /**
     * IP地址
     */
    @TableField("ip_address")
    @Schema(description = "IP地址")
    private String ipAddress;

    /**
     * 用户代理信息
     */
    @TableField("user_agent")
    @Schema(description = "用户代理信息")
    private String userAgent;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}
