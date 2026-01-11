package com.heikeji.thirdparty.service;

/**
 * 第三方服务接口，所有第三方服务都需要实现此接口
 */
public interface ThirdPartyService {
    
    /**
     * 获取服务类型
     * @return 服务类型，如：WECHAT_PAY, ALIPAY, SMS, NOTIFICATION, MAP等
     */
    String getServiceType();
    
    /**
     * 初始化服务
     * @param config 服务配置
     */
    void init(Object config);
    
    /**
     * 执行服务操作
     * @param params 操作参数
     * @return 操作结果
     */
    Object execute(Object params);
    
    /**
     * 处理回调
     * @param callbackData 回调数据
     * @return 回调处理结果
     */
    Object handleCallback(Object callbackData);
    
    /**
     * 检查服务状态
     * @return 服务状态，true表示正常，false表示异常
     */
    boolean checkStatus();
    
    /**
     * 获取服务名称
     * @return 服务名称
     */
    String getServiceName();
}
