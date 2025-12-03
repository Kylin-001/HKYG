package com.heikeji.mall.api.controller.takeout;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutProduct;
import com.heikeji.mall.takeout.service.TakeoutProductService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 外卖商品Controller
 */
@RestController
@RequestMapping("/api/takeout/product")
@Api(tags = "外卖商品接口")
public class TakeoutProductController {
    
    @Autowired
    private TakeoutProductService takeoutProductService;
    
    @ApiOperation("根据商家ID获取商品列表")
    @GetMapping("/merchant/{merchantId}")
    public R<List<TakeoutProduct>> getProductsByMerchant(@PathVariable Long merchantId) {
        List<TakeoutProduct> products = takeoutProductService.getProductsByMerchantId(merchantId);
        return R.success(products);
    }
    
    @ApiOperation("根据分类ID获取商品列表")
    @GetMapping("/category/{categoryId}")
    public R<List<TakeoutProduct>> getProductsByCategory(@PathVariable Long categoryId) {
        List<TakeoutProduct> products = takeoutProductService.getProductsByCategoryId(categoryId);
        return R.success(products);
    }
    
    @ApiOperation("获取商家推荐商品")
    @GetMapping("/recommended/{merchantId}")
    public R<List<TakeoutProduct>> getRecommendedProducts(
            @PathVariable Long merchantId,
            @RequestParam(defaultValue = "5") Integer limit) {
        List<TakeoutProduct> products = takeoutProductService.getRecommendedProducts(merchantId, limit);
        return R.success(products);
    }
    
    @ApiOperation("获取商品详情")
    @GetMapping("/detail/{productId}")
    public R<TakeoutProduct> getProductDetail(@PathVariable Long productId) {
        TakeoutProduct product = takeoutProductService.getProductById(productId);
        return R.success(product);
    }
}