package com.heikeji.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * API网关启动类
 * 负责路由转发、请求过滤、限流熔断等功能
 */
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
        System.out.println("\n==================================================\n");
        System.out.println("          API网关服务已启动成功！");
        System.out.println("          访问地址: http://localhost:9999");
        System.out.println("==================================================\n");
    }

}