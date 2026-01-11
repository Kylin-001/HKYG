package com.heikeji.mall.order.exception;

import com.heikeji.common.core.exception.BaseException;

/**
 * 订单异常类
 * 用于处理订单相关的业务异常
 *
 * @author: zky
 * @date: 2024-01-01
 */
public class OrderException extends BaseException {
    private static final long serialVersionUID = 1L;

    /**
     * 订单不存在
     */
    public static final Integer ORDER_NOT_FOUND = 40401;
    
    /**
     * 订单状态不正确
     */
    public static final Integer ORDER_STATUS_ERROR = 40001;
    
    /**
     * 订单金额错误
     */
    public static final Integer ORDER_AMOUNT_ERROR = 40002;
    
    /**
     * 订单支付失败
     */
    public static final Integer ORDER_PAY_FAILED = 50001;
    
    /**
     * 订单取消失败
     */
    public static final Integer ORDER_CANCEL_FAILED = 50002;
    
    /**
     * 订单退款失败
     */
    public static final Integer ORDER_REFUND_FAILED = 50003;
    
    /**
     * 订单发货失败
     */
    public static final Integer ORDER_DELIVERY_FAILED = 50004;
    
    /**
     * 订单确认收货失败
     */
    public static final Integer ORDER_CONFIRM_FAILED = 50005;
    
    /**
     * 订单已关闭
     */
    public static final Integer ORDER_CLOSED = 40003;
    
    /**
     * 订单已过期
     */
    public static final Integer ORDER_EXPIRED = 40004;
    
    /**
     * 库存不足
     */
    public static final Integer ORDER_STOCK_INSUFFICIENT = 40005;
    
    /**
     * 权限不足
     */
    public static final Integer ORDER_PERMISSION_DENIED = 40301;
    
    /**
     * 系统错误
     */
    public static final Integer ORDER_SYSTEM_ERROR = 50006;
    
    /**
     * 订单重复提交
     */
    public static final Integer ORDER_DUPLICATE_SUBMIT = 40006;
    
    /**
     * 配送信息错误
     */
    public static final Integer ORDER_DELIVERY_INFO_ERROR = 40007;
    
    /**
     * 支付方式不支持
     */
    public static final Integer ORDER_PAYMENT_METHOD_NOT_SUPPORTED = 40008;
    
    /**
     * 参数错误
     */
    public static final Integer ORDER_PARAM_ERROR = 40009;
    
    /**
     * 订单配送失败
     */
    public static final Integer ORDER_DELIVER_FAILED = 50007;
    
    /**
     * 创建一个没有详细信息的OrderException
     */
    public OrderException() {
        super();
    }

    /**
     * 使用指定的错误消息构建OrderException
     */
    public OrderException(String message) {
        super(message);
    }

    /**
     * 使用指定的错误码和消息构建OrderException
     */
    public OrderException(String message, Integer code) {
        super(message, code);
    }

    /**
     * 使用指定的错误消息和原因构建OrderException
     */
    public OrderException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 使用指定的错误码、消息和原因构建OrderException
     */
    public OrderException(String message, Integer code, Throwable cause) {
        super(message, code, cause);
    }

    /**
     * 使用指定的原因构建OrderException
     */
    public OrderException(Throwable cause) {
        super(cause);
    }

    /**
     * 创建一个带格式化消息的OrderException
     */
    public OrderException(String message, Object... args) {
        super(message, args);
    }
}