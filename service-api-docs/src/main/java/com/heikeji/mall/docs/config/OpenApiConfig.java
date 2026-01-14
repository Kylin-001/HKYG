package com.heikeji.mall.docs.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI配置类
 * 用于配置API文档聚合服务
 *
 * @author: heikeji
 * @date: 2026-01-13
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("黑科易购API文档中心")
                        .version("1.0.0")
                        .description("黑科易购商城系统所有服务的API接口文档聚合中心")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
