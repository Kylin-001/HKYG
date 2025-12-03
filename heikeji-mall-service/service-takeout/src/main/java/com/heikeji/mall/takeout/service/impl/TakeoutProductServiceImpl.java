package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.mapper.TakeoutProductMapper;
import com.heikeji.mall.takeout.entity.TakeoutProduct;
import com.heikeji.mall.takeout.service.TakeoutProductService;
import org.springframework.stereotype.Service;
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
}