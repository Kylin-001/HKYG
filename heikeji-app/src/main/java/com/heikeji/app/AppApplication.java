package com.heikeji.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * APP应用主入口类
 * 移动端APP应用接口服务启动类
 */
@SpringBootApplication
@ComponentScan(basePackages = {
        "com.heikeji.app",
        "com.heikeji.common"
})
@EntityScan("com.heikeji.app.model")
@EnableFeignClients
@EnableScheduling
public class AppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }

}