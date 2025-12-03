package com.heikeji.mall.user.common.enums;

/**
 * 密码强度枚举
 * 用于表示密码的强度等级
 */
public enum PasswordStrength {
    /**
     * 弱密码
     */
    WEAK(0, "弱"),
    /**
     * 中等强度密码
     */
    MEDIUM(1, "中等"),
    /**
     * 强密码
     */
    STRONG(2, "强"),
    /**
     * 非常强密码
     */
    VERY_STRONG(3, "非常强");

    /**
     * 强度等级值
     */
    private final int level;

    /**
     * 强度等级描述
     */
    private final String description;

    /**
     * 构造方法
     *
     * @param level       强度等级值
     * @param description 强度等级描述
     */
    PasswordStrength(int level, String description) {
        this.level = level;
        this.description = description;
    }

    /**
     * 获取强度等级值
     *
     * @return 强度等级值
     */
    public int getLevel() {
        return level;
    }

    /**
     * 获取强度等级描述
     *
     * @return 强度等级描述
     */
    public String getDescription() {
        return description;
    }

    /**
     * 根据等级值获取密码强度枚举
     *
     * @param level 强度等级值
     * @return 密码强度枚举
     */
    public static PasswordStrength fromLevel(int level) {
        for (PasswordStrength strength : values()) {
            if (strength.level == level) {
                return strength;
            }
        }
        return WEAK;
    }
}