package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.user.entity.SysPermission;

import java.util.List;

/**
 * 系统权限服务接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface SysPermissionService extends IService<SysPermission> {

    /**
     * 根据角色ID获取权限列表
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    List<SysPermission> getPermissionsByRoleId(Long roleId);

    /**
     * 根据用户ID获取权限列表
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    List<SysPermission> getPermissionsByUserId(Long userId);

    /**
     * 给角色分配权限
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     * @return 是否分配成功
     */
    boolean assignPermissionsToRole(Long roleId, List<Long> permissionIds);

    /**
     * 获取权限树
     *
     * @return 权限树结构
     */
    List<SysPermission> getPermissionTree();

    /**
     * 获取用户的权限树
     *
     * @param userId 用户ID
     * @return 用户的权限树结构
     */
    List<SysPermission> getUserPermissionTree(Long userId);

    /**
     * 检查用户是否有指定权限
     *
     * @param userId 用户ID
     * @param permissionCode 权限编码
     * @return 是否有该权限
     */
    boolean checkPermission(Long userId, String permissionCode);

    /**
     * 根据权限编码获取权限信息
     *
     * @param permissionCode 权限编码
     * @return 权限信息
     */
    SysPermission getPermissionByCode(String permissionCode);
}