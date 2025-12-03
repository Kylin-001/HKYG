package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutProduct;
import com.heikeji.mall.takeout.service.TakeoutProductService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外卖商品控制器
 */
@RestController
@RequestMapping("/api/takeout/product")
@Api(tags = "外卖商品管理")
public class TakeoutProductController {

    @Autowired
    private TakeoutProductService takeoutProductService;

    /**
     * 根据商家ID获取商品列表
     */
    @GetMapping("/merchant/{merchantId}")
    @ApiOperation("根据商家ID获取商品列表")
    public R<List<TakeoutProduct>> getProductsByMerchantId(@PathVariable Long merchantId) {
        List<TakeoutProduct> products = takeoutProductService.getProductsByMerchantId(merchantId);
        return R.success(products);
    }

    /**
     * 根据分类ID获取商品列表
     */
    @GetMapping("/category/{categoryId}")
    @ApiOperation("根据分类ID获取商品列表")
    public R<List<TakeoutProduct>> getProductsByCategoryId(@PathVariable Long categoryId) {
        List<TakeoutProduct> products = takeoutProductService.getProductsByCategoryId(categoryId);
        return R.success(products);
    }

    /**
     * 获取推荐商品
     */
    @GetMapping("/recommended/{merchantId}")
    @ApiOperation("获取推荐商品")
    public R<List<TakeoutProduct>> getRecommendedProducts(@PathVariable Long merchantId, @RequestParam(defaultValue = "6") Integer limit) {
        List<TakeoutProduct> products = takeoutProductService.getRecommendedProducts(merchantId, limit);
        return R.success(products);
    }

    /**
     * 获取商品详情
     */
    @GetMapping("/{id}")
    @ApiOperation("获取商品详情")
    public R<TakeoutProduct> getProductById(@PathVariable Long id) {
        TakeoutProduct product = takeoutProductService.getById(id);
        return R.success(product);
    }

}