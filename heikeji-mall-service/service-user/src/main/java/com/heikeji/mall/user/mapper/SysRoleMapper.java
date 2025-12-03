package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.user.entity.SysRole;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * <p>
 * 角色Mapper接口
 * </p>
 *
 * @author heikeji
 * @since 2024-05-20
 */
public interface SysRoleMapper extends BaseMapper<SysRole> {

    /**
     * 根据角色ID查询角色信息
     *
     * @param roleId 角色ID
     * @return 角色信息
     */
    SysRole selectRoleById(@Param("roleId") Long roleId);

    /**
     * 根据角色名称查询角色
     *
     * @param roleName 角色名称
     * @return 角色信息
     */
    SysRole selectRoleByRoleName(@Param("roleName") String roleName);

    /**
     * 根据角色编码查询角色
     *
     * @param roleCode 角色编码
     * @return 角色信息
     */
    SysRole selectRoleByRoleCode(@Param("roleCode") String roleCode);

    /**
     * 查询所有角色列表
     *
     * @return 角色列表
     */
    List<SysRole> selectAllRoles();

    /**
     * 分页查询角色列表
     *
     * @param page      分页参数
     * @param sysRole   角色查询条件
     * @return 角色分页列表
     */
    IPage<SysRole> selectRolePage(Page<SysRole> page, @Param("sysRole") SysRole sysRole);

    /**
     * 根据用户ID查询角色列表
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    List<SysRole> selectRolesByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID查询角色编码列表
     *
     * @param userId 用户ID
     * @return 角色编码列表
     */
    Set<String> selectRoleCodesByUserId(@Param("userId") Long userId);

    /**
     * 新增角色
     *
     * @param sysRole 角色信息
     * @return 结果
     */
    int insertRole(@Param("sysRole") SysRole sysRole);

    /**
     * 更新角色
     *
     * @param sysRole 角色信息
     * @return 结果
     */
    int updateRole(@Param("sysRole") SysRole sysRole);

    /**
     * 删除角色
     *
     * @param roleId 角色ID
     * @return 结果
     */
    int deleteRoleById(@Param("roleId") Long roleId);

    /**
     * 批量删除角色
     *
     * @param roleIds 角色ID列表
     * @return 结果
     */
    int deleteRoleByIds(@Param("roleIds") Long[] roleIds);

    /**
     * 批量根据用户ID查询角色列表
     *
     * @param userIds 用户ID列表
     * @return 用户角色映射
     */
    List<SysRole> selectRolesByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * 查询角色数量
     *
     * @param sysRole 查询条件
     * @return 角色数量
     */
    int countRole(@Param("sysRole") SysRole sysRole);

    /**
     * 检查角色名称是否存在
     *
     * @param roleName 角色名称
     * @param roleId   角色ID（用于排除当前角色）
     * @return 结果
     */
    int checkRoleNameUnique(@Param("roleName") String roleName, @Param("roleId") Long roleId);

    /**
     * 检查角色编码是否存在
     *
     * @param roleCode 角色编码
     * @param roleId   角色ID（用于排除当前角色）
     * @return 结果
     */
    int checkRoleCodeUnique(@Param("roleCode") String roleCode, @Param("roleId") Long roleId);
}