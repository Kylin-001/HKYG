package com.heikeji.mall.takeout.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

/**
 * 外卖服务配置类
 */
@Configuration
@MapperScan("com.heikeji.mall.takeout.mapper")
public class TakeoutConfig {
}