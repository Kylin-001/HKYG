package com.heikeji.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.admin.entity.AdminUser;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * 管理员用户Mapper接口
 */
@Mapper
public interface AdminUserMapper extends BaseMapper<AdminUser> {

    /**
     * 根据用户名查找用户
     */
    AdminUser selectByUsername(String username);

    /**
     * 分页查询用户列表
     */
    List<AdminUser> selectUserPage(Map<String, Object> params);

    /**
     * 根据部门ID查询用户
     */
    List<AdminUser> selectUserByDeptId(Long deptId);

    /**
     * 根据角色ID查询用户
     */
    List<AdminUser> selectUserByRoleId(Long roleId);
}
