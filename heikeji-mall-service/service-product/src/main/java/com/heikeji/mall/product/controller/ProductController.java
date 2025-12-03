package com.heikeji.mall.product.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.common.core.annotation.RateLimiter;
import com.heikeji.common.core.domain.R;
import com.heikeji.mall.product.dto.ProductSearchDTO;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.entity.ProductHotWord;
import com.heikeji.mall.product.service.ProductHotWordService;
import com.heikeji.mall.product.service.ProductService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品控制器
 */
@RestController
@RequestMapping("/api/product")
@Api(tags = "商品管理")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductHotWordService productHotWordService;

    /**
     * 分页查询商品列表
     */
    @GetMapping("/page")
    @ApiOperation("分页查询商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<Page<Product>> pageQuery(
            @RequestParam Integer pageNo,
            @RequestParam Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) Integer status) {
        Page<Product> page = new Page<>(pageNo, pageSize);
        Product product = new Product();
        product.setName(keyword);
        product.setCategoryId(categoryId);
        product.setMerchantId(merchantId);
        product.setStatus(status);
        Page<Product> result = productService.pageProduct(page, product);
        return R.success(result);
    }

    /**
     * 查询商品详情
     */
    @GetMapping("/detail/{id}")
    @ApiOperation("查询商品详情")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<Product> getProductDetail(@PathVariable Long id) {
        Product product = productService.getById(id);
        return R.success(product);
    }

    /**
     * 根据分类ID查询商品列表
     */
    @GetMapping("/category/{categoryId}")
    @ApiOperation("根据分类查询商品")
    @RateLimiter(timeWindow = 1, maxCount = 40)
    public R<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getByCategoryId(categoryId);
        return R.success(products);
    }

    /**
     * 获取热门和新上架商品
     */
    @GetMapping("/hot")
    @ApiOperation("获取热门和新商品")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<?> getHotProducts(@RequestParam(defaultValue = "10") Integer limit) {
        return R.success(productService.getHotProducts(limit));
    }

    /**
     * 新增商品
     */
    @PostMapping
    @ApiOperation("新增商品")
    @RateLimiter(timeWindow = 1, maxCount = 10)
    public R<Boolean> addProduct(@RequestBody Product product) {
        product.setDelFlag(0);
        product.setStatus(0);
        boolean result = productService.save(product);
        return R.success(result);
    }

    /**
     * 更新商品信息
     */
    @PutMapping
    @ApiOperation("更新商品信息")
    @RateLimiter(timeWindow = 1, maxCount = 10)
    public R<Boolean> updateProduct(@RequestBody Product product) {
        boolean result = productService.updateById(product);
        return R.success(result);
    }

    /**
     * 商品上架
     */
    @PutMapping("/putOn/{id}")
    @ApiOperation("商品上架")
    @RateLimiter(timeWindow = 1, maxCount = 20)
    public R<Boolean> putOn(@PathVariable Long id) {
        boolean result = productService.putOn(id);
        return R.success(result);
    }
    
    /**
     * 商品下架
     */
    @PutMapping("/putOff/{id}")
    @ApiOperation("商品下架")
    @RateLimiter(timeWindow = 1, maxCount = 20)
    public R<Boolean> putOff(@PathVariable Long id) {
        boolean result = productService.putOff(id);
        return R.success(result);
    }

    /**
     * 删除商品（逻辑删除）
     */
    @DeleteMapping("/{id}")
    @ApiOperation("删除商品")
    @RateLimiter(timeWindow = 1, maxCount = 10)
    public R<Boolean> deleteProduct(@PathVariable Long id) {
        Product product = new Product();
        product.setId(id);
        product.setDelFlag(1);
        boolean result = productService.updateById(product);
        return R.success(result);
    }

    /**
     * 批量删除商品（逻辑删除）
     */
    @DeleteMapping("/batch")
    @ApiOperation("批量删除商品")
    @RateLimiter(timeWindow = 1, maxCount = 5)
    public R<Boolean> deleteBatch(@RequestBody List<Long> ids) {
        for (Long id : ids) {
            Product product = new Product();
            product.setId(id);
            product.setDelFlag(1);
            productService.updateById(product);
        }
        return R.success(true);
    }
    
    /**
     * 高级搜索商品
     */
    @PostMapping("/advancedSearch")
    @ApiOperation("高级搜索商品")
    @RateLimiter(timeWindow = 1, maxCount = 20)
    public R<Page<Product>> advancedSearch(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestBody ProductSearchDTO searchDTO) {
        // 记录搜索词到热词
        if (searchDTO != null && searchDTO.getKeyword() != null) {
            productHotWordService.incrementSearchCount(searchDTO.getKeyword());
        }
        Page<Product> page = new Page<>(pageNo, pageSize);
        Page<Product> result = productService.advancedSearch(page, searchDTO);
        return R.success(result);
    }
    
    /**
     * 获取分类及其子分类下的商品列表
     */
    @GetMapping("/listByCategoryAndChildren/{categoryId}")
    @ApiOperation("获取分类及其子分类下的商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 40)
    public R<List<Product>> listByCategoryAndChildren(@PathVariable Long categoryId) {
        List<Product> productList = productService.getByCategoryAndChildren(categoryId);
        return R.success(productList);
    }
    
    /**
     * 获取热门商品列表
     */
    @GetMapping("/hotList")
    @ApiOperation("获取热门商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<Product>> hotList(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Product> hotProducts = productService.getHotProductList(limit);
        return R.success(hotProducts);
    }
    
    /**
     * 获取新品列表
     */
    @GetMapping("/newList")
    @ApiOperation("获取新品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<Product>> newList(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Product> newProducts = productService.getNewProductList(limit);
        return R.success(newProducts);
    }
    
    /**
     * 获取推荐商品列表
     */
    @GetMapping("/recommendList")
    @ApiOperation("获取推荐商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<Product>> recommendList(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Product> recommendProducts = productService.getRecommendProductList(limit);
        return R.success(recommendProducts);
    }
    
    /**
     * 获取个性化推荐商品列表
     */
    @GetMapping("/personalizedRecommendList")
    @ApiOperation("获取个性化推荐商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<Product>> getPersonalizedRecommendProductList(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) Long userId) {
        List<Product> personalizedRecommendProducts = productService.getPersonalizedRecommendProductList(userId, limit);
        return R.success(personalizedRecommendProducts);
    }

    /**
     * 获取热门搜索词列表
     */
    @GetMapping("/hotWords")
    @ApiOperation("获取热门搜索词列表")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<List<ProductHotWord>> getHotWords(@RequestParam(defaultValue = "10") Integer limit) {
        List<ProductHotWord> hotWords = productHotWordService.getHotWords(limit);
        return R.success(hotWords);
    }

    /**
     * 获取首页展示的热词
     */
    @GetMapping("/homeHotWords")
    @ApiOperation("获取首页展示的热词")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<List<ProductHotWord>> getHomeHotWords(@RequestParam(defaultValue = "10") Integer limit) {
        List<ProductHotWord> hotWords = productHotWordService.getHomeShowHotWords(limit);
        return R.success(hotWords);
    }

    /**
     * 获取搜索建议
     */
    @GetMapping("/searchSuggestions")
    @ApiOperation("获取搜索建议")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<List<String>> getSearchSuggestions(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "5") Integer limit) {
        List<String> suggestions = productHotWordService.getSearchSuggestions(keyword, limit);
        return R.success(suggestions);
    }
}