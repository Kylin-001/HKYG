package com.heikeji.mall.product.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.product.dto.ProductSearchDTO;
import com.heikeji.mall.product.entity.Product;
import java.util.List;
import java.util.Map;

/**
 * 商品服务接口
 */
public interface ProductService extends IService<Product> {

    /**
     * 根据商品ID查询商品信息
     * @param productId 商品ID
     * @return 商品信息
     */
    Product getById(Long productId);

    /**
     * 根据商品ID列表查询商品信息
     * @param productIds 商品ID列表
     * @return 商品信息列表
     */
    List<Product> getByIds(List<Long> productIds);

    /**
     * 获取热门推荐商品和新上架商品
     * @param limit 限制数量
     * @return 商品数据映射
     */
    Map<String, Object> getHotProducts(Integer limit);

    /**
     * 扣减商品库存
     * @param productId 商品ID
     * @param quantity 数量
     * @return 是否成功
     */
    Boolean deductStock(Long productId, Integer quantity);

    /**
     * 恢复商品库存
     * @param productId 商品ID
     * @param quantity 数量
     * @return 是否成功
     */
    Boolean restoreStock(Long productId, Integer quantity);

    /**
     * 批量删除商品（逻辑删除）
     * @param ids 商品ID列表
     */
    void batchDeleteByIds(List<Long> ids);

    /**
     * 检查商品库存是否充足
     * @param productId 商品ID
     * @param quantity 数量
     * @return 是否充足
     */
    Boolean checkStock(Long productId, Integer quantity);
    
    /**
     * 锁定商品库存
     * @param productId 商品ID
     * @param quantity 数量
     * @return 是否成功
     */
    Boolean lockStock(Long productId, Integer quantity);
    
    /**
     * 释放锁定的商品库存
     * @param productId 商品ID
     * @param quantity 数量
     * @return 是否成功
     */
    Boolean unlockStock(Long productId, Integer quantity);
    
    /**
     * 分页查询商品列表
     * @param page 分页参数
     * @param product 查询条件
     * @return 分页商品列表
     */
    Page<Product> pageProduct(Page<Product> page, Product product);
    
    /**
     * 根据商家ID查询商品列表
     * @param merchantId 商家ID
     * @return 商品列表
     */
    List<Product> getByMerchantId(Long merchantId);
    
    /**
     * 根据分类ID查询商品列表
     * @param categoryId 分类ID
     * @return 商品列表
     */
    List<Product> getByCategoryId(Long categoryId);
    
    /**
     * 商品上架
     * @param productId 商品ID
     * @return 是否成功
     */
    Boolean putOn(Long productId);
    
    /**
     * 商品下架
     * @param productId 商品ID
     * @return 是否成功
     */
    Boolean putOff(Long productId);
    
    /**
     * 高级搜索商品
     * @param page 分页参数
     * @param searchDTO 搜索条件
     * @return 分页商品列表
     */
    Page<Product> advancedSearch(Page<Product> page, ProductSearchDTO searchDTO);
    
    /**
     * 根据分类和子分类查询商品
     * @param categoryId 分类ID
     * @return 商品列表
     */
    List<Product> getByCategoryAndChildren(Long categoryId);
    
    /**
     * 获取热门商品列表
     * @param limit 限制数量
     * @return 热门商品列表
     */
    List<Product> getHotProductList(Integer limit);
    
    /**
     * 获取新品列表
     * @param limit 限制数量
     * @return 新品列表
     */
    List<Product> getNewProductList(Integer limit);
    
    /**
     * 获取推荐商品列表
     * @param limit 限制数量
     * @return 推荐商品列表
     */
    List<Product> getRecommendProductList(Integer limit);
    
    /**
     * 根据用户ID获取个性化推荐商品列表
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 推荐商品列表
     */
    List<Product> getPersonalizedRecommendProductList(Long userId, Integer limit);
    
    /**
     * 获取商品总数
     * @return 商品总数
     */
    Integer getProductCount();
    
    /**
     * 设置商品库存预警阈值
     * @param productId 商品ID
     * @param alertStock 预警阈值
     * @return 是否成功
     */
    Boolean setAlertStock(Long productId, Integer alertStock);
    
    /**
     * 获取库存预警商品列表
     * @return 库存预警商品列表
     */
    List<Product> getAlertStockProducts();
    
    /**
     * 检查商品是否需要库存预警
     * @param productId 商品ID
     * @return 是否需要预警
     */
    Boolean checkAlertStock(Long productId);
}