package com.heikeji.mall.user.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 用户VO，用于API响应返回，只包含必要的用户信息
 */
@Data
public class UserVO {
    
    /**
     * 用户ID
     */
    private Long id;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 昵称
     */
    private String nickname;
    
    /**
     * 头像
     */
    private String avatar;
    
    /**
     * 学号
     */
    private String studentNo;
    
    /**
     * 真实姓名
     */
    private String realName;
    
    /**
     * 学院
     */
    private String college;
    
    /**
     * 专业
     */
    private String major;
    
    /**
     * 年级
     */
    private String grade;
    
    /**
     * 性别：男、女、未知
     */
    private String gender;
    
    /**
     * 余额
     */
    private BigDecimal balance;
    
    /**
     * 用户状态 0:正常 1:禁用
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
    
    /**
     * 角色列表
     */
    private java.util.List<String> roles;
    
    /**
     * 权限列表
     */
    private java.util.List<String> permissions;
}