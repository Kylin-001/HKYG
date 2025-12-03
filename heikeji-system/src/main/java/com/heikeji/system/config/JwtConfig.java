package com.heikeji.system.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT配置类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    /**
     * JWT密钥
     */
    private String secret;

    /**
     * 过期时间（秒）
     */
    private Long expiration;

    /**
     * 请求头名称
     */
    private String header;

    /**
     * 前缀
     */
    private String prefix;

    /**
     * 获取完整的令牌前缀
     */
    public String getTokenPrefix() {
        return prefix + " ";
    }
}
