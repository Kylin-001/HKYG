package com.heikeji.mall.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户认证信息实体类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("user_auth")
@Schema(description = "用户认证信息实体类")
public class UserAuth implements Serializable {

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
     * 认证类型：password-密码认证，wechat-微信认证等
     */
    @TableField("auth_type")
    @Schema(description = "认证类型：password-密码认证，wechat-微信认证等")
    private String authType;

    /**
     * 认证标识：如用户名、邮箱、手机号、微信OpenID等
     */
    @TableField("auth_identifier")
    @Schema(description = "认证标识：如用户名、邮箱、手机号、微信OpenID等")
    private String authIdentifier;

    /**
     * 认证凭证：如密码哈希值
     */
    @TableField("auth_credential")
    @Schema(description = "认证凭证：如密码哈希值")
    private String authCredential;

    /**
     * 最后登录时间
     */
    @TableField("last_login_time")
    @Schema(description = "最后登录时间")
    private LocalDateTime lastLoginTime;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
