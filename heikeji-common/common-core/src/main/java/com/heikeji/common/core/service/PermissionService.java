package com.heikeji.common.core.service;

import java.util.Set;

/**
 * 权限服务接口
 * 定义权限相关的通用服务方法，由具体业务模块实现
 */
public interface PermissionService {
    
    /**
     * 根据用户ID获取用户拥有的权限编码列表
     * @param userId 用户ID
     * @return 权限编码集合
     */
    Set<String> getPermissionCodesByUserId(Long userId);
    
    /**
     * 检查用户是否拥有指定权限
     * @param userId 用户ID
     * @param permissionCode 权限编码
     * @return 是否拥有权限
     */
    boolean hasPermission(Long userId, String permissionCode);
    
    /**
     * 检查用户是否拥有多个指定权限中的任何一个（OR关系）
     * @param userId 用户ID
     * @param permissionCodes 权限编码数组
     * @return 是否拥有至少一个权限
     */
    boolean hasAnyPermission(Long userId, String[] permissionCodes);
    
    /**
     * 检查用户是否拥有所有指定权限（AND关系）
     * @param userId 用户ID
     * @param permissionCodes 权限编码数组
     * @return 是否拥有所有权限
     */
    boolean hasAllPermissions(Long userId, String[] permissionCodes);
}
