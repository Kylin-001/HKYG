package com.heikeji.mall.product.config;

import com.heikeji.mall.product.service.CategoryService;
import com.heikeji.mall.product.service.ProductService;
import com.heikeji.mall.product.service.ProductRecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * 缓存预热配置类
 * 系统启动时加载热点数据到缓存中，避免冷启动问题
 */
@Component
@Order(1)
public class CacheWarmupConfig implements ApplicationRunner {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private ProductRecommendService productRecommendService;
    
    @Autowired
    private Environment environment;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 检查是否为测试环境
        String[] activeProfiles = environment.getActiveProfiles();
        boolean isTest = false;
        for (String profile : activeProfiles) {
            if ("test".equals(profile)) {
                isTest = true;
                break;
            }
        }
        
        if (isTest) {
            System.out.println("测试环境，跳过缓存预热...");
            return;
        }
        
        System.out.println("开始缓存预热...");
        
        // 预热热点商品数据
        System.out.println("预热热点商品数据...");
        productService.getHotProducts(20);
        
        // 预热热门商品推荐数据
        System.out.println("预热热门商品推荐数据...");
        productRecommendService.getHotProductRecommendations(20);
        
        // 预热分类数据
        System.out.println("预热分类数据...");
        categoryService.getEnabledCategoryTree();
        
        System.out.println("缓存预热完成！");
    }
}