package com.heikeji.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * APP版本管理配置类
 * 从配置文件中读取APP版本相关配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.version")
public class AppVersionConfig {
    
    /**
     * 最低支持版本
     */
    private String min;
    
    /**
     * 最新版本
     */
    private String latest;
    
    /**
     * 更新描述
     */
    private String updateDescription = "优化用户体验，修复已知问题";
    
    /**
     * 是否强制更新
     */
    private boolean forceUpdate = false;
    
    /**
     * 安卓下载地址
     */
    private String androidDownloadUrl;
    
    /**
     * iOS下载地址
     */
    private String iosDownloadUrl;
}