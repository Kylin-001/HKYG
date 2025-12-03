package com.heikeji.mall.product.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.product.entity.ProductViewHistory;

import java.util.List;

/**
 * 用户浏览历史服务接口
 * @author heikeji
 * @date 2024-04-21
 */
public interface ProductViewHistoryService extends IService<ProductViewHistory> {

    /**
     * 记录用户浏览商品
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 是否成功
     */
    boolean recordView(Long userId, Long productId);

    /**
     * 获取用户最近浏览的商品ID列表
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 商品ID列表
     */
    List<Long> getRecentViewedProductIds(Long userId, Integer limit);

    /**
     * 获取用户浏览最多的商品分类ID列表
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 分类ID列表
     */
    List<Long> getMostViewedCategoryIds(Long userId, Integer limit);

    /**
     * 删除用户对某个商品的浏览记录
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 是否成功
     */
    boolean deleteViewHistory(Long userId, Long productId);

    /**
     * 清空用户所有浏览记录
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean clearAllViewHistory(Long userId);
}