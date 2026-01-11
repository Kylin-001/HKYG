package com.heikeji.thirdparty.service.impl;

import com.heikeji.thirdparty.service.AbstractThirdPartyService;

import java.util.Map;

/**
 * 短信服务示例实现，展示如何使用第三方服务集成架构
 */
public class SmsThirdPartyService extends AbstractThirdPartyService {
    
    // 服务类型常量
    public static final String SERVICE_TYPE = "SMS";
    
    // 服务名称常量
    public static final String SERVICE_NAME = "短信服务";
    
    /**
     * 构造方法
     */
    public SmsThirdPartyService() {
        super(SERVICE_TYPE, SERVICE_NAME);
    }
    
    @Override
    public Object execute(Object params) {
        logOperation("sendSms", params);
        
        // 模拟发送短信的实现
        if (params instanceof Map<?, ?>) {
            Map<?, ?> smsParams = (Map<?, ?>) params;
            String phone = (String) smsParams.get("phone");
            String content = (String) smsParams.get("content");
            
            // 实际项目中这里会调用具体的短信API
            logResult("sendSms", "成功发送短信到: " + phone + ", 内容: " + content);
            
            return Map.of("success", true, "message", "短信发送成功");
        }
        
        return Map.of("success", false, "message", "参数格式错误");
    }
    
    @Override
    public Object handleCallback(Object callbackData) {
        logOperation("handleCallback", callbackData);
        
        // 模拟处理短信回调的实现
        // 实际项目中这里会解析短信服务商的回调数据
        logResult("handleCallback", "处理短信回调成功");
        
        return Map.of("success", true, "message", "回调处理成功");
    }
}
