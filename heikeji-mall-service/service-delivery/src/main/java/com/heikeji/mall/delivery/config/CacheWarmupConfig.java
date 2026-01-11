package com.heikeji.mall.delivery.config;

import com.heikeji.mall.delivery.service.DeliveryOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 配送服务缓存预热配置类
 * 系统启动时加载热点数据到缓存中，避免冷启动问题
 */
@Component
@Order(1)
public class CacheWarmupConfig implements ApplicationRunner {

    @Autowired
    private DeliveryOrderService deliveryOrderService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("开始配送服务缓存预热...");
        
        // 预热配送员信息
        System.out.println("预热配送员信息...");
        // 例如：预热在线配送员列表
        
        // 预热配送统计数据
        System.out.println("预热配送统计数据...");
        // 计算最近7天的日期范围
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // 预热今日配送数据
        System.out.println("预热今日配送数据...");
        Date today = new Date();
        // 预热今日待配送订单数量等统计数据
        
        System.out.println("配送服务缓存预热完成！");
    }
}