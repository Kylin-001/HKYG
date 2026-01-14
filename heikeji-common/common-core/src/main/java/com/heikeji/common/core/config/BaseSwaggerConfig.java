package com.heikeji.common.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger基础配置类
 * 注意：此文件为兼容版本，需要添加Swagger依赖才能正常使用
 */
@Configuration
public class BaseSwaggerConfig {

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Value("${app.name:heikeji-mall}")
    private String appName;

    @Value("${app.description:黑科易购商城系统}")
    private String appDescription;

    /**
     * 配置Swagger文档
     * 注意：此方法需要添加SpringDoc OpenAPI依赖才能生效
     * @return Object 占位对象
     */
    @Bean
    public Object customOpenAPI() {
        // 暂时返回null避免编译错误
        // 实际使用时需要添加以下依赖：
        // <dependency>
        //     <groupId>org.springdoc</groupId>
        //     <artifactId>springdoc-openapi-ui</artifactId>
        //     <version>${springdoc.version}</version>
        // </dependency>
        
        System.out.println("Swagger配置：" + appName + " v" + appVersion);
        return null;
    }
}