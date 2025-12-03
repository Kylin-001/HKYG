package com.heikeji.common.api;

/**
 * 响应结果码
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
public enum ResultCode {

    /**
     * 成功
     */
    SUCCESS(200, "操作成功"),
    
    /**
     * 失败
     */
    FAILED(500, "操作失败"),
    
    /**
     * 未授权
     */
    UNAUTHORIZED(401, "未授权"),
    
    /**
     * 禁止访问
     */
    FORBIDDEN(403, "禁止访问"),
    
    /**
     * 接口不存在
     */
    NOT_FOUND(404, "接口不存在"),
    
    /**
     * 请求方法错误
     */
    METHOD_NOT_ALLOWED(405, "请求方法错误"),
    
    /**
     * 服务器内部错误
     */
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    
    /**
     * 用户名或密码错误
     */
    USERNAME_PASSWORD_ERROR(10001, "用户名或密码错误"),
    
    /**
     * 用户不存在
     */
    USER_NOT_EXIST(10002, "用户不存在"),
    
    /**
     * 用户已存在
     */
    USER_ALREADY_EXIST(10003, "用户已存在"),
    
    /**
     * 角色不存在
     */
    ROLE_NOT_EXIST(10004, "角色不存在"),
    
    /**
     * 权限不存在
     */
    PERMISSION_NOT_EXIST(10005, "权限不存在"),
    
    /**
     * 参数错误
     */
    PARAM_ERROR(10006, "参数错误"),
    
    /**
     * 验证码错误
     */
    CAPTCHA_ERROR(10007, "验证码错误"),
    
    /**
     * 验证码过期
     */
    CAPTCHA_EXPIRE(10008, "验证码过期"),
    
    /**
     * 账号被锁定
     */
    ACCOUNT_LOCKED(10009, "账号被锁定"),
    
    /**
     * 账号已过期
     */
    ACCOUNT_EXPIRED(10010, "账号已过期"),
    
    /**
     * 凭证已过期
     */
    CREDENTIAL_EXPIRED(10011, "凭证已过期"),
    
    /**
     * 账号已被禁用
     */
    ACCOUNT_DISABLED(10012, "账号已被禁用");
    
    private final int code;
    private final String message;
    
    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public int getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
}
