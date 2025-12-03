package com.heikeji.system.config;

import feign.Logger;
import feign.Request;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Feign客户端配置
 */
@Configuration
public class FeignConfig {

    /**
     * 配置Feign日志级别
     */
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    /**
     * 配置请求超时
     */
    @Bean
    public Request.Options options() {
        return new Request.Options(
                5, TimeUnit.SECONDS,  // 连接超时时间
                30, TimeUnit.SECONDS,  // 读取超时时间
                true  // 跟随重定向
        );
    }
}
