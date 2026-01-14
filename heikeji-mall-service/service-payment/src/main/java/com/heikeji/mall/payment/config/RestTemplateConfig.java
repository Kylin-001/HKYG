package com.heikeji.mall.payment.config;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.core5.http.io.SocketConfig;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;

/**
 * RestTemplate配置类
 * 提供高性能的HTTP客户端配置
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    @Qualifier("paymentRestTemplate")
    public RestTemplate paymentRestTemplate(ClientHttpRequestFactory factory) {
        RestTemplate restTemplate = new RestTemplate(factory);
        
        // 确保使用UTF-8编码
        restTemplate.getMessageConverters().stream()
                .filter(converter -> converter instanceof StringHttpMessageConverter)
                .findFirst()
                .ifPresent(converter -> ((StringHttpMessageConverter) converter).setDefaultCharset(StandardCharsets.UTF_8));
        
        return restTemplate;
    }

    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory(@Qualifier("httpClient") HttpClient httpClient) {
        HttpComponentsClientHttpRequestFactory factory = 
                new HttpComponentsClientHttpRequestFactory(httpClient);
        factory.setConnectTimeout(5000); // 连接超时时间：5秒
        factory.setConnectionRequestTimeout(3000); // 从连接池获取连接的超时时间：3秒
        return factory;
    }

    @Bean
    public HttpClient httpClient() {
        // 创建连接池管理器
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        connectionManager.setMaxTotal(100); // 最大连接数
        connectionManager.setDefaultMaxPerRoute(20); // 每个路由的最大连接数
        
        // 配置socket超时
        SocketConfig socketConfig = SocketConfig.custom()
                .setSoTimeout(org.apache.hc.core5.util.Timeout.ofSeconds(10)) // 读取超时时间：10秒
                .build();
        connectionManager.setDefaultSocketConfig(socketConfig);
        
        // 配置请求超时
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectionRequestTimeout(org.apache.hc.core5.util.Timeout.ofSeconds(3)) // 从连接池获取连接的超时时间：3秒
                .setConnectTimeout(org.apache.hc.core5.util.Timeout.ofSeconds(5)) // 连接超时时间：5秒
                .build();
        
        // 创建HttpClient
        return HttpClientBuilder.create()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .evictIdleConnections(org.apache.hc.core5.util.TimeValue.ofSeconds(60)) // 清理空闲连接
                .disableAutomaticRetries() // 关闭自动重试，由应用层控制重试逻辑
                .build();
    }

}