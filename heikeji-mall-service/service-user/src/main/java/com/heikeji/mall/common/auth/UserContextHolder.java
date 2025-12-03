package com.heikeji.mall.common.auth;

import com.heikeji.mall.user.dto.UserLoginDTO;

/**
 * 用户上下文持有器
 * 用于在当前线程中存储和获取用户登录信息
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class UserContextHolder {

    /**
     * 线程本地变量，用于存储用户登录信息
     */
    private static final ThreadLocal<UserLoginDTO> USER_CONTEXT = new ThreadLocal<>();

    /**
     * 设置用户登录信息到当前线程
     *
     * @param userLoginDTO 用户登录信息
     */
    public static void setUserLoginInfo(UserLoginDTO userLoginDTO) {
        USER_CONTEXT.set(userLoginDTO);
    }

    /**
     * 从当前线程获取用户登录信息
     *
     * @return 用户登录信息
     */
    public static UserLoginDTO getUserLoginInfo() {
        return USER_CONTEXT.get();
    }

    /**
     * 获取当前用户ID
     *
     * @return 用户ID
     */
    public static Long getCurrentUserId() {
        UserLoginDTO userLoginInfo = USER_CONTEXT.get();
        return userLoginInfo != null ? userLoginInfo.getId() : null;
    }

    /**
     * 获取当前用户角色ID
     *
     * @return 角色ID
     */
    public static Long getCurrentRoleId() {
        UserLoginDTO userLoginInfo = USER_CONTEXT.get();
        return userLoginInfo != null ? userLoginInfo.getRoleId() : null;
    }

    /**
     * 获取当前用户角色名称
     *
     * @return 角色名称
     */
    public static String getCurrentRoleName() {
        UserLoginDTO userLoginInfo = USER_CONTEXT.get();
        return userLoginInfo != null ? userLoginInfo.getRoleName() : null;
    }

    /**
     * 获取当前用户手机
     *
     * @return 用户手机
     */
    public static String getCurrentUserPhone() {
        UserLoginDTO userLoginInfo = USER_CONTEXT.get();
        return userLoginInfo != null ? userLoginInfo.getPhone() : null;
    }

    /**
     * 清理当前线程的用户登录信息
     */
    public static void clear() {
        USER_CONTEXT.remove();
    }
}
