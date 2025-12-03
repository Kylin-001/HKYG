package com.heikeji.common.core.domain;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 会员DTO类
 * 用于在服务间传递会员信息
 */
@Data
public class MemberDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 会员ID
     */
    private Long id;

    /**
     * 会员手机号
     */
    private String phone;

    /**
     * 会员密码
     */
    private String password;

    /**
     * 会员昵称
     */
    private String nickname;

    /**
     * 会员头像
     */
    private String avatar;

    /**
     * 会员性别 0-未知 1-男 2-女
     */
    private Integer gender;

    /**
     * 会员邮箱
     */
    private String email;

    /**
     * 会员状态 0-禁用 1-启用
     */
    private Integer status;

    /**
     * 会员类型 0-普通会员 1-会员
     */
    private Integer memberType;

    /**
     * 会员等级
     */
    private Integer memberLevel;

    /**
     * 邀请码
     */
    private String inviteCode;

    /**
     * 被邀请码
     */
    private String beInvitedCode;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
