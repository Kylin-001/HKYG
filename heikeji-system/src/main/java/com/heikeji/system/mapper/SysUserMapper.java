package com.heikeji.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.system.entity.SysUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 系统用户Mapper接口
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysUserMapper extends BaseMapper<SysUser> {
    
    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户信息
     */
    SysUser selectByUsername(@Param("username") String username);

    /**
     * 根据手机号查询用户
     * @param phone 手机号
     * @return 用户信息
     */
    SysUser selectByPhone(@Param("phone") String phone);

    /**
     * 根据邮箱查询用户
     * @param email 邮箱
     * @return 用户信息
     */
    SysUser selectByEmail(@Param("email") String email);

    /**
     * 分页查询用户列表
     * @param page 分页对象
     * @param user 查询条件
     * @return 分页结果
     */
    IPage<SysUser> selectPage(Page<SysUser> page, @Param("user") SysUser user);

    /**
     * 根据角色ID查询用户列表
     * @param roleId 角色ID
     * @return 用户列表
     */
    List<SysUser> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据部门ID查询用户列表
     * @param deptId 部门ID
     * @return 用户列表
     */
    List<SysUser> selectByDeptId(@Param("deptId") Long deptId);

    /**
     * 更新用户最后登录时间
     * @param id 用户ID
     * @return 影响行数
     */
    int updateLastLoginTime(@Param("id") Long id);

    /**
     * 批量删除用户
     * @param ids 用户ID列表
     * @return 影响行数
     */
    int deleteBatchIds(@Param("ids") List<Long> ids);
}
