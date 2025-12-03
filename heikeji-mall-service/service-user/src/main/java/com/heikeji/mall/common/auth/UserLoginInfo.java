package com.heikeji.mall.common.auth;

import lombok.Data;

/**
 * 用户登录信息
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
public class UserLoginInfo {
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 登录账号
     */
    private String loginAccount;
    
    /**
     * 用户类型
     */
    private Integer userType;
    
    /**
     * 角色ID列表
     */
    private Long[] roleIds;
    
    /**
     * 权限ID列表
     */
    private Long[] permissionIds;
}