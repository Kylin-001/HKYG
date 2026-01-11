package com.heikeji.mall.product;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

/**
 * Product Service Application Class
 * Modified to avoid Bean conflicts
 */
@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class,
    org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class
})
// 只扫描当前模块，避免引入common.core中的冲突Bean
@ComponentScan(basePackages = "com.heikeji.mall.product")
@MapperScan("com.heikeji.mall.product.mapper")
@EnableFeignClients // 启用Feign客户端，自动扫描当前包及其子包
public class ProductApplication {

    public static void main(String[] args) {
        System.out.println("正在启动ProductApplication，已排除可能导致冲突的自动配置...");
        SpringApplication.run(ProductApplication.class, args);
        System.out.println("Product服务启动成功！");
    }
}