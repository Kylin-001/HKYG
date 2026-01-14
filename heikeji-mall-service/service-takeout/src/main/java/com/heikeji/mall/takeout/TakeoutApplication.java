package com.heikeji.mall.takeout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

/**
 * 外卖服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.heikeji.mall.takeout", "com.heikeji.common"}, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
    com.heikeji.common.core.security.JwtAuthenticationFilter.class,
    com.heikeji.common.security.filter.JwtAuthenticationFilter.class,
    com.heikeji.common.core.config.SecurityConfig.class
}))
public class TakeoutApplication {

    public static void main(String[] args) {
        SpringApplication.run(TakeoutApplication.class, args);
    }

}