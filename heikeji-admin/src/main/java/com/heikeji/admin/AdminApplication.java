package com.heikeji.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

/**
 * 极端简化的Admin应用启动类
 * 仅启用基本自动配置，不扫描任何组件
 */
@EnableAutoConfiguration(exclude = {
    // 排除所有可能导致冲突的自动配置
    DataSourceAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class,
    // 排除actuator的安全配置
    org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
})
// 暂时不扫描任何组件，只启动最基本的Spring Boot应用
@ComponentScan(
    basePackages = "com.heikeji.admin",
    useDefaultFilters = false,
    includeFilters = {
        // 只包含当前类
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = AdminApplication.class)
    }
)
public class AdminApplication {

    public static void main(String[] args) {
        // 只启动Spring Boot基础框架，不初始化其他功能
        SpringApplication.run(AdminApplication.class, args);
        System.out.println("Admin服务基础框架启动成功！");
    }
}
