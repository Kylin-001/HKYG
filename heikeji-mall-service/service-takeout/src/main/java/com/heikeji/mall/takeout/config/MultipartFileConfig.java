package com.heikeji.mall.takeout.config;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;

/**
 * 文件上传配置类
 */
@Configuration
public class MultipartFileConfig {

    /**
     * 配置文件上传参数
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        
        // 设置单个文件的最大大小（10MB）
        factory.setMaxFileSize(DataSize.ofMegabytes(10));
        
        // 设置总上传文件的最大大小（50MB）
        factory.setMaxRequestSize(DataSize.ofMegabytes(50));
        
        return factory.createMultipartConfig();
    }
}
