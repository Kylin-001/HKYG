package com.heikeji.mall.secondhand.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.secondhand.entity.SecondhandProduct;

/**
 * 二手商品Mapper接口
 */
public interface SecondhandProductMapper extends BaseMapper<SecondhandProduct> {

    /**
     * 增加商品浏览量
     * @param productId 商品ID
     */
    void increaseViewCount(Long productId);

}