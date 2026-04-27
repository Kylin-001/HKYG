package com.heikeji.admin.service;

import com.heikeji.admin.entity.Role;

import java.util.List;
import java.util.Map;

/**
 * 角色Service接口
 */
public interface RoleService {

    /**
     * 分页查询角色列表
     */
    Map<String, Object> pageRole(Map<String, Object> params);

    /**
     * 获取所有角色
     */
    List<Role> getAllRoles();

    /**
     * 根据ID获取角色
     */
    Role getRoleById(Long id);

    /**
     * 添加角色
     */
    boolean addRole(Role role);

    /**
     * 修改角色
     */
    boolean updateRole(Role role);

    /**
     * 删除角色
     */
    boolean deleteRole(Long id);

    /**
     * 批量删除角色
     */
    boolean batchDeleteRole(List<Long> ids);

    /**
     * 更新角色状态
     */
    boolean updateRoleStatus(Long id, Integer status);

    /**
     * 分配角色菜单权限
     */
    boolean assignRoleMenus(Long roleId, List<Long> menuIds);

    /**
     * 根据用户ID获取角色列表
     */
    List<Role> getRolesByUserId(Long userId);
}
