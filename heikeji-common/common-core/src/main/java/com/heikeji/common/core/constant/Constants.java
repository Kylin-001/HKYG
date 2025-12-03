package com.heikeji.common.core.constant;

/**
 * 通用常量
 */
public class Constants {
    /** 成功状态码 */
    public static final Integer SUCCESS = 200;
    
    /** 失败状态码 */
    public static final Integer FAIL = 500;

    /** 删除标记 - 正常 */
    public static final Integer DEL_FLAG_NORMAL = 0;
    
    /** 删除标记 - 删除 */
    public static final Integer DEL_FLAG_DELETE = 1;

    /** 用户状态 - 正常 */
    public static final Integer USER_STATUS_NORMAL = 0;
    
    /** 用户状态 - 禁用 */
    public static final Integer USER_STATUS_DISABLE = 1;

    /** 订单状态 - 待支付 */
    public static final Integer ORDER_STATUS_UNPAID = 0;
    
    /** 订单状态 - 已支付 */
    public static final Integer ORDER_STATUS_PAID = 1;
    
    /** 订单状态 - 已发货 */
    public static final Integer ORDER_STATUS_SHIPPED = 2;
    
    /** 订单状态 - 已完成 */
    public static final Integer ORDER_STATUS_COMPLETED = 3;
    
    /** 订单状态 - 已取消 */
    public static final Integer ORDER_STATUS_CANCELLED = 4;

    /** 配送方式 - 外卖自取 */
    public static final Integer DELIVERY_TYPE_LOCKER = 1;
    
    /** 配送方式 - 特殊地点 */
    public static final Integer DELIVERY_TYPE_SPECIAL = 2;
    
    /** 配送方式 - 送到宿舍 */
    public static final Integer DELIVERY_TYPE_DORM = 3;

    // JWT相关常量
    /** 认证请求头 */
    public static final String AUTHORIZATION_HEADER = "Authorization";
    
    /** Token前缀 */
    public static final String TOKEN_PREFIX = "Bearer ";
    
    /** Token过期消息 */
    public static final String TOKEN_EXPIRED_MESSAGE = "Token已过期";
    
    /** Token无效消息 */
    public static final String TOKEN_INVALID_MESSAGE = "Token无效";
    
    /** 用户未登录消息 */
    public static final String USER_NOT_LOGIN_MESSAGE = "用户未登录";
}



