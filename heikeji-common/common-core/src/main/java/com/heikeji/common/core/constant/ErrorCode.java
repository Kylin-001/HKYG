package com.heikeji.common.core.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 统一错误码枚举
 * 集中管理所有API错误码，便于维护和统一
 *
 * @author: zky
 * @date: 2024-01-01
 */
public enum ErrorCode {
    // =============== 基础错误码 ===============
    /** 成功 */
    SUCCESS(200, "操作成功"),
    /** 失败 */
    FAIL(500, "操作失败"),
    
    // =============== 系统级别错误码(1-999) ===============
    /** 系统内部错误 */
    SYSTEM_ERROR(1001, "系统内部错误"),
    /** 系统维护中 */
    SYSTEM_MAINTENANCE(1002, "系统维护中"),
    /** 服务不可用 */
    SERVICE_UNAVAILABLE(1003, "服务不可用"),
    
    // =============== 参数错误码(1000-1999) ===============
    /** 参数错误 */
    PARAM_ERROR(10001, "参数错误"),
    /** 参数不能为空 */
    PARAM_NOT_NULL(10002, "参数不能为空"),
    /** 参数格式错误 */
    PARAM_FORMAT_ERROR(10003, "参数格式错误"),
    /** 参数值无效 */
    PARAM_VALUE_INVALID(10004, "参数值无效"),
    
    // =============== 认证授权错误码(2000-2999) ===============
    /** 未授权 */
    UNAUTHORIZED(20001, "未授权，请先登录"),
    /** Token已过期 */
    TOKEN_EXPIRED(20002, "登录已过期，请重新登录"),
    /** Token无效 */
    TOKEN_INVALID(20003, "登录状态无效，请重新登录"),
    /** 无权限访问 */
    PERMISSION_DENIED(20004, "无权限访问此资源"),
    /** 需要管理员权限 */
    NEED_ADMIN_PERMISSION(20005, "需要管理员权限"),
    /** 账号已被禁用 */
    ACCOUNT_DISABLED(20006, "账号已被禁用"),
    /** 账号已被锁定 */
    ACCOUNT_LOCKED(20007, "账号已被锁定"),
    
    // =============== 用户相关错误码(3000-3999) ===============
    /** 用户不存在 */
    USER_NOT_FOUND(30001, "用户不存在"),
    /** 用户已存在 */
    USER_EXIST(30002, "用户已存在"),
    /** 手机号已被注册 */
    PHONE_EXIST(30003, "手机号已被注册"),
    /** 学号已被绑定 */
    STUDENT_NO_EXIST(30004, "学号已被绑定"),
    /** 密码错误 */
    PASSWORD_ERROR(30005, "密码错误"),
    /** 两次密码不一致 */
    PASSWORD_NOT_MATCH(30006, "两次密码不一致"),
    
    // =============== 业务相关错误码(4000-4999) ===============
    /** 资源不存在 */
    RESOURCE_NOT_FOUND(40001, "请求的资源不存在"),
    /** 资源已存在 */
    RESOURCE_EXIST(40002, "资源已存在"),
    /** 操作失败 */
    OPERATION_FAILED(40003, "操作失败"),
    /** 数据已被删除 */
    DATA_DELETED(40004, "数据已被删除"),
    
    // =============== 订单相关错误码(5000-5999) ===============
    /** 订单不存在 */
    ORDER_NOT_FOUND(50001, "订单不存在"),
    /** 订单状态错误 */
    ORDER_STATUS_ERROR(50002, "订单状态错误"),
    /** 库存不足 */
    INVENTORY_INSUFFICIENT(50003, "库存不足"),
    /** 支付失败 */
    PAYMENT_FAILED(50004, "支付失败"),
    
    // =============== 文件相关错误码(6000-6999) ===============
    /** 文件上传失败 */
    FILE_UPLOAD_FAILED(60001, "文件上传失败"),
    /** 文件下载失败 */
    FILE_DOWNLOAD_FAILED(60002, "文件下载失败"),
    /** 文件大小超出限制 */
    FILE_SIZE_EXCEED(60003, "文件大小超出限制"),
    /** 文件类型不支持 */
    FILE_TYPE_NOT_SUPPORT(60004, "文件类型不支持"),
    
    // =============== 微信相关错误码(7000-7999) ===============
    /** 微信登录失败 */
    WECHAT_LOGIN_FAILED(70001, "微信登录失败"),
    /** 微信支付失败 */
    WECHAT_PAY_FAILED(70002, "微信支付失败"),
    /** 微信接口调用失败 */
    WECHAT_API_FAILED(70003, "微信接口调用失败"),
    
    // =============== 限流相关错误码(8000-8999) ===============
    /** 请求过于频繁 */
    REQUEST_TOO_FREQUENT(80001, "请求过于频繁，请稍后再试"),
    /** 达到接口调用上限 */
    API_LIMIT_EXCEEDED(80002, "已达到今日接口调用上限"),
    ;
    
    private final Integer code;
    private final String message;
    
    // 枚举构造器
    private ErrorCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
    
    // 手动添加getter方法
    public Integer getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }

    /**
     * 根据错误码获取错误信息
     * @param code 错误码
     * @return 错误信息，如果不存在返回null
     */
    public static String getMessageByCode(Integer code) {
        for (ErrorCode errorCode : ErrorCode.values()) {
            if (errorCode.getCode().equals(code)) {
                return errorCode.getMessage();
            }
        }
        return "未知错误";
    }
    
    /**
     * 根据错误码获取枚举实例
     * @param code 错误码
     * @return 枚举实例，如果不存在返回null
     */
    public static ErrorCode getByCode(Integer code) {
        for (ErrorCode errorCode : ErrorCode.values()) {
            if (errorCode.getCode().equals(code)) {
                return errorCode;
            }
        }
        return null;
    }
}