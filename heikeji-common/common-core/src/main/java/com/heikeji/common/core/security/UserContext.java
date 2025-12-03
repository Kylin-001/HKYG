package com.heikeji.common.core.security;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * 用户上下文
 * 用于存储和管理当前登录用户的信息
 * 使用ThreadLocal确保线程安全
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class UserContext {

    private static final ThreadLocal<UserInfo> USER_CONTEXT = new ThreadLocal<>();

    /**
     * 用户信息类
     */
    public static class UserInfo {
        private String userId;
        private String username;
        private String nickname;
        private String avatar;
        private String phone;
        private Integer gender;
        private Map<String, Object> attributes = new HashMap<>();

        // Getters and Setters
        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getNickname() {
            return nickname;
        }

        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public Integer getGender() {
            return gender;
        }

        public void setGender(Integer gender) {
            this.gender = gender;
        }

        public Map<String, Object> getAttributes() {
            return attributes;
        }

        public void setAttributes(Map<String, Object> attributes) {
            this.attributes = attributes;
        }

        public void addAttribute(String key, Object value) {
            this.attributes.put(key, value);
        }

        public <T> T getAttribute(String key, Class<T> clazz) {
            return clazz.cast(attributes.get(key));
        }
    }

    /**
     * 设置用户上下文
     * @param userInfo 用户信息
     */
    public static void setUserContext(UserInfo userInfo) {
        USER_CONTEXT.set(userInfo);
    }

    /**
     * 获取当前用户信息
     * @return 用户信息
     */
    public static Optional<UserInfo> getCurrentUser() {
        return Optional.ofNullable(USER_CONTEXT.get());
    }

    /**
     * 获取当前用户ID
     * @return 用户ID
     */
    public static Optional<String> getUserId() {
        return getCurrentUser().map(UserInfo::getUserId);
    }

    /**
     * 获取当前用户名
     * @return 用户名
     */
    public static Optional<String> getUsername() {
        return getCurrentUser().map(UserInfo::getUsername);
    }

    /**
     * 判断是否已登录
     * @return 是否已登录
     */
    public static boolean isLoggedIn() {
        return USER_CONTEXT.get() != null;
    }

    /**
     * 清除用户上下文
     * 必须在请求结束时调用，避免内存泄漏
     */
    public static void clear() {
        USER_CONTEXT.remove();
    }

    /**
     * 创建用户信息构建器
     * @return 用户信息构建器
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * 用户信息构建器
     */
    public static class Builder {
        private UserInfo userInfo = new UserInfo();

        public Builder userId(String userId) {
            userInfo.setUserId(userId);
            return this;
        }

        public Builder username(String username) {
            userInfo.setUsername(username);
            return this;
        }

        public Builder nickname(String nickname) {
            userInfo.setNickname(nickname);
            return this;
        }

        public Builder avatar(String avatar) {
            userInfo.setAvatar(avatar);
            return this;
        }

        public Builder phone(String phone) {
            userInfo.setPhone(phone);
            return this;
        }

        public Builder gender(Integer gender) {
            userInfo.setGender(gender);
            return this;
        }

        public Builder attribute(String key, Object value) {
            userInfo.addAttribute(key, value);
            return this;
        }

        public UserInfo build() {
            return userInfo;
        }
    }
}