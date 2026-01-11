package com.heikeji.mall.order.config;

import com.heikeji.mall.order.service.OrderAnalysisService;
import com.heikeji.mall.order.service.SalesAnalysisService;
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
    private OrderAnalysisService orderAnalysisService;
    
    @Autowired
    private SalesAnalysisService salesAnalysisService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("开始缓存预热...");
        
        // 获取今天和7天前的日期
        Date endDate = new Date();
        Date startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // 预热订单概览数据
        System.out.println("预热订单概览数据...");
        orderAnalysisService.getOrderOverview(startDate, endDate);
        
        // 预热订单趋势数据
        System.out.println("预热订单趋势数据...");
        orderAnalysisService.getOrderTrend(startDate, endDate, "day");
        
        // 预热销售概览数据
        System.out.println("预热销售概览数据...");
        salesAnalysisService.getSalesOverview(startDate, endDate);
        
        // 预热销售趋势数据
        System.out.println("预热销售趋势数据...");
        salesAnalysisService.getSalesTrend(startDate, endDate, "day");
        
        // 预热商品销售排名数据
        System.out.println("预热商品销售排名数据...");
        salesAnalysisService.getProductSalesRanking(startDate, endDate, 10);
        
        // 预热分类销售分布数据
        System.out.println("预热分类销售分布数据...");
        salesAnalysisService.getCategorySalesDistribution(startDate, endDate);
        
        System.out.println("缓存预热完成！");
    }
}