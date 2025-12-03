package com.heikeji.mall.product.service.impl;

import com.heikeji.mall.product.service.ProductService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

/**
 * 商品服务性能测试
 */
@SpringBootTest
class ProductServicePerformanceTest {

    @Resource
    private ProductService productService;

    /**
     * 测试通用推荐功能的性能
     */
    @Test
    void testRecommendPerformance() {
        int iterations = 100; // 执行100次测试
        long totalTime = 0;
        
        for (int i = 0; i < iterations; i++) {
            long startTime = System.currentTimeMillis();
            productService.getRecommendProductList(10);
            long endTime = System.currentTimeMillis();
            totalTime += (endTime - startTime);
        }
        
        double avgTime = (double) totalTime / iterations;
        System.out.println("通用推荐平均响应时间: " + avgTime + "ms");
        Assertions.assertTrue(avgTime < 100, "通用推荐响应时间应小于100ms");
    }

    /**
     * 测试个性化推荐功能的性能
     * 注意：在实际环境中需要替换为真实的用户ID
     */
    @Test
    void testPersonalizedRecommendPerformance() {
        Long testUserId = 1L; // 假设用户ID为1
        int iterations = 50; // 执行50次测试
        long totalTime = 0;
        
        for (int i = 0; i < iterations; i++) {
            long startTime = System.currentTimeMillis();
            productService.getPersonalizedRecommendProductList(testUserId, 10);
            long endTime = System.currentTimeMillis();
            totalTime += (endTime - startTime);
        }
        
        double avgTime = (double) totalTime / iterations;
        System.out.println("个性化推荐平均响应时间: " + avgTime + "ms");
        // 个性化推荐由于需要查询更多数据，响应时间可以略高，但应控制在合理范围内
        Assertions.assertTrue(avgTime < 200, "个性化推荐响应时间应小于200ms");
    }

    /**
     * 测试不同用户的个性化推荐性能一致性
     */
    @Test
    void testDifferentUsersPerformance() {
        // 模拟不同的用户ID
        Long[] userIds = {1L, 2L, 3L, 4L, 5L};
        int limit = 10;
        
        for (Long userId : userIds) {
            long startTime = System.currentTimeMillis();
            productService.getPersonalizedRecommendProductList(userId, limit);
            long endTime = System.currentTimeMillis();
            System.out.println("用户ID " + userId + " 的推荐响应时间: " + (endTime - startTime) + "ms");
        }
    }

    /**
     * 测试大批量请求的稳定性
     */
    @Test
    void testBatchRequests() {
        Long testUserId = 1L;
        int batchSize = 5;
        int totalRequests = 20;
        
        for (int i = 0; i < totalRequests; i += batchSize) {
            long startTime = System.currentTimeMillis();
            
            for (int j = 0; j < batchSize && (i + j) < totalRequests; j++) {
                productService.getPersonalizedRecommendProductList(testUserId, 8);
            }
            
            long endTime = System.currentTimeMillis();
            System.out.println("批次 " + (i / batchSize + 1) + " 响应时间: " + (endTime - startTime) + "ms");
            
            try {
                // 模拟请求间隔
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}