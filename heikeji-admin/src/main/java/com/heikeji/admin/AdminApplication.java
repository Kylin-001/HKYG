package com.heikeji.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 后台管理系统启动类
 */
@SpringBootApplication
@EnableFeignClients(basePackages = "com.heikeji")
public class AdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class, args);
        System.out.println("Admin服务启动成功！");
    }
}
