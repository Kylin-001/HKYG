package com.heikeji.thirdparty.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

/**
 * 第三方服务配置属性类，用于从配置文件中读取第三方服务的配置信息
 */
@Data
@ConfigurationProperties(prefix = "third-party")
public class ThirdPartyProperties {
    
    // 第三方服务配置映射，key为服务类型，value为服务配置
    private Map<String, Object> configs = new HashMap<>();
    
    // 是否启用第三方服务自动配置
    private boolean enabled = true;
    
    // 服务调用超时时间（毫秒）
    private int timeout = 5000;
}
