package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.mapper.TakeoutProductMapper;
import com.heikeji.mall.takeout.entity.TakeoutProduct;
import com.heikeji.mall.takeout.service.TakeoutProductService;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

/**
 * 外卖商品服务实现类
 */
@Service
public class TakeoutProductServiceImpl extends ServiceImpl<TakeoutProductMapper, TakeoutProduct> implements TakeoutProductService {
    
    @Override
    public List<TakeoutProduct> getProductsByMerchantId(Long merchantId) {
        return baseMapper.selectByMerchantId(merchantId);
    }
    
    @Override
    public List<TakeoutProduct> getProductsByCategoryId(Long categoryId) {
        return baseMapper.selectByCategoryId(categoryId);
    }
    
    @Override
    public List<TakeoutProduct> getRecommendedProducts(Long merchantId, Integer limit) {
        return baseMapper.selectRecommendedProducts(merchantId, limit);
    }
    
    @Override
    public TakeoutProduct getProductById(Long productId) {
        return this.getById(productId);
    }

    @Override
    public boolean createProduct(TakeoutProduct product) {
        Date now = new Date();
        product.setCreateTime(now);
        product.setUpdateTime(now);
        return save(product);
    }

    @Override
    public boolean updateProduct(TakeoutProduct product) {
        product.setUpdateTime(new Date());
        return updateById(product);
    }

    @Override
    public boolean deleteProduct(Long productId) {
        return removeById(productId);
    }

    @Override
    public boolean batchDeleteProducts(List<Long> productIds) {
        return removeByIds(productIds);
    }

    @Override
    public boolean updateProductStatus(Long productId, Integer status) {
        TakeoutProduct product = new TakeoutProduct();
        product.setId(productId);
        product.setStatus(status);
        product.setUpdateTime(new Date());
        return updateById(product);
    }

    @Override
    public boolean updateProductStock(Long productId, Integer stock) {
        TakeoutProduct product = new TakeoutProduct();
        product.setId(productId);
        product.setStock(stock);
        product.setUpdateTime(new Date());
        return updateById(product);
    }

    @Override
    public boolean batchUpdateProductStock(List<Long> productIds, Integer stock) {
        // 批量更新菜品库存
        for (Long productId : productIds) {
            TakeoutProduct product = new TakeoutProduct();
            product.setId(productId);
            product.setStock(stock);
            product.setUpdateTime(new Date());
            updateById(product);
        }
        return true;
    }

    @Override
    public boolean updateProductRecommendation(Long productId, Integer isRecommended) {
        TakeoutProduct product = new TakeoutProduct();
        product.setId(productId);
        product.setIsRecommended(isRecommended);
        product.setUpdateTime(new Date());
        return updateById(product);
    }
}