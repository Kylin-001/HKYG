package com.heikeji.mall.order.config;

import com.heikeji.mall.order.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Date;

/**
 * 订单定时任务配置类
 */
@Configuration
@EnableScheduling
@Slf4j
public class OrderTaskConfig {

    @Autowired
    private OrderService orderService;

    /**
     * 定时取消超时未支付的订单
     * 每5分钟执行一次
     */
    @Scheduled(cron = "0 0/5 * * * ?")
    public void autoCancelTimeoutOrders() {
        log.info("开始执行定时任务：取消超时未支付订单，执行时间：{}", new Date());
        try {
            int cancelCount = orderService.cancelTimeoutOrders();
            log.info("定时任务执行完成：成功取消{}个超时未支付订单", cancelCount);
        } catch (Exception e) {
            log.error("定时任务执行失败：取消超时未支付订单", e);
        }
    }

    /**
     * 定时自动确认收货
     * 每天凌晨1点执行一次
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void autoConfirmReceivedOrders() {
        log.info("开始执行定时任务：自动确认收货，执行时间：{}", new Date());
        try {
            int confirmCount = orderService.autoConfirmReceivedOrders();
            log.info("定时任务执行完成：成功自动确认{}个订单的收货", confirmCount);
        } catch (Exception e) {
            log.error("定时任务执行失败：自动确认收货", e);
        }
    }
}
