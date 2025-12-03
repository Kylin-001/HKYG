package com.heikeji.common.constants;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 统一订单状态常量类
 * 
 * @author heikeji
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderStatusConstant {
    
    // ==================== 主订单状态 (order表) ====================
    
    /**
     * 待支付 - 订单创建完成，等待用户支付
     */
    public static final int ORDER_STATUS_PENDING_PAYMENT = 0;
    
    /**
     * 已支付 - 用户已完成支付，等待商家接单/发货
     */
    public static final int ORDER_STATUS_PAID = 1;
    
    /**
     * 待接单 - 商家待接单状态（外卖订单特有）
     */
    public static final int ORDER_STATUS_WAITING_ACCEPT = 2;
    
    /**
     * 已发货 - 商家已发货，配送中
     */
    public static final int ORDER_STATUS_SHIPPED = 3;
    
    /**
     * 已送达 - 配送已完成，等待用户确认收货
     */
    public static final int ORDER_STATUS_DELIVERED = 4;
    
    /**
     * 已完成 - 用户已确认收货，订单完成
     */
    public static final int ORDER_STATUS_COMPLETED = 5;
    
    /**
     * 已取消 - 订单被取消
     */
    public static final int ORDER_STATUS_CANCELLED = 6;
    
    /**
     * 超时未取货 - 外卖柜超时未取货（系统自动处理）
     */
    public static final int ORDER_STATUS_TIMEOUT_NOT_PICKED = 7;
    
    /**
     * 退款中 - 申请退款，等待处理
     */
    public static final int ORDER_STATUS_REFUNDING = 8;
    
    /**
     * 已退款 - 退款完成
     */
    public static final int ORDER_STATUS_REFUNDED = 9;
    
    // ==================== 外卖订单状态 (takeout_order表) ====================
    
    /**
     * 待接单 - 等待商家接单
     */
    public static final int TAKEOUT_STATUS_PENDING_ACCEPT = 0;
    
    /**
     * 已接单 - 商家已接单，准备制作
     */
    public static final int TAKEOUT_STATUS_ACCEPTED = 1;
    
    /**
     * 配送中 - 商家制作完成，配送员配送中
     */
    public static final int TAKEOUT_STATUS_DELIVERING = 2;
    
    /**
     * 已送达 - 配送员已送达指定位置
     */
    public static final int TAKEOUT_STATUS_DELIVERED = 3;
    
    /**
     * 已取消 - 订单被取消
     */
    public static final int TAKEOUT_STATUS_CANCELLED = 4;
    
    /**
     * 用户已取货 - 用户确认从外卖柜取货
     */
    public static final int TAKEOUT_STATUS_USER_PICKED = 5;
    
    /**
     * 超时未取货 - 外卖柜超时未取货
     */
    public static final int TAKEOUT_STATUS_TIMEOUT_NOT_PICKED = 6;
    
    // ==================== 配送订单状态 ====================
    
    /**
     * 待接单 - 等待配送员接单
     */
    public static final int DELIVERY_STATUS_PENDING_ACCEPT = 0;
    
    /**
     * 已接单 - 配送员已接单
     */
    public static final int DELIVERY_STATUS_ACCEPTED = 1;
    
    /**
     * 配送中 - 配送员配送中
     */
    public static final int DELIVERY_STATUS_DELIVERING = 2;
    
    /**
     * 已完成 - 配送完成
     */
    public static final int DELIVERY_STATUS_COMPLETED = 3;
    
    /**
     * 已取消 - 配送订单被取消
     */
    public static final int DELIVERY_STATUS_CANCELLED = 4;
    
    // ==================== 状态文本映射 ====================
    
    /**
     * 主订单状态文本
     */
    public static final class ORDER_STATUS_TEXT {
        public static final String PENDING_PAYMENT = "待支付";
        public static final String PAID = "已支付";
        public static final String WAITING_ACCEPT = "待接单";
        public static final String SHIPPED = "已发货";
        public static final String DELIVERED = "已送达";
        public static final String COMPLETED = "已完成";
        public static final String CANCELLED = "已取消";
        public static final String TIMEOUT_NOT_PICKED = "超时未取货";
        public static final String REFUNDING = "退款中";
        public static final String REFUNDED = "已退款";
    }
    
    /**
     * 外卖订单状态文本
     */
    public static final class TAKEOUT_STATUS_TEXT {
        public static final String PENDING_ACCEPT = "待接单";
        public static final String ACCEPTED = "已接单";
        public static final String DELIVERING = "配送中";
        public static final String DELIVERED = "已送达";
        public static final String CANCELLED = "已取消";
        public static final String USER_PICKED = "用户已取货";
        public static final String TIMEOUT_NOT_PICKED = "超时未取货";
    }
    
    // ==================== 状态判断方法 ====================
    
    /**
     * 判断是否为有效的主订单状态
     */
    public static boolean isValidOrderStatus(int status) {
        return status >= ORDER_STATUS_PENDING_PAYMENT && 
               status <= ORDER_STATUS_REFUNDED;
    }
    
    /**
     * 判断是否为有效的外卖订单状态
     */
    public static boolean isValidTakeoutStatus(int status) {
        return status >= TAKEOUT_STATUS_PENDING_ACCEPT && 
               status <= TAKEOUT_STATUS_TIMEOUT_NOT_PICKED;
    }
    
    /**
     * 判断是否可更改状态
     */
    public static boolean canChangeOrderStatus(int status) {
        return status != ORDER_STATUS_COMPLETED && 
               status != ORDER_STATUS_CANCELLED && 
               status != ORDER_STATUS_REFUNDED;
    }
    
    /**
     * 判断是否可更改外卖订单状态
     */
    public static boolean canChangeTakeoutStatus(int status) {
        return status != TAKEOUT_STATUS_USER_PICKED && 
               status != TAKEOUT_STATUS_CANCELLED;
    }
    
    /**
     * 获取主订单状态文本
     */
    public static String getOrderStatusText(int status) {
        switch (status) {
            case ORDER_STATUS_PENDING_PAYMENT: return ORDER_STATUS_TEXT.PENDING_PAYMENT;
            case ORDER_STATUS_PAID: return ORDER_STATUS_TEXT.PAID;
            case ORDER_STATUS_WAITING_ACCEPT: return ORDER_STATUS_TEXT.WAITING_ACCEPT;
            case ORDER_STATUS_SHIPPED: return ORDER_STATUS_TEXT.SHIPPED;
            case ORDER_STATUS_DELIVERED: return ORDER_STATUS_TEXT.DELIVERED;
            case ORDER_STATUS_COMPLETED: return ORDER_STATUS_TEXT.COMPLETED;
            case ORDER_STATUS_CANCELLED: return ORDER_STATUS_TEXT.CANCELLED;
            case ORDER_STATUS_TIMEOUT_NOT_PICKED: return ORDER_STATUS_TEXT.TIMEOUT_NOT_PICKED;
            case ORDER_STATUS_REFUNDING: return ORDER_STATUS_TEXT.REFUNDING;
            case ORDER_STATUS_REFUNDED: return ORDER_STATUS_TEXT.REFUNDED;
            default: return "未知状态";
        }
    }
    
    /**
     * 获取外卖订单状态文本
     */
    public static String getTakeoutStatusText(int status) {
        switch (status) {
            case TAKEOUT_STATUS_PENDING_ACCEPT: return TAKEOUT_STATUS_TEXT.PENDING_ACCEPT;
            case TAKEOUT_STATUS_ACCEPTED: return TAKEOUT_STATUS_TEXT.ACCEPTED;
            case TAKEOUT_STATUS_DELIVERING: return TAKEOUT_STATUS_TEXT.DELIVERING;
            case TAKEOUT_STATUS_DELIVERED: return TAKEOUT_STATUS_TEXT.DELIVERED;
            case TAKEOUT_STATUS_CANCELLED: return TAKEOUT_STATUS_TEXT.CANCELLED;
            case TAKEOUT_STATUS_USER_PICKED: return TAKEOUT_STATUS_TEXT.USER_PICKED;
            case TAKEOUT_STATUS_TIMEOUT_NOT_PICKED: return TAKEOUT_STATUS_TEXT.TIMEOUT_NOT_PICKED;
            default: return "未知状态";
        }
    }
}