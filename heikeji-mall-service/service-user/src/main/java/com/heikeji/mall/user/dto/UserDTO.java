package com.heikeji.mall.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户数据传输对象
 * 用于前端与后端之间的用户数据传输
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    /**
     * 用户ID
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码（仅在创建/更新时使用）
     */
    @JsonIgnore
    private String password;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 手机号码
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 性别 0:未知 1:男 2:女
     */
    private Integer gender;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 生日
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime birthday;

    /**
     * 用户状态 0:禁用 1:启用
     */
    private Integer status;

    /**
     * 用户类型 0:普通用户 1:管理员 2:配送员
     */
    private Integer userType;

    /**
     * 最后登录时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginTime;

    /**
     * 注册时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updateTime;

    /**
     * 角色列表
     */
    private List<String> roles;

    /**
     * 权限列表
     */
    private List<String> permissions;

    /**
     * 新密码（用于密码修改）
     */
    @JsonIgnore
    private String newPassword;

    /**
     * 验证码（用于登录/注册）
     */
    @JsonIgnore
    private String captcha;

    /**
     * 验证码ID（用于登录/注册）
     */
    @JsonIgnore
    private String captchaId;

    /**
     * 旧密码（用于密码修改验证）
     */
    @JsonIgnore
    private String oldPassword;
}