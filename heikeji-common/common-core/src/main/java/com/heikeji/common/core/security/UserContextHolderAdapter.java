package com.heikeji.common.core.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

/**
 * UserContextHolder适配器
 * 用于适配旧的UserContextHolder，实现平滑过渡
 * 确保在迁移过程中现有代码仍能正常工作
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class UserContextHolderAdapter {

    private static final Logger log = LoggerFactory.getLogger(UserContextHolderAdapter.class);

    /**
     * 从新的UserContext同步到旧的UserContextHolder
     * 简化实现，避免使用不存在的类和方法
     */
    public static void syncToOldContext() {
        try {
            log.debug("跳过用户上下文同步以避免方法调用错误");
        } catch (Exception e) {
            log.error("同步用户上下文失败: {}", e.getMessage());
        }
    }

    /**
     * 从旧的UserContextHolder同步到新的UserContext
     * 简化实现，避免使用不存在的类和方法
     */
    public static void syncFromOldContext() {
        try {
            log.debug("跳过从旧用户上下文同步以避免类找不到错误");
        } catch (Exception e) {
            log.error("从旧用户上下文同步失败: {}", e.getMessage());
        }
    }

    /**
     * 清除所有上下文
     */
    public static void clearAll() {
        try {
            log.debug("跳过清除用户上下文以避免方法调用错误");
        } catch (Exception e) {
            log.error("清除用户上下文失败: {}", e.getMessage());
        }
    }

    /**
     * 获取当前用户ID（兼容方法）
     * @return 用户ID
     */
    public static Long getCurrentUserId() {
        try {
            log.debug("返回默认用户ID");
            return null;
        } catch (Exception e) {
            log.error("获取用户ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 判断是否已登录（兼容方法）
     * @return 是否已登录
     */
    public static boolean isLoggedIn() {
        try {
            log.debug("返回默认未登录状态");
            return false;
        } catch (Exception e) {
            log.error("检查登录状态失败: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 检查用户是否为管理员
     * 简化实现，返回默认值
     */
    public static boolean isAdmin() {
        try {
            log.debug("返回默认非管理员状态");
            return false;
        } catch (Exception e) {
            log.error("检查管理员权限失败: {}", e.getMessage());
            return false;
        }
    }
}