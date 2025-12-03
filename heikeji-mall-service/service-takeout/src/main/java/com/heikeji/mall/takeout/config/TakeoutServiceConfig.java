package com.heikeji.mall.takeout.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 外卖服务模块配置类
 */
@Configuration
@EnableTransactionManagement
@ComponentScan("com.heikeji.mall.takeout")
public class TakeoutServiceConfig {
    // 配置相关的Bean和设置
}