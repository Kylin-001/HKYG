package com.heikeji.mall.order.service.impl;

import com.heikeji.common.core.service.PermissionService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * 订单服务的权限服务实现类
 * 提供简单的权限检查功能，确保服务可以正常启动
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    @Override
    public Set<String> getPermissionCodesByUserId(Long userId) {
        // 这里返回空集合，实际项目中应该从数据库或缓存中获取用户的权限
        return new HashSet<>();
    }

    @Override
    public boolean hasPermission(Long userId, String permissionCode) {
        // 默认返回true，允许访问
        return true;
    }

    @Override
    public boolean hasAnyPermission(Long userId, String[] permissionCodes) {
        // 默认返回true，允许访问
        return true;
    }

    @Override
    public boolean hasAllPermissions(Long userId, String[] permissionCodes) {
        // 默认返回true，允许访问
        return true;
    }
}