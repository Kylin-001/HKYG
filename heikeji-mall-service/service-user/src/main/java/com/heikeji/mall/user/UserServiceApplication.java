package com.heikeji.mall.user;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 用户服务模块启动类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@SpringBootApplication(exclude = {
    SecurityAutoConfiguration.class,
    org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration.class,
    org.springframework.boot.autoconfigure.data.redis.RedisReactiveAutoConfiguration.class
})
@EnableDiscoveryClient
@MapperScan("com.heikeji.mall.user.mapper")
@ComponentScan(basePackages = {"com.heikeji.mall.user", "com.heikeji.mall.common", "com.heikeji.common"}, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {com.heikeji.common.core.security.JwtAuthenticationFilter.class, com.heikeji.common.security.filter.JwtAuthenticationFilter.class, com.heikeji.common.core.config.SecurityConfig.class}))
@EnableScheduling
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
        System.out.println("用户管理模块启动成功！");
        System.out.println("服务地址: http://localhost:8081");
        System.out.println("API文档地址: http://localhost:8081/swagger-ui.html");
    }
}
