package com.heikeji.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 系统管理模块启动类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
@ComponentScan(basePackages = {"com.heikeji.system", "com.heikeji.common"}, excludeFilters = {
    @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
        com.heikeji.common.core.security.JwtAuthenticationFilter.class,
        com.heikeji.common.security.filter.JwtAuthenticationFilter.class,
        com.heikeji.common.core.config.SecurityConfig.class
    })
})
@MapperScan("com.heikeji.system.mapper")
public class SystemApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SystemApplication.class, args);
    }
}
