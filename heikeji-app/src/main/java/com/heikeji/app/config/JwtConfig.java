package com.heikeji.app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * JWT配置类
 * 从配置文件中读取JWT相关配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {
    
    /**
     * JWT密钥
     */
    private String secret;
    
    /**
     * token过期时间（毫秒）
     */
    private long expiration;
    
    /**
     * 刷新token过期时间（毫秒）
     */
    private long refreshExpiration;
    
    /**
     * token前缀
     */
    private String tokenPrefix = "Bearer ";
    
    /**
     * 请求头名称
     */
    private String header = "Authorization";
}