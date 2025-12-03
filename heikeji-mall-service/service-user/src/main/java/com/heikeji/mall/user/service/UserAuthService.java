package com.heikeji.mall.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.user.entity.UserAuth;
import com.heikeji.mall.user.vo.AuthTokenVO;
import com.heikeji.mall.user.dto.UserLoginDTO;
import com.heikeji.mall.user.dto.UserRegisterDTO;

import java.util.List;

/**
 * <p>
 * 用户认证服务接口
 * </p>
 *
 * @author heikeji
 * @since 2024-05-20
 */
public interface UserAuthService extends IService<UserAuth> {

    /**
     * 用户登录
     *
     * @param loginDTO 登录信息
     * @return 认证令牌信息
     */
    AuthTokenVO login(UserLoginDTO loginDTO);

    /**
     * 用户注册
     *
     * @param registerDTO 注册信息
     * @return 用户认证ID
     */
    Long register(UserRegisterDTO registerDTO);

    /**
     * 刷新令牌
     *
     * @param refreshToken 刷新令牌
     * @return 新的认证令牌信息
     */
    AuthTokenVO refreshToken(String refreshToken);

    /**
     * 登出
     *
     * @param token 访问令牌
     */
    void logout(String token);

    /**
     * 根据用户ID查询用户认证信息
     *
     * @param userId 用户ID
     * @return 用户认证信息
     */
    UserAuth getUserAuthByUserId(Long userId);

    /**
     * 根据用户名查询用户认证信息
     *
     * @param username 用户名
     * @return 用户认证信息
     */
    UserAuth getUserAuthByUsername(String username);

    /**
     * 根据邮箱查询用户认证信息
     *
     * @param email 邮箱
     * @return 用户认证信息
     */
    UserAuth getUserAuthByEmail(String email);

    /**
     * 根据手机号查询用户认证信息
     *
     * @param phone 手机号
     * @return 用户认证信息
     */
    UserAuth getUserAuthByPhone(String phone);

    /**
     * 修改密码
     *
     * @param userId      用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 是否修改成功
     */
    boolean updatePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 重置密码
     *
     * @param userId   用户ID
     * @param newPassword 新密码
     * @return 是否重置成功
     */
    boolean resetPassword(Long userId, String newPassword);

    /**
     * 绑定邮箱
     *
     * @param userId 用户ID
     * @param email 邮箱
     * @return 是否绑定成功
     */
    boolean bindEmail(Long userId, String email);

    /**
     * 解绑邮箱
     *
     * @param userId 用户ID
     * @return 是否解绑成功
     */
    boolean unbindEmail(Long userId);

    /**
     * 绑定手机号
     *
     * @param userId 用户ID
     * @param phone 手机号
     * @return 是否绑定成功
     */
    boolean bindPhone(Long userId, String phone);

    /**
     * 解绑手机号
     *
     * @param userId 用户ID
     * @return 是否解绑成功
     */
    boolean unbindPhone(Long userId);

    /**
     * 激活用户
     *
     * @param userId 用户ID
     * @return 是否激活成功
     */
    boolean activateUser(Long userId);

    /**
     * 禁用用户
     *
     * @param userId 用户ID
     * @return 是否禁用成功
     */
    boolean disableUser(Long userId);

    /**
     * 根据用户ID列表查询用户认证信息
     *
     * @param userIds 用户ID列表
     * @return 用户认证信息列表
     */
    List<UserAuth> getUserAuthsByUserIds(List<Long> userIds);
}