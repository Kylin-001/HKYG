package com.heikeji.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.admin.entity.AdminUser;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Map;

/**
 * 管理员用户服务接口
 */
public interface AdminUserService extends IService<AdminUser>, UserDetailsService {

    /**
     * 用户登录
     */
    Map<String, Object> login(String username, String password, String captcha, String uuid);

    /**
     * 用户登出
     */
    boolean logout(String token);

    /**
     * 获取用户信息
     */
    AdminUser getUserInfo(Long userId);

    /**
     * 根据用户名获取用户
     */
    AdminUser getByUsername(String username);

    /**
     * 分页查询用户列表
     */
    Map<String, Object> pageUser(Map<String, Object> params);

    /**
     * 添加用户
     */
    boolean addUser(AdminUser user);

    /**
     * 更新用户
     */
    boolean updateUser(AdminUser user);

    /**
     * 删除用户
     */
    boolean deleteUser(Long userId);

    /**
     * 批量删除用户
     */
    boolean batchDeleteUser(List<Long> userIds);

    /**
     * 修改密码
     */
    boolean changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 重置密码
     */
    boolean resetPassword(Long userId);

    /**
     * 更新用户状态
     */
    boolean updateUserStatus(Long userId, Integer status);
}
