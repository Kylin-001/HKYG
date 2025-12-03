package com.heikeji.app.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.heikeji.app.model.response.AppResponse;
import com.heikeji.app.service.ProductService;

/**
 * 产品控制器
 * 处理APP端的产品列表、详情等功能
 */
@RestController
@RequestMapping("/api/app/product")
@Api(tags = "产品管理")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * 获取产品列表
     */
    @GetMapping("/list")
    @ApiOperation("获取产品列表")
    public AppResponse<?> getProductList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy) {
        return productService.getProductList(page, limit, categoryId, keyword, sortBy);
    }

    /**
     * 获取产品详情
     */
    @GetMapping("/detail/{productId}")
    @ApiOperation("获取产品详情")
    public AppResponse<?> getProductDetail(@PathVariable Long productId) {
        return productService.getProductDetail(productId);
    }

    /**
     * 获取推荐产品
     */
    @GetMapping("/recommend")
    @ApiOperation("获取推荐产品")
    public AppResponse<?> getRecommendProducts(@RequestParam(defaultValue = "10") Integer limit) {
        return productService.getRecommendProducts(limit);
    }

    /**
     * 获取热销产品
     */
    @GetMapping("/hot")
    @ApiOperation("获取热销产品")
    public AppResponse<?> getHotProducts(@RequestParam(defaultValue = "10") Integer limit) {
        return productService.getHotProducts(limit);
    }
}