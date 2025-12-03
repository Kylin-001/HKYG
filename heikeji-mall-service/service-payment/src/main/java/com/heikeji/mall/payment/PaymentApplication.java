package com.heikeji.mall.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 支付服务启动类
 */
@SpringBootApplication(scanBasePackages = {"com.heikeji.mall.payment", "com.heikeji.common.core"})
public class PaymentApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentApplication.class, args);
    }

}