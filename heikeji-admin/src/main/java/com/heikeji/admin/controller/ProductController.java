package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.feign.ProductFeignClient;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 商品管理控制器
 */
@Api(tags = "商品管理")
@RestController
@RequestMapping("/api/product")
public class ProductController {
    
    @Autowired
    private ProductFeignClient productFeignClient;

    /**
     * 分页查询商品列表
     */
    @ApiOperation("分页查询商品列表")
    @GetMapping("/list")
    public R productList(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer pageNo,
            @ApiParam("每页条数") @RequestParam(defaultValue = "10") Integer pageSize,
            @ApiParam("关键词") @RequestParam(required = false) String keyword,
            @ApiParam("分类ID") @RequestParam(required = false) Long categoryId,
            @ApiParam("商家ID") @RequestParam(required = false) Long merchantId,
            @ApiParam("状态") @RequestParam(required = false) Integer status) {
        // 调用商品服务获取真实数据
        return productFeignClient.getProductList(pageNo, pageSize, keyword, categoryId, merchantId, status);
    }

    /**
     * 根据ID获取商品详情
     */
    @ApiOperation("根据ID获取商品详情")
    @GetMapping("/{id}")
    public R getProductById(@ApiParam("商品ID") @PathVariable("id") Long id) {
        // 调用商品服务获取真实数据
        return productFeignClient.getProductById(id);
    }

    /**
     * 添加商品
     */
    @ApiOperation("添加商品")
    @PostMapping("/")
    public R addProduct(@ApiParam("商品信息") @RequestBody Map<String, Object> product) {
        // 调用商品服务添加商品
        return productFeignClient.addProduct(product);
    }

    /**
     * 修改商品
     */
    @ApiOperation("修改商品")
    @PutMapping("/")
    public R updateProduct(@ApiParam("商品信息") @RequestBody Map<String, Object> product) {
        // 调用商品服务修改商品
        return productFeignClient.updateProduct(product);
    }

    /**
     * 删除商品
     */
    @ApiOperation("删除商品")
    @DeleteMapping("/{id}")
    public R deleteProduct(@ApiParam("商品ID") @PathVariable("id") Long id) {
        // 调用商品服务删除商品
        return productFeignClient.deleteProduct(id);
    }

    /**
     * 批量删除商品
     */
    @ApiOperation("批量删除商品")
    @DeleteMapping("/batch")
    public R batchDelete(@ApiParam("商品ID列表") @RequestBody List<Long> ids) {
        // 调用商品服务批量删除商品
        return productFeignClient.batchDeleteProduct(ids);
    }

    /**
     * 商品上架
     */
    @ApiOperation("商品上架")
    @PutMapping("/{id}/putOn")
    public R putOn(@ApiParam("商品ID") @PathVariable("id") Long id) {
        // 调用商品服务上架商品
        return productFeignClient.putOn(id);
    }

    /**
     * 商品下架
     */
    @ApiOperation("商品下架")
    @PutMapping("/{id}/putOff")
    public R putOff(@ApiParam("商品ID") @PathVariable("id") Long id) {
        // 调用商品服务下架商品
        return productFeignClient.putOff(id);
    }

    /**
     * 根据分类ID查询商品列表
     */
    @ApiOperation("根据分类ID查询商品列表")
    @GetMapping("/category/{categoryId}")
    public R getProductsByCategory(@ApiParam("分类ID") @PathVariable("categoryId") Long categoryId) {
        // 调用商品服务获取分类商品
        return productFeignClient.getProductsByCategory(categoryId);
    }

    /**
     * 获取热门和新上架商品
     */
    @ApiOperation("获取热门和新上架商品")
    @GetMapping("/hot")
    public R getHotProducts(@ApiParam("数量限制") @RequestParam(defaultValue = "10") Integer limit) {
        // 调用商品服务获取热门商品
        return productFeignClient.getHotProducts(limit);
    }

    /**
     * 获取商品总数
     */
    @ApiOperation("获取商品总数")
    @GetMapping("/count")
    public R getProductCount() {
        // 调用商品服务获取商品总数
        return productFeignClient.getProductCount();
    }

    /**
     * 获取热门搜索词列表
     */
    @ApiOperation("获取热门搜索词列表")
    @GetMapping("/hotWords")
    public R getHotWords(@ApiParam("数量限制") @RequestParam(defaultValue = "10") Integer limit) {
        // 调用商品服务获取热门搜索词
        return productFeignClient.getHotWords(limit);
    }
}
