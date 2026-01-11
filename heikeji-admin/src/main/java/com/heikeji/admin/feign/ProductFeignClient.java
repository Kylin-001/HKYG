package com.heikeji.admin.feign;

import com.heikeji.admin.common.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 商品服务Feign客户端
 * 用于后台管理系统调用商品服务的API接口
 */
@FeignClient(name = "heikeji-product")
public interface ProductFeignClient {
    
    /**
     * 分页查询商品列表
     */
    @GetMapping("/api/product/page")
    R getProductList(@RequestParam Integer pageNo, @RequestParam Integer pageSize, 
                   @RequestParam(required = false) String keyword, 
                   @RequestParam(required = false) Long categoryId, 
                   @RequestParam(required = false) Long merchantId, 
                   @RequestParam(required = false) Integer status);
    
    /**
     * 根据ID获取商品详情
     */
    @GetMapping("/api/product/detail/{id}")
    R getProductById(@PathVariable("id") Long id);
    
    /**
     * 添加商品
     */
    @PostMapping("/api/product")
    R addProduct(@RequestBody Map<String, Object> product);
    
    /**
     * 修改商品
     */
    @PutMapping("/api/product")
    R updateProduct(@RequestBody Map<String, Object> product);
    
    /**
     * 删除商品
     */
    @DeleteMapping("/api/product/{id}")
    R deleteProduct(@PathVariable("id") Long id);
    
    /**
     * 批量删除商品
     */
    @DeleteMapping("/api/product/batch")
    R batchDeleteProduct(@RequestBody List<Long> ids);
    
    /**
     * 商品上架
     */
    @PutMapping("/api/product/putOn/{id}")
    R putOn(@PathVariable("id") Long id);
    
    /**
     * 商品下架
     */
    @PutMapping("/api/product/putOff/{id}")
    R putOff(@PathVariable("id") Long id);
    
    /**
     * 根据分类ID查询商品列表
     */
    @GetMapping("/api/product/category/{categoryId}")
    R getProductsByCategory(@PathVariable Long categoryId);
    
    /**
     * 获取热门和新上架商品
     */
    @GetMapping("/api/product/hot")
    R getHotProducts(@RequestParam(defaultValue = "10") Integer limit);
    
    /**
     * 高级搜索商品
     */
    @PostMapping("/api/product/advancedSearch")
    R advancedSearch(@RequestParam(defaultValue = "1") Integer pageNo,
                    @RequestParam(defaultValue = "10") Integer pageSize,
                    @RequestBody Map<String, Object> searchDTO);
    
    /**
     * 获取分类及其子分类下的商品列表
     */
    @GetMapping("/api/product/listByCategoryAndChildren/{categoryId}")
    R getByCategoryAndChildren(@PathVariable Long categoryId);
    
    /**
     * 获取热门商品列表
     */
    @GetMapping("/api/product/hotList")
    R getHotProductList(@RequestParam(defaultValue = "10") Integer limit);
    
    /**
     * 获取新品列表
     */
    @GetMapping("/api/product/newList")
    R getNewProductList(@RequestParam(defaultValue = "10") Integer limit);
    
    /**
     * 获取推荐商品列表
     */
    @GetMapping("/api/product/recommendList")
    R getRecommendProductList(@RequestParam(defaultValue = "10") Integer limit);
    
    /**
     * 获取商品总数
     */
    @GetMapping("/api/product/count")
    R getProductCount();
    
    /**
     * 获取热门搜索词列表
     */
    @GetMapping("/api/product/hotWords")
    R getHotWords(@RequestParam(defaultValue = "10") Integer limit);
}