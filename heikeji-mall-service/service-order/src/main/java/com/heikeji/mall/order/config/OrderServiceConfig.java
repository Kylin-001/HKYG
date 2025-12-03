package com.heikeji.mall.order.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 订单服务配置类
 * 用于配置订单服务模块的相关组件
 */
@Configuration
@EnableTransactionManagement
@ComponentScan({
        "com.heikeji.mall.order.service",
        "com.heikeji.mall.order.mapper",
        "com.heikeji.mall.order.config"
})
public class OrderServiceConfig {
    
    // 可以在这里添加订单服务相关的配置
}