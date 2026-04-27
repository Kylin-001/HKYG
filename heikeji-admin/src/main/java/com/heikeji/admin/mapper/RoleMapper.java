package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 角色Mapper接口
 */
@Mapper
public interface RoleMapper extends BaseMapper<Role> {

    /**
     * 根据用户ID查询角色列表
     */
    @Select("SELECT r.* FROM sys_role r " +
            "INNER JOIN sys_admin_user u ON FIND_IN_SET(r.id, u.role_ids) > 0 " +
            "WHERE u.id = #{userId} AND r.status = 1")
    List<Role> selectRolesByUserId(@Param("userId") Long userId);

    /**
     * 根据角色编码查询角色
     */
    @Select("SELECT * FROM sys_role WHERE role_code = #{roleCode} LIMIT 1")
    Role selectByRoleCode(@Param("roleCode") String roleCode);
}
