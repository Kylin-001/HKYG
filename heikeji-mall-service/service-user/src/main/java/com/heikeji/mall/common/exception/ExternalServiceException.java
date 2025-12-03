package com.heikeji.mall.common.exception;

/**
 * 外部服务异常类
 * 用于处理调用外部服务时发生的异常
 */
public class ExternalServiceException extends RuntimeException {

    /**
     * 错误码
     */
    private int code;

    /**
     * 服务名称
     */
    private String serviceName;

    /**
     * 默认构造方法
     */
    public ExternalServiceException() {
        super();
    }

    /**
     * 构造方法
     *
     * @param message 错误消息
     */
    public ExternalServiceException(String message) {
        super(message);
        this.code = 503; // EXTERNAL_SERVICE_ERROR
    }

    /**
     * 构造方法
     *
     * @param message    错误消息
     * @param serviceName 服务名称
     */
    public ExternalServiceException(String message, String serviceName) {
        super(message);
        this.code = 503; // EXTERNAL_SERVICE_ERROR
        this.serviceName = serviceName;
    }

    /**
     * 构造方法
     *
     * @param code       错误码
     * @param message    错误消息
     * @param serviceName 服务名称
     */
    public ExternalServiceException(int code, String message, String serviceName) {
        super(message);
        this.code = code;
        this.serviceName = serviceName;
    }

    /**
     * 构造方法
     *
     * @param message 错误消息
     * @param cause   异常原因
     */
    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
        this.code = 503; // EXTERNAL_SERVICE_ERROR
    }

    /**
     * 构造方法
     *
     * @param message    错误消息
     * @param cause      异常原因
     * @param serviceName 服务名称
     */
    public ExternalServiceException(String message, Throwable cause, String serviceName) {
        super(message, cause);
        this.code = 503; // EXTERNAL_SERVICE_ERROR
        this.serviceName = serviceName;
    }

    /**
     * 构造方法
     *
     * @param code       错误码
     * @param message    错误消息
     * @param cause      异常原因
     * @param serviceName 服务名称
     */
    public ExternalServiceException(int code, String message, Throwable cause, String serviceName) {
        super(message, cause);
        this.code = code;
        this.serviceName = serviceName;
    }

    /**
     * 获取错误码
     *
     * @return 错误码
     */
    public int getCode() {
        return code;
    }

    /**
     * 设置错误码
     *
     * @param code 错误码
     */
    public void setCode(int code) {
        this.code = code;
    }

    /**
     * 获取服务名称
     *
     * @return 服务名称
     */
    public String getServiceName() {
        return serviceName;
    }

    /**
     * 设置服务名称
     *
     * @param serviceName 服务名称
     */
    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}