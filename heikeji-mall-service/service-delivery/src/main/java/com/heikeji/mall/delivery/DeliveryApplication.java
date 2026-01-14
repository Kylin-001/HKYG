package com.heikeji.mall.delivery;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 配送服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.heikeji.mall.delivery", "com.heikeji.common"}, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
    com.heikeji.common.core.security.JwtAuthenticationFilter.class,
    com.heikeji.common.security.filter.JwtAuthenticationFilter.class,
    com.heikeji.common.core.config.SecurityConfig.class
}))
@MapperScan("com.heikeji.mall.delivery.mapper")
@EnableScheduling
public class DeliveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryApplication.class, args);
    }

}
