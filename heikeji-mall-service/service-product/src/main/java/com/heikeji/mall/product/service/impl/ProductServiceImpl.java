package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.product.document.ProductIndex;
import com.heikeji.mall.product.dto.ProductDetailVO;
import com.heikeji.mall.product.dto.ProductListVO;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.mapper.ProductMapper;
import com.heikeji.mall.product.service.ProductService;
import com.heikeji.mall.product.service.ProductViewHistoryService;
import com.heikeji.mall.product.service.ProductElasticsearchService;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 商品服务实现类
 */
@Slf4j
@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Resource
    private ProductViewHistoryService productViewHistoryService;
    
    @Resource
    private ProductElasticsearchService productElasticsearchService;

    @Override
    @Cacheable(value = "productCache", key = "'product_' + #productId", unless = "#result == null", cacheManager = "cacheManager")
    public Product getById(Long productId) {
        log.info("从数据库获取商品信息，商品ID: {}", productId);
        Product product = super.getById(productId);
        if (product == null || (product.getDelFlag() != null && product.getDelFlag() == 1)) {
            throw new BaseException("商品不存在");
        }
        if (product.getStatus() == null || product.getStatus() != 1) {
            throw new BaseException("商品已下架");
        }
        return product;
    }
    
    /**
     * 将Product转换为ProductListVO
     */
    private ProductListVO convertToProductListVO(Product product) {
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
    }
    
    /**
     * 将Product转换为ProductDetailVO
     */
    private ProductDetailVO convertToProductDetailVO(Product product) {
        ProductDetailVO vo = new ProductDetailVO();
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
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true) // 新增商品时清除所有缓存，因为可能影响热门商品等列表
    public boolean save(Product product) {
        boolean result = super.save(product);
        
        if (result) {
            log.info("新增商品成功，商品ID：{}", product.getId());
            // 同步更新Elasticsearch索引
            ProductIndex productIndex = ProductIndex.fromProduct(product);
            productElasticsearchService.save(productIndex);
        }
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", key = "'product_' + #product.id")
    public boolean updateById(Product product) {
        boolean result = super.updateById(product);
        
        if (result) {
            log.info("更新商品成功，商品ID：{}", product.getId());
            // 同步更新Elasticsearch索引
            ProductIndex productIndex = ProductIndex.fromProduct(product);
            productElasticsearchService.save(productIndex);
        }
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", key = "'product_' + #product.id")
    public boolean removeById(Product product) {
        // 逻辑删除商品
        product.setDelFlag(1);
        boolean result = this.updateById(product);
        
        if (result) {
            log.info("删除商品成功，商品ID：{}", product.getId());
            // 同步更新Elasticsearch索引
            ProductIndex productIndex = ProductIndex.fromProduct(product);
            productElasticsearchService.save(productIndex);
        }
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public boolean removeById(Serializable productId) {
        // 逻辑删除商品
        Long id = Long.valueOf(productId.toString());
        Product product = this.getById(id);
        if (product != null) {
            product.setDelFlag(1);
            boolean result = this.updateById(product);
            
            if (result) {
                log.info("删除商品成功，商品ID：{}", id);
                // 同步更新Elasticsearch索引
                ProductIndex productIndex = ProductIndex.fromProduct(product);
                productElasticsearchService.save(productIndex);
            }
            
            return result;
        }
        return false;
    }

    @Override
    @Cacheable(value = "productCache", key = "'product_ids_' + #productIds.toString().replaceAll('\\s', '')", unless = "#result == null or #result.isEmpty()")
    public List<Product> getByIds(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return null;
        }
        
        log.info("批量获取商品信息，商品ID列表: {}", productIds);
        // 查询所有商品
        List<Product> products = this.listByIds(productIds);
        
        // 过滤出有效的商品（未删除且已上架）
        products.removeIf(product -> product == null || (product.getDelFlag() != null && product.getDelFlag() == 1) || (product.getStatus() != null && product.getStatus() != 1));
        
        return products;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean deductStock(Long productId, Integer quantity) {
        // 获取当前商品信息
        Product product = this.getById(productId);
        
        // 检查锁定库存（将锁定库存转换为实际扣除库存时，应该检查锁定库存是否足够）
        if (product.getLockedStock() < quantity) {
            log.error("商品锁定库存不足，商品ID：{}，锁定库存：{}，需要：{}", productId, product.getLockedStock(), quantity);
            throw new BaseException("商品锁定库存不足");
        }
        
        // 获取当前版本号
        Integer currentVersion = product.getVersion() != null ? product.getVersion() : 0;
        
        // 执行库存扣减（使用乐观锁）- 将锁定库存转换为实际扣除库存
        int result = baseMapper.deductStock(productId, quantity, currentVersion);
        
        if (result == 0) {
            // 更新失败，可能是锁定库存不够或并发冲突
            log.error("商品库存扣减失败，可能存在并发冲突或锁定库存不足，商品ID：{}，当前版本：{}", productId, currentVersion);
            throw new BaseException("商品库存扣减失败，请重试");
        }
        
        log.info("扣减商品库存成功，商品ID：{}，扣减数量：{}，当前版本：{}", productId, quantity, currentVersion + 1);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean restoreStock(Long productId, Integer quantity) {
        // 获取当前商品信息
        Product product = this.getById(productId);
        
        // 获取当前版本号
        Integer currentVersion = product.getVersion() != null ? product.getVersion() : 0;
        
        // 执行库存恢复（使用乐观锁）
        int result = baseMapper.restoreStock(productId, quantity, currentVersion);
        
        if (result == 0) {
            // 更新失败，可能是并发冲突
            log.error("商品库存恢复失败，可能存在并发冲突，商品ID：{}，当前版本：{}", productId, currentVersion);
            throw new BaseException("商品库存恢复失败，请重试");
        }
        
        log.info("恢复商品库存成功，商品ID：{}，恢复数量：{}，当前版本：{}", productId, quantity, currentVersion + 1);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean lockStock(Long productId, Integer quantity) {
        // 获取当前商品信息
        Product product = this.getById(productId);
        
        // 检查库存是否充足
        if (product.getStock() < quantity) {
            log.error("商品库存不足，无法锁定库存，商品ID：{}，库存：{}，需要锁定数量：{}", productId, product.getStock(), quantity);
            throw new BaseException("商品库存不足");
        }
        
        // 获取当前版本号
        Integer currentVersion = product.getVersion() != null ? product.getVersion() : 0;
        
        // 执行库存锁定（使用乐观锁）
        int result = baseMapper.lockStock(productId, quantity, currentVersion);
        
        if (result == 0) {
            // 更新失败，可能是库存不够或并发冲突
            log.error("商品库存锁定失败，可能存在并发冲突或库存不足，商品ID：{}，当前版本：{}", productId, currentVersion);
            throw new BaseException("商品库存锁定失败，请重试");
        }
        
        log.info("锁定商品库存成功，商品ID：{}，锁定数量：{}，当前版本：{}", productId, quantity, currentVersion + 1);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean unlockStock(Long productId, Integer quantity) {
        // 获取当前商品信息
        Product product = this.getById(productId);
        
        // 检查锁定库存是否充足
        if (product.getLockedStock() < quantity) {
            log.error("锁定库存不足，无法释放库存，商品ID：{}，锁定库存：{}，需要释放数量：{}", productId, product.getLockedStock(), quantity);
            throw new BaseException("锁定库存不足");
        }
        
        // 获取当前版本号
        Integer currentVersion = product.getVersion() != null ? product.getVersion() : 0;
        
        // 执行库存释放（使用乐观锁）
        int result = baseMapper.unlockStock(productId, quantity, currentVersion);
        
        if (result == 0) {
            // 更新失败，可能是并发冲突
            log.error("商品库存释放失败，可能存在并发冲突，商品ID：{}，当前版本：{}", productId, currentVersion);
            throw new BaseException("商品库存释放失败，请重试");
        }
        
        log.info("释放商品锁定库存成功，商品ID：{}，释放数量：{}，当前版本：{}", productId, quantity, currentVersion + 1);
        return true;
    }



    @Override
    public Boolean checkStock(Long productId, Integer quantity) {
        Product product = this.getById(productId);
        boolean result = product.getStock() >= quantity;
        log.info("检查商品库存，商品ID：{}，需求数量：{}，库存：{}，结果：{}", 
                 productId, quantity, product.getStock(), result);
        return result;
    }

    @Override
    @Cacheable(value = "productCache", key = "'hotProducts:' + #limit", unless = "#result == null")
    public Map<String, Object> getHotProducts(Integer limit) {
        Map<String, Object> result = new HashMap<>();
        
        // 查询条件：未删除、已上架
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0)
               .eq("status", 1);
        
        // 获取热门商品（按销量降序）
        QueryWrapper<Product> hotWrapper = new QueryWrapper<Product>();
        hotWrapper.eq("status", 1)
                 .orderByDesc("sales_count")
                 .last("LIMIT " + limit);
        List<Product> hotProducts = this.list(hotWrapper);
        
        // 获取新上架商品（按创建时间降序）
        QueryWrapper<Product> newWrapper = new QueryWrapper<Product>();
        newWrapper.eq("status", 1)
                 .orderByDesc("created_at")
                 .last("LIMIT " + limit);
        List<Product> newProducts = this.list(newWrapper);
        
        result.put("hotProducts", hotProducts);
        result.put("newProducts", newProducts);
        
        return result;
    }

    @Override
    @Cacheable(value = "productCache", key = "'page_' + #page.getCurrent() + '_' + #page.getSize() + '_' + #product.toString().replaceAll('\\s', '')", unless = "#result == null")
    public Page<Product> pageProduct(Page<Product> page, Product product) {
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        
        if (product != null) {
            if (product.getMerchantId() != null) {
                wrapper.eq("merchant_id", product.getMerchantId());
            }
            if (product.getCategoryId() != null) {
                wrapper.eq("category_id", product.getCategoryId());
            }
            if (product.getStatus() != null) {
                wrapper.eq("status", product.getStatus());
            }
            if (product.getName() != null && !product.getName().isEmpty()) {
                wrapper.like("name", product.getName());
            }
        }
        
        wrapper.orderByDesc("update_time");
        return this.page(page, wrapper);
    }

    @Override
    @Cacheable(value = "productCache", key = "'merchant_' + #merchantId", unless = "#result == null or #result.isEmpty()")
    public List<Product> getByMerchantId(Long merchantId) {
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        wrapper.eq("merchant_id", merchantId)
               .eq("status", 1)
               .orderByDesc("update_time");
        return this.list(wrapper);
    }

    @Override
    @Cacheable(value = "productCache", key = "'category:' + #categoryId", unless = "#result == null or #result.isEmpty()")
    public List<Product> getByCategoryId(Long categoryId) {
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        wrapper.eq("category_id", categoryId)
               .eq("status", 1)
               .orderByDesc("sales_count");
        return this.list(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean putOn(Long productId) {
        Product product = this.getById(productId);
        if (product == null || product.getDelFlag() == 1) {
            throw new BaseException("商品不存在");
        }
        
        product.setStatus(1);
        log.info("商品上架，商品ID：{}", productId);
        return this.updateById(product);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean putOff(Long productId) {
        Product product = this.getById(productId);
        if (product == null || product.getDelFlag() == 1) {
            throw new BaseException("商品不存在");
        }
        
        product.setStatus(0);
        log.info("商品下架，商品ID：{}", productId);
        return this.updateById(product);
    }
    
    @Override
    @Cacheable(value = "productCache", key = "'search_'+#page.current+'_'+#page.size+'_'+#searchDTO.hashCode()")
    public Page<Product> advancedSearch(Page<Product> page, com.heikeji.mall.product.dto.ProductSearchDTO searchDTO) {
        try {
            log.info("使用Elasticsearch进行商品搜索，条件：{}", searchDTO);
            
            // 使用Elasticsearch进行高级搜索
            Page<Product> esPage = productElasticsearchService.advancedSearch(page, searchDTO);
            log.info("Elasticsearch搜索成功，找到 {} 条商品", esPage.getTotal());
            return esPage;
        } catch (Exception e) {
            log.error("Elasticsearch搜索失败，回退到数据库查询，错误信息：{}", e.getMessage(), e);
            // 回退到数据库查询
            return this.getBaseMapper().advancedSearch(page, searchDTO);
        }
    }
    
    @Override
    @Cacheable(value = "productCache", key = "'category_children_'+#categoryId")
    public List<Product> getByCategoryAndChildren(Long categoryId) {
        return this.getBaseMapper().selectByCategoryAndChildren(categoryId);
    }
    
    @Override
    @Cacheable(value = "productCache", key = "'hot_list_'+#limit")
    public List<Product> getHotProductList(Integer limit) {
        return this.getBaseMapper().selectHotProducts(limit);
    }
    
    @Override
    @Cacheable(value = "productCache", key = "'new_list_'+#limit")
    public List<Product> getNewProductList(Integer limit) {
        return this.getBaseMapper().selectNewProducts(limit);
    }
    
    @Override
    @Cacheable(value = "productCache", key = "'recommend_list_'+#limit")
    public List<Product> getRecommendProductList(Integer limit) {
        return this.getBaseMapper().selectRecommendProducts(limit);
    }
    
    @Override
    public List<Product> getPersonalizedRecommendProductList(Long userId, Integer limit) {
        if (userId == null || limit <= 0) {
            // 如果没有用户ID或参数无效，返回通用推荐
            return getRecommendProductList(limit);
        }
        
        try {
            // 1. 获取用户最近浏览的商品ID列表
            List<Long> recentViewedProductIds = productViewHistoryService.getRecentViewedProductIds(userId, 20);
            
            // 2. 获取用户浏览最多的商品分类ID列表
            List<Long> viewedCategoryIds = productViewHistoryService.getMostViewedCategoryIds(userId, 10);
            
            // 3. 获取用户购买过的商品分类
            List<Long> purchasedCategoryIds = this.getBaseMapper().selectUserPurchasedCategoryIds(userId, 10);
            
            // 4. 获取用户购买过的商品ID列表（用于排除推荐已购买的商品）
            List<Long> purchasedProductIds = this.getBaseMapper().selectUserPurchasedProductIds(userId, 50);
            
            // 5. 合并浏览和购买的分类，优先显示浏览的分类
            List<Long> allCategoryIds = new ArrayList<>();
            if (viewedCategoryIds != null && !viewedCategoryIds.isEmpty()) {
                allCategoryIds.addAll(viewedCategoryIds);
            }
            if (purchasedCategoryIds != null && !purchasedCategoryIds.isEmpty()) {
                for (Long cid : purchasedCategoryIds) {
                    if (!allCategoryIds.contains(cid)) {
                        allCategoryIds.add(cid);
                    }
                }
            }
            
            // 6. 合并已浏览和已购买的商品ID，用于排除
            List<Long> excludedProductIds = new ArrayList<>();
            if (recentViewedProductIds != null) {
                excludedProductIds.addAll(recentViewedProductIds);
            }
            if (purchasedProductIds != null) {
                for (Long pid : purchasedProductIds) {
                    if (!excludedProductIds.contains(pid)) {
                        excludedProductIds.add(pid);
                    }
                }
            }
            
            // 7. 获取个性化推荐商品
            List<Product> personalizedProducts = this.getBaseMapper().selectPersonalizedRecommendProducts(
                    userId,
                    recentViewedProductIds,
                    allCategoryIds.isEmpty() ? null : allCategoryIds,
                    excludedProductIds.isEmpty() ? null : excludedProductIds,
                    limit
            );
            
            // 如果个性化推荐不足，补充通用推荐
            if (personalizedProducts == null || personalizedProducts.size() < limit) {
                List<Product> defaultProducts = getRecommendProductList(limit * 2);
                if (defaultProducts != null && !defaultProducts.isEmpty()) {
                    Set<Long> selectedIds = new HashSet<>();
                    if (personalizedProducts != null) {
                        personalizedProducts.forEach(p -> selectedIds.add(p.getId()));
                    }
                    
                    List<Product> combinedProducts = new ArrayList<>();
                    if (personalizedProducts != null) {
                        combinedProducts.addAll(personalizedProducts);
                    }
                    
                    for (Product product : defaultProducts) {
                        if (!selectedIds.contains(product.getId()) && combinedProducts.size() < limit) {
                            combinedProducts.add(product);
                            selectedIds.add(product.getId());
                        }
                    }
                    
                    return combinedProducts;
                }
            }
            
            return personalizedProducts != null ? personalizedProducts : Collections.emptyList();
            
        } catch (Exception e) {
            log.error("获取个性化推荐商品失败, userId={}", userId, e);
            // 发生异常时返回通用推荐
            return getRecommendProductList(limit);
        }
    }
    
    @Override
    public Integer getProductCount() {
        // 查询未删除的商品总数
        return Math.toIntExact(count(new LambdaQueryWrapper<Product>().eq(Product::getDelFlag, 0)));
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public Boolean setAlertStock(Long productId, Integer alertStock) {
        Product product = this.getById(productId);
        if (product == null || product.getDelFlag() == 1) {
            throw new RuntimeException("商品不存在");
        }
        
        product.setAlertStock(alertStock);
        boolean result = this.updateById(product);
        log.info("设置商品库存预警阈值，商品ID：{}，预警阈值：{}", productId, alertStock);
        return result;
    }
    
    @Override
    public List<Product> getAlertStockProducts() {
        // 查询库存不足的商品（库存 <= 预警阈值且状态为已上架）
        return this.list(new LambdaQueryWrapper<Product>()
                .eq(Product::getDelFlag, 0)
                .eq(Product::getStatus, 1)
                .ge(Product::getAlertStock, 0)
                .apply("stock <= alert_stock")
                .orderByAsc(Product::getStock));
    }
    
    @Override
    public Boolean checkAlertStock(Long productId) {
        Product product = this.getById(productId);
        if (product == null || product.getDelFlag() == 1) {
            throw new RuntimeException("商品不存在");
        }
        
        // 检查库存是否低于预警阈值
        boolean needAlert = product.getAlertStock() != null 
                && product.getAlertStock() > 0 
                && product.getStock() <= product.getAlertStock();
        log.info("检查商品库存预警，商品ID：{}，库存：{}，预警阈值：{}，需要预警：{}", 
                productId, product.getStock(), product.getAlertStock(), needAlert);
        return needAlert;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = "productCache", allEntries = true)
    public void batchDeleteByIds(List<Long> ids) {
        Product product = new Product();
        product.setDelFlag(1);
        product.setUpdateTime(new Date());
        this.update(product, new QueryWrapper<Product>().in("id", ids));
        log.info("批量删除商品成功，商品ID列表：{}，共删除{}条记录", ids, ids.size());
    }
}