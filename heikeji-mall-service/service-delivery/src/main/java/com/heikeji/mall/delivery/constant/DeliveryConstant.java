package com.heikeji.mall.delivery.constant;

/**
 * 配送服务相关常量
 */
public class DeliveryConstant {
    
    /**
     * 订单类型
     */
    public static class OrderType {
        public static final Integer EXPRESS_PICKUP = 1; // 快递取件
        public static final Integer EXPRESS_DELIVERY = 2; // 快递送件
        public static final Integer RUN_ERRAND = 3; // 跑腿代购
        public static final Integer DOCUMENT_DELIVERY = 4; // 文件配送
    }
    
    /**
     * 订单状态
     */
    public static class OrderStatus {
        public static final Integer PENDING = 0; // 待接单
        public static final Integer ACCEPTED = 1; // 已接单
        public static final Integer DELIVERING = 2; // 配送中
        public static final Integer COMPLETED = 3; // 已完成
        public static final Integer CANCELLED = 4; // 已取消
    }
    
    /**
     * 取消原因类型
     */
    public static class CancelReasonType {
        public static final Integer USER_CANCEL = 1; // 用户取消
        public static final Integer DELIVER_CANCEL = 2; // 配送员取消
        public static final Integer SYSTEM_TIMEOUT = 3; // 系统超时取消
    }
    
    /**
     * 订单超时时间（分钟）
     */
    public static final Integer ORDER_TIMEOUT_MINUTES = 30;
    
    /**
     * 默认分页大小
     */
    public static final Integer DEFAULT_PAGE_SIZE = 10;
    
    /**
     * 最大分页大小
     */
    public static final Integer MAX_PAGE_SIZE = 100;
}