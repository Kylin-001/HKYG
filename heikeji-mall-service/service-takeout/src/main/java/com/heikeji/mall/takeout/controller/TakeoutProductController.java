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
        TakeoutProduct product = takeoutProductService.getProductById(id);
        return R.success(product);
    }

    /**
     * 创建菜品
     */
    @PostMapping
    @ApiOperation("创建菜品")
    public R<Boolean> createProduct(@RequestBody TakeoutProduct product) {
        boolean success = takeoutProductService.createProduct(product);
        return R.success(success);
    }

    /**
     * 更新菜品
     */
    @PutMapping
    @ApiOperation("更新菜品")
    public R<Boolean> updateProduct(@RequestBody TakeoutProduct product) {
        boolean success = takeoutProductService.updateProduct(product);
        return R.success(success);
    }

    /**
     * 删除菜品
     */
    @DeleteMapping("/{productId}")
    @ApiOperation("删除菜品")
    public R<Boolean> deleteProduct(@PathVariable Long productId) {
        boolean success = takeoutProductService.deleteProduct(productId);
        return R.success(success);
    }

    /**
     * 批量删除菜品
     */
    @DeleteMapping("/batch")
    @ApiOperation("批量删除菜品")
    public R<Boolean> batchDeleteProducts(@RequestBody List<Long> productIds) {
        boolean success = takeoutProductService.batchDeleteProducts(productIds);
        return R.success(success);
    }

    /**
     * 更新菜品状态（上架/下架）
     */
    @PutMapping("/{productId}/status")
    @ApiOperation("更新菜品状态")
    public R<Boolean> updateProductStatus(@PathVariable Long productId, @RequestParam Integer status) {
        boolean success = takeoutProductService.updateProductStatus(productId, status);
        return R.success(success);
    }

    /**
     * 更新菜品库存
     */
    @PutMapping("/{productId}/stock")
    @ApiOperation("更新菜品库存")
    public R<Boolean> updateProductStock(@PathVariable Long productId, @RequestParam Integer stock) {
        boolean success = takeoutProductService.updateProductStock(productId, stock);
        return R.success(success);
    }

    /**
     * 批量更新菜品库存
     */
    @PutMapping("/batch/stock")
    @ApiOperation("批量更新菜品库存")
    public R<Boolean> batchUpdateProductStock(@RequestParam List<Long> productIds, @RequestParam Integer stock) {
        boolean success = takeoutProductService.batchUpdateProductStock(productIds, stock);
        return R.success(success);
    }

    /**
     * 更新菜品推荐状态
     */
    @PutMapping("/{productId}/recommendation")
    @ApiOperation("更新菜品推荐状态")
    public R<Boolean> updateProductRecommendation(@PathVariable Long productId, @RequestParam Integer isRecommended) {
        boolean success = takeoutProductService.updateProductRecommendation(productId, isRecommended);
        return R.success(success);
    }

}