package com.heikeji.mall.takeout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 外卖服务启动类
 */
@SpringBootApplication(scanBasePackages = {"com.heikeji.mall.takeout", "com.heikeji.common"})
public class TakeoutApplication {

    public static void main(String[] args) {
        SpringApplication.run(TakeoutApplication.class, args);
    }

}