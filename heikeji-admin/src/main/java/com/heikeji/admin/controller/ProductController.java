package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.feign.ProductFeignClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 商品管理控制器
 */
@Tag(name = "商品管理")
@RestController
@RequestMapping("/api/product")
public class ProductController {
    
    @Autowired
    private ProductFeignClient productFeignClient;

    /**
     * 分页查询商品列表
     */
    @Operation(summary = "分页查询商品列表")
    @GetMapping("/list")
    public R productList(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer pageNo,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "商家ID") @RequestParam(required = false) Long merchantId,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        // 调用商品服务获取真实数据
        return productFeignClient.getProductList(pageNo, pageSize, keyword, categoryId, merchantId, status);
    }

    /**
     * 根据ID获取商品详情
     */
    @Operation(summary = "根据ID获取商品详情")
    @GetMapping("/{id}")
    public R getProductById(@Parameter(description = "商品ID") @PathVariable("id") Long id) {
        // 调用商品服务获取真实数据
        return productFeignClient.getProductById(id);
    }

    /**
     * 添加商品
     */
    @Operation(summary = "添加商品")
    @PostMapping("/")
    public R addProduct(@Parameter(description = "商品信息") @RequestBody Map<String, Object> product) {
        // 调用商品服务添加商品
        return productFeignClient.addProduct(product);
    }

    /**
     * 修改商品
     */
    @Operation(summary = "修改商品")
    @PutMapping("/")
    public R updateProduct(@Parameter(description = "商品信息") @RequestBody Map<String, Object> product) {
        // 调用商品服务修改商品
        return productFeignClient.updateProduct(product);
    }

    /**
     * 删除商品
     */
    @Operation(summary = "删除商品")
    @DeleteMapping("/{id}")
    public R deleteProduct(@Parameter(description = "商品ID") @PathVariable("id") Long id) {
        // 调用商品服务删除商品
        return productFeignClient.deleteProduct(id);
    }

    /**
     * 批量删除商品
     */
    @Operation(summary = "批量删除商品")
    @DeleteMapping("/batch")
    public R batchDelete(@Parameter(description = "商品ID列表") @RequestBody List<Long> ids) {
        // 调用商品服务批量删除商品
        return productFeignClient.batchDeleteProduct(ids);
    }

    /**
     * 商品上架
     */
    @Operation(summary = "商品上架")
    @PutMapping("/{id}/putOn")
    public R putOn(@Parameter(description = "商品ID") @PathVariable("id") Long id) {
        // 调用商品服务上架商品
        return productFeignClient.putOn(id);
    }

    /**
     * 商品下架
     */
    @Operation(summary = "商品下架")
    @PutMapping("/{id}/putOff")
    public R putOff(@Parameter(description = "商品ID") @PathVariable("id") Long id) {
        // 调用商品服务下架商品
        return productFeignClient.putOff(id);
    }

    /**
     * 根据分类ID查询商品列表
     */
    @Operation(summary = "根据分类ID查询商品列表")
    @GetMapping("/category/{categoryId}")
    public R getProductsByCategory(@Parameter(description = "分类ID") @PathVariable("categoryId") Long categoryId) {
        // 调用商品服务获取分类商品
        return productFeignClient.getProductsByCategory(categoryId);
    }

    /**
     * 获取热门和新上架商品
     */
    @Operation(summary = "获取热门和新上架商品")
    @GetMapping("/hot")
    public R getHotProducts(@Parameter(description = "数量限制") @RequestParam(defaultValue = "10") Integer limit) {
        // 调用商品服务获取热门商品
        return productFeignClient.getHotProducts(limit);
    }

    /**
     * 获取商品总数
     */
    @Operation(summary = "获取商品总数")
    @GetMapping("/count")
    public R getProductCount() {
        // 调用商品服务获取商品总数
        return productFeignClient.getProductCount();
    }

    /**
     * 获取热门搜索词列表
     */
    @Operation(summary = "获取热门搜索词列表")
    @GetMapping("/hotWords")
    public R getHotWords(@Parameter(description = "数量限制") @RequestParam(defaultValue = "10") Integer limit) {
        // 调用商品服务获取热门搜索词
        return productFeignClient.getHotWords(limit);
    }
}
