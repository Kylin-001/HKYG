package com.heikeji.mall.product.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.common.core.annotation.RateLimiter;
import com.heikeji.common.core.domain.R;
import com.heikeji.mall.product.dto.ProductDetailVO;
import com.heikeji.mall.product.dto.ProductListVO;
import com.heikeji.mall.product.dto.ProductSearchDTO;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.entity.ProductHotWord;
import com.heikeji.mall.product.service.ProductHotWordService;
import com.heikeji.mall.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 商品控制器
 */
@RestController
@RequestMapping("/api/product")
@Tag(name = "商品管理")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductHotWordService productHotWordService;

    /**
     * 分页查询商品列表
     */
    @GetMapping("/page")
    @Operation(summary = "分页查询商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<Page<ProductListVO>> pageQuery(
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
        
        // 转换为ProductListVO列表
        Page<ProductListVO> voPage = new Page<>();
        voPage.setCurrent(result.getCurrent());
        voPage.setSize(result.getSize());
        voPage.setTotal(result.getTotal());
        voPage.setPages(result.getPages());
        
        List<ProductListVO> voList = result.getRecords().stream().map(item -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(item.getId());
            vo.setMerchantId(item.getMerchantId());
            vo.setCategoryId(item.getCategoryId());
            vo.setName(item.getName());
            vo.setSubtitle(item.getSubtitle());
            vo.setMainImage(item.getMainImage());
            vo.setPrice(item.getPrice());
            vo.setOriginalPrice(item.getOriginalPrice());
            vo.setStock(item.getStock());
            vo.setSales(item.getSales());
            vo.setStatus(item.getStatus());
            vo.setIsNew(item.getIsNew());
            vo.setIsRecommend(item.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        
        voPage.setRecords(voList);
        return R.success(voPage);
    }

    /**
     * 查询商品详情
     */
    @GetMapping("/detail/{id}")
    @Operation(summary = "查询商品详情")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<ProductDetailVO> getProductDetail(@PathVariable Long id) {
        Product product = productService.getById(id);
        ProductDetailVO vo = new ProductDetailVO();
        // 手动转换
        vo.setId(product.getId());
        vo.setMerchantId(product.getMerchantId());
        vo.setCategoryId(product.getCategoryId());
        vo.setName(product.getName());
        vo.setSubtitle(product.getSubtitle());
        vo.setMainImage(product.getMainImage());
        vo.setImages(product.getImages());
        vo.setPrice(product.getPrice());
        vo.setOriginalPrice(product.getOriginalPrice());
        vo.setStock(product.getStock());
        vo.setLockedStock(product.getLockedStock());
        vo.setSales(product.getSales());
        vo.setDetail(product.getDetail());
        vo.setStatus(product.getStatus());
        vo.setIsNew(product.getIsNew());
        vo.setIsRecommend(product.getIsRecommend());
        vo.setCreateTime(product.getCreateTime());
        vo.setUpdateTime(product.getUpdateTime());
        return R.success(vo);
    }

    /**
     * 根据分类ID查询商品列表
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "根据分类查询商品")
    @RateLimiter(timeWindow = 1, maxCount = 40)
    public R<List<ProductListVO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getByCategoryId(categoryId);
        // 转换为ProductListVO列表
        List<ProductListVO> voList = products.stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        return R.success(voList);
    }

    /**
     * 获取热门和新上架商品
     */
    @GetMapping("/hot")
    @Operation(summary = "获取热门和新商品")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<?> getHotProducts(@RequestParam(defaultValue = "10") Integer limit) {
        return R.success(productService.getHotProducts(limit));
    }

    /**
     * 新增商品
     */
    @PostMapping
    @Operation(summary = "新增商品")
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
    @Operation(summary = "更新商品信息")
    @RateLimiter(timeWindow = 1, maxCount = 10)
    public R<Boolean> updateProduct(@RequestBody Product product) {
        boolean result = productService.updateById(product);
        return R.success(result);
    }

    /**
     * 商品上架
     */
    @PutMapping("/putOn/{id}")
    @Operation(summary = "商品上架")
    @RateLimiter(timeWindow = 1, maxCount = 20)
    public R<Boolean> putOn(@PathVariable Long id) {
        boolean result = productService.putOn(id);
        return R.success(result);
    }
    
    /**
     * 商品下架
     */
    @PutMapping("/putOff/{id}")
    @Operation(summary = "商品下架")
    @RateLimiter(timeWindow = 1, maxCount = 20)
    public R<Boolean> putOff(@PathVariable Long id) {
        boolean result = productService.putOff(id);
        return R.success(result);
    }

    /**
     * 删除商品（逻辑删除）
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除商品")
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
    @Operation(summary = "批量删除商品")
    @RateLimiter(timeWindow = 1, maxCount = 5)
    public R<Boolean> deleteBatch(@RequestBody List<Long> ids) {
        productService.batchDeleteByIds(ids);
        return R.success(true);
    }
    
    /**
     * 高级搜索商品
     */
    @PostMapping("/advancedSearch")
    @Operation(summary = "高级搜索商品")
    @RateLimiter(timeWindow = 1, maxCount = 20)
    public R<Page<ProductListVO>> advancedSearch(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestBody ProductSearchDTO searchDTO) {
        // 记录搜索词到热词
        if (searchDTO != null && searchDTO.getKeyword() != null) {
            productHotWordService.incrementSearchCount(searchDTO.getKeyword());
        }
        Page<Product> page = new Page<>(pageNo, pageSize);
        Page<Product> result = productService.advancedSearch(page, searchDTO);
        
        // 转换为ProductListVO
        Page<ProductListVO> voPage = new Page<>();
        voPage.setCurrent(result.getCurrent());
        voPage.setSize(result.getSize());
        voPage.setTotal(result.getTotal());
        voPage.setPages(result.getPages());
        
        List<ProductListVO> voList = result.getRecords().stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        
        voPage.setRecords(voList);
        return R.success(voPage);
    }
    
    /**
     * 获取分类及其子分类下的商品列表
     */
    @GetMapping("/listByCategoryAndChildren/{categoryId}")
    @Operation(summary = "获取分类及其子分类下的商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 40)
    public R<List<ProductListVO>> listByCategoryAndChildren(@PathVariable Long categoryId) {
        List<Product> productList = productService.getByCategoryAndChildren(categoryId);
        // 转换为ProductListVO列表
        List<ProductListVO> voList = productList.stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        return R.success(voList);
    }
    
    /**
     * 获取热门商品列表
     */
    @GetMapping("/hotList")
    @Operation(summary = "获取热门商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<ProductListVO>> hotList(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Product> hotProducts = productService.getHotProductList(limit);
        // 转换为ProductListVO列表
        List<ProductListVO> voList = hotProducts.stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        return R.success(voList);
    }
    
    /**
     * 获取新品列表
     */
    @GetMapping("/newList")
    @Operation(summary = "获取新品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<ProductListVO>> newList(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Product> newProducts = productService.getNewProductList(limit);
        // 转换为ProductListVO列表
        List<ProductListVO> voList = newProducts.stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        return R.success(voList);
    }
    
    /**
     * 获取推荐商品列表
     */
    @GetMapping("/recommendList")
    @Operation(summary = "获取推荐商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<ProductListVO>> recommendList(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<Product> recommendProducts = productService.getRecommendProductList(limit);
        // 转换为ProductListVO列表
        List<ProductListVO> voList = recommendProducts.stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        return R.success(voList);
    }
    
    /**
     * 获取个性化推荐商品列表
     */
    @GetMapping("/personalizedRecommendList")
    @Operation(summary = "获取个性化推荐商品列表")
    @RateLimiter(timeWindow = 1, maxCount = 30)
    public R<List<ProductListVO>> getPersonalizedRecommendProductList(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) Long userId) {
        List<Product> personalizedRecommendProducts = productService.getPersonalizedRecommendProductList(userId, limit);
        // 转换为ProductListVO列表
        List<ProductListVO> voList = personalizedRecommendProducts.stream().map(product -> {
            ProductListVO vo = new ProductListVO();
            vo.setId(product.getId());
            vo.setMerchantId(product.getMerchantId());
            vo.setCategoryId(product.getCategoryId());
            vo.setName(product.getName());
            vo.setSubtitle(product.getSubtitle());
            vo.setMainImage(product.getMainImage());
            vo.setPrice(product.getPrice());
            vo.setOriginalPrice(product.getOriginalPrice());
            vo.setStock(product.getStock());
            vo.setSales(product.getSales());
            vo.setStatus(product.getStatus());
            vo.setIsNew(product.getIsNew());
            vo.setIsRecommend(product.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
        return R.success(voList);
    }

    /**
     * 获取热门搜索词列表
     */
    @GetMapping("/hotWords")
    @Operation(summary = "获取热门搜索词列表")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<List<ProductHotWord>> getHotWords(@RequestParam(defaultValue = "10") Integer limit) {
        List<ProductHotWord> hotWords = productHotWordService.getHotWords(limit);
        return R.success(hotWords);
    }

    /**
     * 获取首页展示的热词
     */
    @GetMapping("/homeHotWords")
    @Operation(summary = "获取首页展示的热词")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<List<ProductHotWord>> getHomeHotWords(@RequestParam(defaultValue = "10") Integer limit) {
        List<ProductHotWord> hotWords = productHotWordService.getHomeShowHotWords(limit);
        return R.success(hotWords);
    }

    /**
     * 获取搜索建议
     */
    @GetMapping("/searchSuggestions")
    @Operation(summary = "获取搜索建议")
    @RateLimiter(timeWindow = 1, maxCount = 50)
    public R<List<String>> getSearchSuggestions(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "5") Integer limit) {
        List<String> suggestions = productHotWordService.getSearchSuggestions(keyword, limit);
        return R.success(suggestions);
    }
    
    /**
     * 获取商品总数
     */
    @GetMapping("/count")
    @Operation(summary = "获取商品总数")
    public R<Integer> getProductCount() {
        Integer count = productService.getProductCount();
        return R.success(count);
    }
}