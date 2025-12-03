package com.heikeji.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.system.entity.SysRolePermission;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色权限关联Mapper接口
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysRolePermissionMapper extends BaseMapper<SysRolePermission> {
    
    /**
     * 根据角色ID查询权限ID列表
     *
     * @param roleId 角色ID
     * @return 权限ID列表
     */
    List<Long> selectPermissionIdsByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据权限ID查询角色ID列表
     *
     * @param permissionId 权限ID
     * @return 角色ID列表
     */
    List<Long> selectRoleIdsByPermissionId(@Param("permissionId") Long permissionId);

    /**
     * 批量插入角色权限关联
     *
     * @param rolePermissionList 角色权限列表
     * @return 影响行数
     */
    int insertBatch(@Param("list") List<SysRolePermission> rolePermissionList);

    /**
     * 根据角色ID删除角色权限关联
     *
     * @param roleId 角色ID
     * @return 影响行数
     */
    int deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据权限ID删除角色权限关联
     *
     * @param permissionId 权限ID
     * @return 影响行数
     */
    int deleteByPermissionId(@Param("permissionId") Long permissionId);

    /**
     * 根据角色ID和权限ID列表删除角色权限关联
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     * @return 影响行数
     */
    int deleteByRoleIdAndPermissionIds(@Param("roleId") Long roleId, @Param("permissionIds") List<Long> permissionIds);

    /**
     * 检查角色是否拥有指定权限
     *
     * @param roleId 角色ID
     * @param permissionId 权限ID
     * @return 数量
     */
    int checkRolePermission(@Param("roleId") Long roleId, @Param("permissionId") Long permissionId);
}
