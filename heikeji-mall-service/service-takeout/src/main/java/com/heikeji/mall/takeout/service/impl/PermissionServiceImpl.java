package com.heikeji.mall.takeout.service.impl;

import com.heikeji.common.core.service.PermissionService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

/**
 * 权限服务实现类
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    @Override
    public Set<String> getPermissionCodesByUserId(Long userId) {
        // 暂时返回空集合，实际项目中应该从数据库获取用户权限
        return Collections.emptySet();
    }

    @Override
    public boolean hasPermission(Long userId, String permissionCode) {
        // 暂时返回true，允许所有权限，实际项目中应该根据用户权限进行校验
        return true;
    }

    @Override
    public boolean hasAnyPermission(Long userId, String[] permissionCodes) {
        // 暂时返回true，允许所有权限
        return true;
    }

    @Override
    public boolean hasAllPermissions(Long userId, String[] permissionCodes) {
        // 暂时返回true，允许所有权限
        return true;
    }
}
