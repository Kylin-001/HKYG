package com.heikeji.mall.order.feign;

import com.heikeji.mall.product.entity.Category;
import com.heikeji.mall.product.entity.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 商品服务Feign客户端
 */
@FeignClient(name = "service-product", path = "/product")
public interface ProductFeignClient {
    
    /**
     * 根据分类ID获取分类信息
     * @param categoryId 分类ID
     * @return 分类信息
     */
    @GetMapping("/category/{categoryId}")
    Category getCategoryById(@PathVariable Long categoryId);
    
    /**
     * 根据商品ID获取商品信息
     * @param productId 商品ID
     * @return 商品信息
     */
    @GetMapping("/info/{productId}")
    Product getProductById(@PathVariable Long productId);
    
    /**
     * 根据商品ID列表获取商品信息
     * @param productIds 商品ID列表
     * @return 商品信息列表
     */
    @GetMapping("/batch")
    List<Product> getProductsByIds(@RequestParam List<Long> productIds);
    
    /**
     * 获取所有分类信息
     * @return 分类列表
     */
    @GetMapping("/category/all")
    List<Category> getAllCategories();
}