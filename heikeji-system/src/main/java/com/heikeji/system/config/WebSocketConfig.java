package com.heikeji.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * WebSocket配置
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Configuration
public class WebSocketConfig {

    /**
     * 注入ServerEndpointExporter，自动注册使用了@ServerEndpoint的Bean
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
