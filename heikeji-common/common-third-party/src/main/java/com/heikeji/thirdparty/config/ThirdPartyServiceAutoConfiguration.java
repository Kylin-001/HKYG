package com.heikeji.thirdparty.config;

import com.heikeji.thirdparty.service.ThirdPartyServiceFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * 第三方服务自动配置类，用于扫描和注册第三方服务
 */
@Configuration
@ComponentScan(basePackages = "com.heikeji.thirdparty")
@EnableConfigurationProperties(ThirdPartyProperties.class)
public class ThirdPartyServiceAutoConfiguration {
    
    /**
     * 构造方法，初始化第三方服务
     * @param thirdPartyProperties 第三方服务配置属性
     */
    public ThirdPartyServiceAutoConfiguration(ThirdPartyProperties thirdPartyProperties) {
        // 初始化所有第三方服务
        ThirdPartyServiceFactory.initAllServices(thirdPartyProperties.getConfigs());
    }
}
