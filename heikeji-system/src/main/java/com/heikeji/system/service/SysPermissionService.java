package com.heikeji.system.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.system.entity.SysPermission;
import com.heikeji.system.vo.PermissionQueryVO;

import java.util.List;
import java.util.Set;

/**
 * 系统权限服务接口
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysPermissionService extends IService<SysPermission> {
    
    /**
     * 根据权限编码查询权限
     *
     * @param code 权限编码
     * @return 权限信息
     */
    SysPermission getByCode(String code);

    /**
     * 分页查询权限列表
     *
     * @param queryVO 查询条件
     * @return 分页结果
     */
    IPage<SysPermission> page(PermissionQueryVO queryVO);

    /**
     * 创建权限
     *
     * @param permission 权限信息
     * @return 是否成功
     */
    boolean create(SysPermission permission);

    /**
     * 更新权限
     *
     * @param permission 权限信息
     * @return 是否成功
     */
    boolean update(SysPermission permission);

    /**
     * 删除权限
     *
     * @param id 权限ID
     * @return 是否成功
     */
    boolean delete(Long id);

    /**
     * 批量删除权限
     *
     * @param ids 权限ID列表
     * @return 是否成功
     */
    boolean deleteBatch(List<Long> ids);

    /**
     * 修改权限状态
     *
     * @param id 权限ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateStatus(Long id, Integer status);

    /**
     * 根据角色ID查询权限列表
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    List<SysPermission> listByRoleId(Long roleId);

    /**
     * 根据用户ID查询权限列表
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    List<SysPermission> listByUserId(Long userId);

    /**
     * 查询所有菜单权限
     *
     * @return 菜单列表
     */
    List<SysPermission> listAllMenus();

    /**
     * 根据父ID查询子权限列表
     *
     * @param parentId 父级权限ID
     * @return 子权限列表
     */
    List<SysPermission> listByParentId(Long parentId);

    /**
     * 获取用户的权限编码列表
     *
     * @param userId 用户ID
     * @return 权限编码列表
     */
    Set<String> getPermissionCodesByUserId(Long userId);

    /**
     * 获取用户的菜单列表
     *
     * @param userId 用户ID
     * @return 菜单列表
     */
    List<SysPermission> getMenusByUserId(Long userId);

    /**
     * 构建菜单树
     *
     * @param permissions 菜单列表
     * @return 菜单树
     */
    List<SysPermission> buildMenuTree(List<SysPermission> permissions);

    /**
     * 检查权限编码是否已存在
     *
     * @param code 权限编码
     * @param id 排除的权限ID
     * @return 是否存在
     */
    boolean checkCodeUnique(String code, Long id);

    /**
     * 获取权限的所有子权限ID
     *
     * @param permissionId 权限ID
     * @return 子权限ID列表
     */
    List<Long> getAllChildPermissionIds(Long permissionId);
}
