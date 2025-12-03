package com.heikeji.mall.takeout.constants;

/**
 * 外卖服务常量类
 */
public class TakeoutConstants {
    // 配送方式
    public static final String DELIVERY_METHOD_LOCKER = "locker"; // 外卖柜
    public static final String DELIVERY_METHOD_SPECIAL_PLACE = "special_place"; // 特殊地点
    public static final String DELIVERY_METHOD_DORMITORY = "dormitory"; // 宿舍

    // 订单状态
    public static final Integer ORDER_STATUS_PENDING = 0; // 待接单
    public static final Integer ORDER_STATUS_ACCEPTED = 1; // 已接单
    public static final Integer ORDER_STATUS_DELIVERING = 2; // 配送中
    public static final Integer ORDER_STATUS_DELIVERED = 3; // 已送达
    public static final Integer ORDER_STATUS_CANCELLED = 4; // 已取消
    public static final Integer ORDER_STATUS_COMPLETED = 5; // 已完成
    
    // 订单状态字符串表示
    public static final String ORDER_STATUS_PENDING_STR = "pending"; // 待接单
    public static final String ORDER_STATUS_ACCEPTED_STR = "accepted"; // 已接单
    public static final String ORDER_STATUS_DELIVERING_STR = "delivering"; // 配送中
    public static final String ORDER_STATUS_DELIVERED_STR = "delivered"; // 已送达
    public static final String ORDER_STATUS_CANCELLED_STR = "cancelled"; // 已取消
    public static final String ORDER_STATUS_COMPLETED_STR = "completed"; // 已完成

    // 外卖柜状态
    public static final Integer LOCKER_STATUS_NORMAL = 0; // 正常
    public static final Integer LOCKER_STATUS_MALFUNCTION = 1; // 故障

    // 分页默认参数
    public static final Integer DEFAULT_PAGE_SIZE = 10;
    public static final Integer DEFAULT_PAGE_NUM = 1;

    // 错误码
    public static final Integer ERROR_CODE_ORDER_NOT_FOUND = 404;
    public static final Integer ERROR_CODE_INVALID_STATUS = 400;
    public static final Integer ERROR_CODE_LOCKER_NOT_AVAILABLE = 400;
    public static final Integer ERROR_CODE_CANNOT_CANCEL = 400;
}