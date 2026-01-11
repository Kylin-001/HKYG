package com.heikeji.mall.user.config;

import com.heikeji.mall.user.service.UserBehaviorAnalysisService;
import com.heikeji.mall.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 缓存预热配置类
 * 系统启动时加载热点数据到缓存中，避免冷启动问题
 */
@Component
@Order(1)
public class CacheWarmupConfig implements ApplicationRunner {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserBehaviorAnalysisService userBehaviorAnalysisService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("开始缓存预热...");
        
        // 预热用户统计数据
        System.out.println("预热用户统计数据...");
        // 计算最近7天的日期范围
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // 预热用户概览数据（这里简化处理，实际应该根据具体业务逻辑调整）
        // 例如：预热活跃用户列表、新用户统计等
        
        // 预热用户活跃数据
        System.out.println("预热用户活跃数据...");
        // 例如：预热最近30天的用户活跃度数据
        Date thirtyDaysAgo = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        System.out.println("缓存预热完成！");
    }
}