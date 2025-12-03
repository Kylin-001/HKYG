package com.heikeji.mall.order.constant;

/**
 * 订单相关常量
 */
public class OrderConstant {
    
    // 订单类型
    public static final Integer ORDER_TYPE_NORMAL = 1; // 普通订单
    public static final Integer ORDER_TYPE_TAKEOUT = 2; // 外卖订单
    public static final Integer ORDER_TYPE_RUNNER = 3; // 跑腿订单
    
    // 订单状态
    public static final Integer ORDER_STATUS_PENDING_PAYMENT = 0; // 待支付
    public static final Integer ORDER_STATUS_PAID = 1; // 已支付
    public static final Integer ORDER_STATUS_PENDING_DELIVERY = 2; // 待发货
    public static final Integer ORDER_STATUS_WAITING_DELIVERY = 2; // 待发货（别名）
    public static final Integer ORDER_STATUS_WAITING_ACCEPT = 3; // 待接单
    public static final Integer ORDER_STATUS_PENDING_RECEIVE = 4; // 待收货
    public static final Integer ORDER_STATUS_COMPLETED = 5; // 已完成
    public static final Integer ORDER_STATUS_CANCELLED = 6; // 已取消
    public static final Integer ORDER_STATUS_REFUNDING = 7; // 退款中
    public static final Integer ORDER_STATUS_REFUNDED = 8; // 已退款
    
    // 支付状态
    public static final Integer PAY_STATUS_UNPAID = 0; // 未支付
    public static final Integer PAY_STATUS_PAID = 1; // 已支付
    public static final Integer PAY_STATUS_FAILED = 2; // 支付失败
    
    // 支付方式
    public static final Integer PAY_TYPE_WECHAT = 1; // 微信支付
    public static final Integer PAY_TYPE_ALIPAY = 2; // 支付宝支付
    
    // 订单超时时间（单位：分钟）
    public static final Integer ORDER_TIMEOUT = 30;
}