package com.heikeji.mall.user.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/**
 * 用户安全视图对象
 * 用于返回用户的安全相关信息，如角色、权限等
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(name = "UserSecurityVO", description = "用户安全视图对象，用于返回用户的安全相关信息")
public class UserSecurityVO {

    @Schema(description = "用户ID", example = "1")
    private Long userId;

    @Schema(description = "用户名", example = "admin")
    private String username;

    @Schema(description = "用户角色")
    private List<String> roles;

    @Schema(description = "用户权限")
    private List<String> permissions;

    @Schema(description = "用户状态", example = "1")
    private Integer status;

    @Schema(description = "用户角色ID列表")
    private List<Long> roleIds;

    @Schema(description = "用户角色名称列表")
    private List<String> roleNames;

    @Schema(description = "是否为管理员", example = "false")
    private Boolean isAdmin;

    @Schema(description = "最后登录时间", example = "2024-12-19 10:30:00")
    private String lastLoginTime;

    @Schema(description = "登录IP地址", example = "192.168.1.1")
    private String lastLoginIp;

    @Schema(description = "账户是否锁定", example = "false")
    private Boolean isLocked;

    @Schema(description = "密码过期时间", example = "2025-12-19 00:00:00")
    private String passwordExpireTime;

    @Schema(description = "是否需要修改密码", example = "false")
    private Boolean needChangePassword;

    @Schema(description = "JWT令牌")
    private String token;

    @Schema(description = "令牌过期时间", example = "1734604800000")
    private Long expireTime;

    @Schema(description = "用户头像URL")
    private String avatarUrl;

    @Schema(description = "用户昵称")
    private String nickname;
}
