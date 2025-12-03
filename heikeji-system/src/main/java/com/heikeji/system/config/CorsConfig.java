package com.heikeji.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 跨域配置
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Configuration
public class CorsConfig {

    /**
     * 跨域过滤器
     */
    @Bean
    public CorsFilter corsFilter() {
        // 配置源
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // 跨域配置
        CorsConfiguration config = new CorsConfiguration();
        // 允许所有域
        config.addAllowedOrigin("*");
        // 允许所有方法
        config.addAllowedMethod("*");
        // 允许所有请求头
        config.addAllowedHeader("*");
        // 允许证书
        config.setAllowCredentials(true);
        // 预检请求的有效期（秒）
        config.setMaxAge(1800L);
        
        // 注册配置
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
