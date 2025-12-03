package com.heikeji.mall.user.service;

import com.heikeji.mall.user.entity.SysRole;
import com.heikeji.mall.user.vo.PageData;

import java.util.List;

/**
 * 系统角色服务接口
 * 用于处理角色相关的业务逻辑
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface SysRoleService {

    /**
     * 新增角色
     *
     * @param sysRole 角色信息
     * @return 新增结果
     */
    boolean add(SysRole sysRole);

    /**
     * 更新角色
     *
     * @param sysRole 角色信息
     * @return 更新结果
     */
    boolean update(SysRole sysRole);

    /**
     * 删除角色
     *
     * @param id 角色ID
     * @return 删除结果
     */
    boolean delete(Long id);

    /**
     * 批量删除角色
     *
     * @param ids 角色ID列表
     * @return 删除结果
     */
    boolean deleteBatch(List<Long> ids);

    /**
     * 根据ID查询角色
     *
     * @param id 角色ID
     * @return 角色信息
     */
    SysRole getById(Long id);

    /**
     * 查询角色列表
     *
     * @param sysRole 角色信息
     * @return 角色列表
     */
    List<SysRole> list(SysRole sysRole);

    /**
     * 分页查询角色列表
     *
     * @param pageNum 页码
     * @param pageSize 每页条数
     * @param sysRole 角色信息
     * @return 分页数据
     */
    PageData<SysRole> page(Integer pageNum, Integer pageSize, SysRole sysRole);

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    List<SysRole> listAll();

    /**
     * 根据用户ID查询角色列表
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    List<SysRole> listByUserId(Long userId);

    /**
     * 检查角色名称是否已存在
     *
     * @param roleName 角色名称
     * @param id 角色ID（更新时使用，用于排除自身）
     * @return 是否存在
     */
    boolean checkRoleNameExist(String roleName, Long id);

    /**
     * 检查角色编码是否已存在
     *
     * @param roleCode 角色编码
     * @param id 角色ID（更新时使用，用于排除自身）
     * @return 是否存在
     */
    boolean checkRoleCodeExist(String roleCode, Long id);

    /**
     * 分配角色权限
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     * @return 分配结果
     */
    boolean assignPermissions(Long roleId, List<Long> permissionIds);

    /**
     * 根据角色ID查询权限ID列表
     *
     * @param roleId 角色ID
     * @return 权限ID列表
     */
    List<Long> listPermissionIdsByRoleId(Long roleId);

    /**
     * 分配用户角色
     *
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     * @return 分配结果
     */
    boolean assignRoles(Long userId, List<Long> roleIds);

    /**
     * 根据用户ID查询角色ID列表
     *
     * @param userId 用户ID
     * @return 角色ID列表
     */
    List<Long> listRoleIdsByUserId(Long userId);

    /**
     * 根据角色ID查询用户数量
     *
     * @param roleId 角色ID
     * @return 用户数量
     */
    int countUsersByRoleId(Long roleId);
}
