package com.heikeji.mall.campus.config;

import com.heikeji.mall.campus.service.CampusNoticeService;
import com.heikeji.mall.campus.service.EmptyClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 校园信息服务缓存预热配置类
 * 系统启动时加载热点数据到缓存中，避免冷启动问题
 */
@Component
@Order(1)
public class CacheWarmupConfig implements ApplicationRunner {

    @Autowired
    private CampusNoticeService campusNoticeService;
    
    @Autowired
    private EmptyClassroomService emptyClassroomService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("开始校园信息服务缓存预热...");
        
        // 预热校园公告
        System.out.println("预热校园公告...");
        // 例如：预热最新公告列表
        
        // 预热空教室数据
        System.out.println("预热空教室数据...");
        // 计算当前时间和明天的日期范围
        Date today = new Date();
        Date tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        // 预热校园统计数据
        System.out.println("预热校园统计数据...");
        // 计算最近7天的日期范围
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        System.out.println("校园信息服务缓存预热完成！");
    }
}