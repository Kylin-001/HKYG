package com.heikeji.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger配置类（暂时禁用）
 * 注释掉所有swagger相关代码以避免Spring Boot 2.7.14兼容性问题
 */
@Configuration
public class SwaggerConfig {

    /**
     * Swagger配置已完成启用，返回null避免初始化
     * 等Spring Boot 2.7.14兼容性问题解决后再启用
     */
    @Bean
    public Object createRestApi() {
        return null; // 完全禁用Swagger
    }
}