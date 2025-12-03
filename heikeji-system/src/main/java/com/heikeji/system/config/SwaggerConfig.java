package com.heikeji.system.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI配置类
 * @author zhangkaiyuan
 * @date 2024-11-20
 */
@Configuration
public class SwaggerConfig {

    /**
     * 配置OpenAPI文档
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("黑科技购物系统服务API")
                        .description("黑科技购物后台管理系统服务接口文档")
                        .version("2.0.0")
                        .contact(new Contact()
                                .name("zhangkaiyuan")
                                .email("admin@heikeji.com")
                                .url("http://heikeji.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")));
    }
}