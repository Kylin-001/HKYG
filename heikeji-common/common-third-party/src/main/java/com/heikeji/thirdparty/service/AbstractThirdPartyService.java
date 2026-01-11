package com.heikeji.thirdparty.service;

import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 第三方服务抽象实现类，提供通用功能的实现
 */
@Data
public abstract class AbstractThirdPartyService implements ThirdPartyService {
    
    protected Logger logger = LoggerFactory.getLogger(getClass());
    
    // 服务类型
    protected String serviceType;
    
    // 服务名称
    protected String serviceName;
    
    // 服务状态
    protected boolean enabled = false;
    
    // 配置信息
    protected Object config;
    
    /**
     * 构造方法
     * @param serviceType 服务类型
     * @param serviceName 服务名称
     */
    public AbstractThirdPartyService(String serviceType, String serviceName) {
        this.serviceType = serviceType;
        this.serviceName = serviceName;
        // 自动注册服务
        ThirdPartyServiceFactory.registerService(this);
    }
    
    @Override
    public String getServiceType() {
        return serviceType;
    }
    
    @Override
    public String getServiceName() {
        return serviceName;
    }
    
    @Override
    public void init(Object config) {
        this.config = config;
        this.enabled = true;
        logger.info("初始化第三方服务: {}", serviceName);
    }
    
    @Override
    public boolean checkStatus() {
        return enabled;
    }
    
    /**
     * 记录服务调用日志
     * @param operation 操作名称
     * @param params 操作参数
     */
    protected void logOperation(String operation, Object params) {
        logger.debug("调用服务[{}]的[{}]方法，参数: {}", serviceName, operation, params);
    }
    
    /**
     * 记录服务调用结果
     * @param operation 操作名称
     * @param result 操作结果
     */
    protected void logResult(String operation, Object result) {
        logger.debug("服务[{}]的[{}]方法执行结果: {}", serviceName, operation, result);
    }
    
    /**
     * 记录服务调用异常
     * @param operation 操作名称
     * @param e 异常信息
     */
    protected void logException(String operation, Exception e) {
        logger.error("服务[{}]的[{}]方法执行异常: {}", serviceName, operation, e.getMessage(), e);
    }
}
