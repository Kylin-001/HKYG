package com.heikeji.mall.user.service;

import com.heikeji.mall.user.dto.ChangePasswordDTO;
import com.heikeji.mall.user.dto.LoginDTO;
import com.heikeji.mall.user.dto.ResetPasswordDTO;
import com.heikeji.mall.user.dto.UserSecurityDTO;
import com.heikeji.mall.user.vo.UserSecurityVO;

/**
 * 用户安全服务接口
 *
 * @author heikeji
 * @date 2024-12-19
 */
public interface UserSecurityService {

    /**
     * 用户登录
     */
    UserSecurityVO login(LoginDTO loginDTO);

    /**
     * 用户退出登录
     */
    void logout(Long userId);

    /**
     * 修改密码
     */
    boolean changePassword(Long userId, ChangePasswordDTO changePasswordDTO);

    /**
     * 重置用户密码
     */
    boolean resetPassword(ResetPasswordDTO resetPasswordDTO);

    /**
     * 更新用户密码
     */
    void updatePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 修改用户密码（当前用户）
     */
    void changePassword(String oldPassword, String newPassword);

    /**
     * 发送重置密码邮件
     */
    void sendResetPasswordEmail(String email);

    /**
     * 发送手机验证码
     */
    void sendSmsCode(String phone);

    /**
     * 验证手机验证码
     */
    boolean verifySmsCode(String phone, String code);

    /**
     * 验证邮箱验证码
     */
    boolean verifyEmailCode(String email, String code);

    /**
     * 验证用户密码
     */
    boolean verifyPassword(Long userId, String password);

    /**
     * 检查密码强度
     */
    boolean checkPasswordStrength(String password);

    /**
     * 验证密码强度
     */
    boolean validatePasswordStrength(String password);

    /**
     * 生成强密码
     */
    String generateStrongPassword();

    /**
     * 检查账户是否被锁定
     */
    boolean isAccountLocked(String username);

    /**
     * 清除用户登录失败次数
     */
    void clearFailedAttempts(String username);

    /**
     * 锁定账户
     */
    void lockAccount(String username);

    /**
     * 解锁账户
     */
    void unlockAccount(String username);

    /**
     * 获取用户安全设置
     */
    UserSecurityDTO getUserSecuritySettings(Long userId);

    /**
     * 更新用户安全设置
     */
    void updateUserSecuritySettings(Long userId, UserSecurityDTO userSecurityDTO);

    /**
     * 绑定手机号
     */
    void bindPhone(Long userId, String phone, String code);

    /**
     * 解绑手机号
     */
    void unbindPhone(Long userId);

    /**
     * 绑定邮箱
     */
    void bindEmail(Long userId, String email, String code);

    /**
     * 解绑邮箱
     */
    void unbindEmail(Long userId);

    /**
     * 检测是否存在风险登录
     */
    boolean detectRiskLogin(Long userId, String ip, String userAgent);
}
