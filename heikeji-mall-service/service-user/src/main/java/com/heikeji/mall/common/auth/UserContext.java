package com.heikeji.mall.common.auth;

import com.heikeji.mall.user.entity.User;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 用户上下文工具类
 * 用于在当前线程中存储和获取用户信息
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class UserContext {

    /**
     * 使用ThreadLocal存储用户上下文信息
     */
    private static final ThreadLocal<UserInfo> USER_CONTEXT = new ThreadLocal<>();

    /**
     * 设置用户上下文信息
     *
     * @param userId      用户ID
     * @param username    用户名
     * @param nickname    昵称
     * @param roleId      角色ID
     * @param roleName    角色名称
     * @param permissions 权限列表
     */
    public static void setUserContext(Long userId, String username, String nickname, Long roleId, String roleName, List<String> permissions) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(userId);
        userInfo.setUsername(username);
        userInfo.setNickname(nickname);
        userInfo.setRoleId(roleId);
        userInfo.setRoleName(roleName);
        userInfo.setPermissions(permissions);
        USER_CONTEXT.set(userInfo);
    }

    /**
     * 设置用户上下文信息
     *
     * @param user        用户实体
     * @param permissions 权限列表
     */
    public static void setUserContext(User user, List<String> permissions) {
        if (user != null) {
            setUserContext(
                    user.getId(),
                    user.getUsername(),
                    user.getNickname(),
                    null, // User实体中没有roleId字段
                    null, // User实体中没有roleName字段
                    permissions
            );
        }
    }

    /**
     * 获取当前用户ID
     *
     * @return 用户ID
     */
    public static Long getCurrentUserId() {
        UserInfo userInfo = USER_CONTEXT.get();
        return userInfo != null ? userInfo.getUserId() : null;
    }

    /**
     * 获取当前用户名
     *
     * @return 用户名
     */
    public static String getCurrentUsername() {
        UserInfo userInfo = USER_CONTEXT.get();
        return userInfo != null ? userInfo.getUsername() : null;
    }

    /**
     * 获取当前用户昵称
     *
     * @return 昵称
     */
    public static String getCurrentNickname() {
        UserInfo userInfo = USER_CONTEXT.get();
        return userInfo != null ? userInfo.getNickname() : null;
    }

    /**
     * 获取当前用户角色ID
     *
     * @return 角色ID
     */
    public static Long getCurrentRoleId() {
        UserInfo userInfo = USER_CONTEXT.get();
        return userInfo != null ? userInfo.getRoleId() : null;
    }

    /**
     * 获取当前用户角色名称
     *
     * @return 角色名称
     */
    public static String getCurrentRoleName() {
        UserInfo userInfo = USER_CONTEXT.get();
        return userInfo != null ? userInfo.getRoleName() : null;
    }

    /**
     * 获取当前用户权限列表
     *
     * @return 权限列表
     */
    public static List<String> getCurrentPermissions() {
        UserInfo userInfo = USER_CONTEXT.get();
        return userInfo != null ? userInfo.getPermissions() : null;
    }

    /**
     * 检查用户是否具有指定权限
     *
     * @param permission 权限标识
     * @return 是否具有权限
     */
    public static boolean hasPermission(String permission) {
        List<String> permissions = getCurrentPermissions();
        return permissions != null && permissions.contains(permission);
    }

    /**
     * 检查用户是否具有任意指定权限
     *
     * @param permissions 权限标识数组
     * @return 是否具有任意权限
     */
    public static boolean hasAnyPermission(String... permissions) {
        List<String> userPermissions = getCurrentPermissions();
        if (userPermissions == null || permissions == null) {
            return false;
        }
        for (String permission : permissions) {
            if (userPermissions.contains(permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查用户是否具有所有指定权限
     *
     * @param permissions 权限标识数组
     * @return 是否具有所有权限
     */
    public static boolean hasAllPermissions(String... permissions) {
        List<String> userPermissions = getCurrentPermissions();
        if (userPermissions == null || permissions == null) {
            return false;
        }
        for (String permission : permissions) {
            if (!userPermissions.contains(permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 清除用户上下文信息
     */
    public static void clear() {
        USER_CONTEXT.remove();
    }

    /**
     * 用户信息内部类
     */
    @Data
    private static class UserInfo implements Serializable {
        private static final long serialVersionUID = 1L;

        /**
         * 用户ID
         */
        private Long userId;

        /**
         * 用户名
         */
        private String username;

        /**
         * 昵称
         */
        private String nickname;

        /**
         * 角色ID
         */
        private Long roleId;

        /**
         * 角色名称
         */
        private String roleName;

        /**
         * 权限列表
         */
        private List<String> permissions;
    }
}
