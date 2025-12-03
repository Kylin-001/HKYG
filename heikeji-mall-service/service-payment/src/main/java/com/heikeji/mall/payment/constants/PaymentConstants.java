package com.heikeji.mall.payment.constants;

/**
 * 支付相关常量
 */
public class PaymentConstants {
    
    /**
     * 支付状态
     */
    public static final class PAYMENT_STATUS {
        // 待支付
        public static final Integer WAITING = 0;
        // 已支付
        public static final Integer PAID = 1;
        // 已退款
        public static final Integer REFUNDED = 2;
        // 已取消
        public static final Integer CANCELLED = 3;
        // 失败
        public static final Integer FAIL = 4;
        // 已关闭
        public static final Integer CLOSED = 5;
        // 未知状态
        public static final Integer UNKNOWN = 99;
    }
    
    /**
     * 支付方式
     */
    public static final class PAYMENT_TYPE {
        // 微信支付
        public static final Integer WECHAT_PAY = 1;
        // 支付宝支付
        public static final Integer ALIPAY = 2;
        // 余额支付
        public static final Integer BALANCE_PAY = 3;
    }
    
    /**
     * 微信支付相关常量
     */
    public static final class WECHAT_PAY {
        // 交易类型 - JSAPI支付
        public static final String TRADE_TYPE_JSAPI = "JSAPI";
        // 交易类型 - NATIVE支付
        public static final String TRADE_TYPE_NATIVE = "NATIVE";
        // 交易类型 - APP支付
        public static final String TRADE_TYPE_APP = "APP";
        // 成功状态码
        public static final String SUCCESS_CODE = "SUCCESS";
        // 失败状态码
        public static final String FAIL_CODE = "FAIL";
    }
}