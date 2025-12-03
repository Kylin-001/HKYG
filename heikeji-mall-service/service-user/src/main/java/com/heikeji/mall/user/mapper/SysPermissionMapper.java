package com.heikeji.mall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.user.entity.SysPermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 系统权限Mapper接口
 * 用于操作sys_permission表
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Mapper
public interface SysPermissionMapper extends BaseMapper<SysPermission> {

    /**
     * 根据用户ID查询权限列表
     *
     * @param userId 用户ID
     * @return 权限列表
     */
    @Select("""
        SELECT DISTINCT sp.*
        FROM sys_permission sp
        LEFT JOIN sys_role_permission srp ON sp.id = srp.permission_id
        LEFT JOIN sys_user_role sur ON srp.role_id = sur.role_id
        WHERE sur.user_id = #{userId} AND sp.status = 1
    """)
    List<SysPermission> selectPermissionsByUserId(@Param("userId") Long userId);

    /**
     * 根据角色ID查询权限列表
     *
     * @param roleId 角色ID
     * @return 权限列表
     */
    @Select("""
        SELECT sp.*
        FROM sys_permission sp
        LEFT JOIN sys_role_permission srp ON sp.id = srp.permission_id
        WHERE srp.role_id = #{roleId} AND sp.status = 1
    """)
    List<SysPermission> selectPermissionsByRoleId(@Param("roleId") Long roleId);

    /**
     * 查询所有有效的权限列表
     *
     * @return 权限列表
     */
    @Select("SELECT * FROM sys_permission WHERE status = 1 ORDER BY sort_order")
    List<SysPermission> selectAllValidPermissions();

    /**
     * 查询权限树
     *
     * @return 权限树列表
     */
    List<SysPermission> selectPermissionTree();
}
