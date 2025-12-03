package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.takeout.entity.TakeoutCategory;
import com.heikeji.mall.takeout.mapper.TakeoutCategoryMapper;
import com.heikeji.mall.takeout.service.TakeoutCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 外卖商品分类服务实现类
 */
@Service
public class TakeoutCategoryServiceImpl extends ServiceImpl<TakeoutCategoryMapper, TakeoutCategory> implements TakeoutCategoryService {

    @Autowired
    private TakeoutCategoryMapper takeoutCategoryMapper;

    @Override
    public List<TakeoutCategory> getCategoriesByMerchantId(Long merchantId) {
        return takeoutCategoryMapper.selectByMerchantId(merchantId);
    }

}