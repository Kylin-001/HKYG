package com.heikeji.system.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.system.entity.SysRole;
import com.heikeji.system.vo.RoleQueryVO;

import java.util.List;

/**
 * 系统角色服务接口
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysRoleService extends IService<SysRole> {
    
    /**
     * 根据角色编码查询角色
     *
     * @param roleCode 角色编码
     * @return 角色信息
     */
    SysRole getByCode(String roleCode);

    /**
     * 分页查询角色列表
     *
     * @param queryVO 查询条件
     * @return 分页结果
     */
    IPage<SysRole> page(RoleQueryVO queryVO);

    /**
     * 创建角色
     *
     * @param role 角色信息
     * @return 是否成功
     */
    boolean create(SysRole role);

    /**
     * 更新角色
     *
     * @param role 角色信息
     * @return 是否成功
     */
    boolean update(SysRole role);

    /**
     * 删除角色
     *
     * @param id 角色ID
     * @return 是否成功
     */
    boolean delete(Long id);

    /**
     * 批量删除角色
     *
     * @param ids 角色ID列表
     * @return 是否成功
     */
    boolean deleteBatch(List<Long> ids);

    /**
     * 修改角色状态
     *
     * @param id 角色ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateStatus(Long id, Integer status);

    /**
     * 根据用户ID查询角色列表
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    List<SysRole> listByUserId(Long userId);

    /**
     * 查询所有启用的角色
     *
     * @return 角色列表
     */
    List<SysRole> listAllEnabled();

    /**
     * 给角色分配权限
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     * @return 是否成功
     */
    boolean assignPermissions(Long roleId, List<Long> permissionIds);

    /**
     * 给用户分配角色
     *
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     * @return 是否成功
     */
    boolean assignRoles(Long userId, List<Long> roleIds);

    /**
     * 获取角色的权限ID列表
     *
     * @param roleId 角色ID
     * @return 权限ID列表
     */
    List<Long> getPermissionIdsByRoleId(Long roleId);

    /**
     * 获取用户的角色ID列表
     *
     * @param userId 用户ID
     * @return 角色ID列表
     */
    List<Long> getRoleIdsByUserId(Long userId);

    /**
     * 校验角色名称是否已存在
     *
     * @param roleName 角色名称
     * @param id 排除的角色ID
     * @return 是否存在
     */
    boolean checkRoleNameUnique(String roleName, Long id);

    /**
     * 校验角色编码是否已存在
     *
     * @param roleCode 角色编码
     * @param id 排除的角色ID
     * @return 是否存在
     */
    boolean checkRoleCodeUnique(String roleCode, Long id);
}
