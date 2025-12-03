package com.heikeji.system.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.system.entity.SysUser;
import com.heikeji.system.vo.UserQueryVO;

import java.util.List;
import java.util.Set;

/**
 * 系统用户服务接口
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public interface SysUserService extends IService<SysUser> {
    
    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户信息
     */
    SysUser getByUsername(String username);

    /**
     * 根据手机号查询用户
     *
     * @param phone 手机号
     * @return 用户信息
     */
    SysUser getByPhone(String phone);

    /**
     * 根据邮箱查询用户
     *
     * @param email 邮箱
     * @return 用户信息
     */
    SysUser getByEmail(String email);

    /**
     * 分页查询用户列表
     *
     * @param queryVO 查询条件
     * @return 分页结果
     */
    IPage<SysUser> page(UserQueryVO queryVO);

    /**
     * 创建用户
     *
     * @param user 用户信息
     * @return 是否成功
     */
    boolean create(SysUser user);

    /**
     * 更新用户
     *
     * @param user 用户信息
     * @return 是否成功
     */
    boolean update(SysUser user);

    /**
     * 删除用户
     *
     * @param id 用户ID
     * @return 是否成功
     */
    boolean delete(Long id);

    /**
     * 批量删除用户
     *
     * @param ids 用户ID列表
     * @return 是否成功
     */
    boolean deleteBatch(List<Long> ids);

    /**
     * 修改用户状态
     *
     * @param id 用户ID
     * @param status 状态
     * @return 是否成功
     */
    boolean updateStatus(Long id, Integer status);

    /**
     * 重置密码
     *
     * @param id 用户ID
     * @param password 新密码
     * @return 是否成功
     */
    boolean resetPassword(Long id, String password);

    /**
     * 更新用户最后登录时间
     *
     * @param id 用户ID
     * @return 是否成功
     */
    boolean updateLastLoginTime(Long id);

    /**
     * 根据角色ID查询用户列表
     *
     * @param roleId 角色ID
     * @return 用户列表
     */
    List<SysUser> listByRoleId(Long roleId);

    /**
     * 根据部门ID查询用户列表
     *
     * @param deptId 部门ID
     * @return 用户列表
     */
    List<SysUser> listByDeptId(Long deptId);

    /**
     * 获取用户权限列表
     *
     * @param userId 用户ID
     * @return 权限编码列表
     */
    Set<String> getPermissionsByUserId(Long userId);

    /**
     * 获取用户角色列表
     *
     * @param userId 用户ID
     * @return 角色编码列表
     */
    Set<String> getRolesByUserId(Long userId);

    /**
     * 校验用户名是否已存在
     *
     * @param username 用户名
     * @param id 排除的用户ID
     * @return 是否存在
     */
    boolean checkUsernameUnique(String username, Long id);

    /**
     * 校验手机号是否已存在
     *
     * @param phone 手机号
     * @param id 排除的用户ID
     * @return 是否存在
     */
    boolean checkPhoneUnique(String phone, Long id);

    /**
     * 校验邮箱是否已存在
     *
     * @param email 邮箱
     * @param id 排除的用户ID
     * @return 是否存在
     */
    boolean checkEmailUnique(String email, Long id);
}
