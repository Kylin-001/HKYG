package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.RegisterDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.dto.UserUpdateDTO;

import java.util.Map;

/**
 * 用户服务接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface UserService extends IService<User> {

    /**
     * 用户注册
     */
    User register(RegisterDTO registerDTO);

    /**
     * 用户登录
     */
    Map<String, Object> login(LoginDTO loginDTO);

    /**
     * 微信登录
     */
    Map<String, Object> wechatLogin(String code);

    /**
     * 用户登出
     */
    void logout(String token);

    /**
     * 获取当前登录用户信息
     */
    User getCurrentUser();

    /**
     * 根据ID获取用户信息
     */
    User getUserById(Long id);

    /**
     * 根据用户名获取用户信息
     */
    User getUserByUsername(String username);

    /**
     * 根据手机号获取用户信息
     */
    User getUserByPhone(String phone);

    /**
     * 根据邮箱获取用户信息
     */
    User getUserByEmail(String email);

    /**
     * 根据微信openId获取用户信息
     */
    User getUserByOpenId(String openId);
    
    /**
     * 根据学号获取用户信息
     */
    User getUserByStudentNo(String studentNo);

    /**
     * 更新用户信息
     */
    User updateUser(UserUpdateDTO userUpdateDTO);

    /**
     * 更新用户密码
     */
    void updatePassword(String oldPassword, String newPassword);

    /**
     * 重置用户密码
     */
    void resetPassword(ResetPasswordDTO resetPasswordDTO);

    /**
     * 修改用户头像
     */
    void updateAvatar(String avatarUrl);

    /**
     * 绑定学号信息
     */
    User bindStudentId(String studentId, String realName, String college, String major, String grade);

    /**
     * 绑定微信账号
     */
    User bindWechat(String openId);

    /**
     * 发送验证码
     */
    void sendVerificationCode(String phone);

    /**
     * 验证验证码
     */
    boolean verifyCode(String phone, String code);

    /**
     * 更新用户积分
     */
    void updatePoints(Long userId, Integer points);

    /**
     * 获取用户积分
     */
    Integer getPoints(Long userId);

    /**
     * 禁用用户
     */
    void disableUser(Long userId);

    /**
     * 启用用户
     */
    void enableUser(Long userId);
}
