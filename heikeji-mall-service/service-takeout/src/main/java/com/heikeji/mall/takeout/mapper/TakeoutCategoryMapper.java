package com.heikeji.mall.takeout.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.takeout.entity.TakeoutCategory;

import java.util.List;

/**
 * 外卖商品分类Mapper接口
 */
public interface TakeoutCategoryMapper extends BaseMapper<TakeoutCategory> {

    /**
     * 根据商家ID查询分类列表
     */
    List<TakeoutCategory> selectByMerchantId(Long merchantId);

}