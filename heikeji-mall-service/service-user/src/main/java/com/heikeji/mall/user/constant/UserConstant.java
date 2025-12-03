package com.heikeji.mall.user.constant;

/**
 * 用户相关常量类
 * 定义用户状态、角色、权限等常量
 *
 * @author heikeji
 * @date 2024-12-19
 */
public class UserConstant {

    /**
     * 用户状态 - 激活
     */
    public static final Integer USER_STATUS_ACTIVE = 1;

    /**
     * 用户状态 - 禁用
     */
    public static final Integer USER_STATUS_DISABLED = 0;

    /**
     * 用户状态 - 锁定
     */
    public static final Integer USER_STATUS_LOCKED = 2;

    /**
     * 用户状态 - 待验证
     */
    public static final Integer USER_STATUS_PENDING = 3;

    /**
     * 用户性别 - 男
     */
    public static final Integer USER_GENDER_MALE = 1;

    /**
     * 用户性别 - 女
     */
    public static final Integer USER_GENDER_FEMALE = 2;

    /**
     * 用户性别 - 未知
     */
    public static final Integer USER_GENDER_UNKNOWN = 0;

    /**
     * 用户角色 - 普通用户
     */
    public static final String ROLE_USER = "ROLE_USER";

    /**
     * 用户角色 - 管理员
     */
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    /**
     * 用户角色 - 配送员
     */
    public static final String ROLE_DELIVERY = "ROLE_DELIVERY";

    /**
     * 用户角色 - 商家
     */
    public static final String ROLE_MERCHANT = "ROLE_MERCHANT";

    /**
     * 默认密码
     */
    public static final String DEFAULT_PASSWORD = "123456";

    /**
     * 密码最小长度
     */
    public static final Integer PASSWORD_MIN_LENGTH = 6;

    /**
     * 密码最大长度
     */
    public static final Integer PASSWORD_MAX_LENGTH = 20;

    /**
     * 用户名最小长度
     */
    public static final Integer USERNAME_MIN_LENGTH = 4;

    /**
     * 用户名最大长度
     */
    public static final Integer USERNAME_MAX_LENGTH = 20;

    /**
     * JWT令牌过期时间（小时）
     */
    public static final Integer JWT_EXPIRE_HOURS = 24;

    /**
     * 验证码过期时间（分钟）
     */
    public static final Integer CAPTCHA_EXPIRE_MINUTES = 5;

    /**
     * 登录失败次数限制
     */
    public static final Integer LOGIN_FAIL_LIMIT = 5;

    /**
     * 登录失败锁定时间（分钟）
     */
    public static final Integer LOGIN_LOCK_MINUTES = 30;

    /**
     * Redis中用户信息缓存键前缀
     */
    public static final String REDIS_USER_INFO_PREFIX = "user:info:";

    /**
     * Redis中验证码缓存键前缀
     */
    public static final String REDIS_CAPTCHA_PREFIX = "user:captcha:";

    /**
     * Redis中登录失败计数缓存键前缀
     */
    public static final String REDIS_LOGIN_FAIL_PREFIX = "user:login:fail:";

    /**
     * Redis中JWT令牌黑名单缓存键前缀
     */
    public static final String REDIS_JWT_BLACKLIST_PREFIX = "user:jwt:blacklist:";

    /**
     * 用户默认头像URL
     */
    public static final String DEFAULT_AVATAR_URL = "/static/images/default-avatar.png";

    /**
     * 用户默认昵称前缀
     */
    public static final String DEFAULT_NICKNAME_PREFIX = "用户";

    /**
     * 邮箱验证模板ID
     */
    public static final String EMAIL_VERIFY_TEMPLATE_ID = "email_verify_template";

    /**
     * 密码重置模板ID
     */
    public static final String PASSWORD_RESET_TEMPLATE_ID = "password_reset_template";
}
