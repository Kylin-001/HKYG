package com.heikeji.mall.product.service.impl;

import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.annotation.Resource;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 商品服务实现类测试
 */
@SpringBootTest
class ProductServiceImplTest {

    @Resource
    private ProductService productService;

    /**
     * 测试通用推荐功能
     */
    @Test
    void testGetRecommendProductList() {
        List<Product> products = productService.getRecommendProductList(6);
        assertNotNull(products, "推荐商品列表不应为空");
        assertFalse(products.isEmpty(), "推荐商品列表不应为空集合");
        assertTrue(products.size() <= 6, "推荐商品数量不应超过限制");
        System.out.println("通用推荐商品数量: " + products.size());
    }

    /**
     * 测试个性化推荐功能（使用模拟用户ID）
     * 注意：在实际环境中需要替换为真实的用户ID
     */
    @Test
    void testGetPersonalizedRecommendProductList() {
        // 使用模拟用户ID进行测试，实际应用中需要替换为有效的用户ID
        Long testUserId = 1L; // 假设用户ID为1
        List<Product> personalizedProducts = productService.getPersonalizedRecommendProductList(testUserId, 10);
        
        assertNotNull(personalizedProducts, "个性化推荐商品列表不应为空");
        // 允许返回空集合（如果用户没有浏览历史），但不应返回null
        assertTrue(personalizedProducts.size() <= 10, "个性化推荐商品数量不应超过限制");
        
        System.out.println("个性化推荐商品数量: " + personalizedProducts.size());
        // 打印部分商品信息用于验证
        personalizedProducts.stream().limit(3).forEach(p -> {
            System.out.println("推荐商品: " + p.getName() + ", 分类ID: " + p.getCategoryId() + ", 销量: " + p.getSales());
        });
    }

    /**
     * 测试没有用户ID的情况（应返回通用推荐）
     */
    @Test
    void testGetPersonalizedRecommendProductListWithoutUserId() {
        List<Product> products = productService.getPersonalizedRecommendProductList(null, 8);
        assertNotNull(products, "无用户ID时应返回通用推荐列表");
        assertTrue(products.size() <= 8, "推荐商品数量不应超过限制");
        System.out.println("无用户ID时推荐商品数量: " + products.size());
    }

    /**
     * 测试无效限制数量的情况
     */
    @Test
    void testGetPersonalizedRecommendProductListWithInvalidLimit() {
        Long testUserId = 1L;
        List<Product> products = productService.getPersonalizedRecommendProductList(testUserId, -1);
        // 对于无效的限制数量，应该返回默认推荐或空列表
        assertNotNull(products, "无效限制数量时返回值不应为null");
    }
}