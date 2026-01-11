package com.heikeji.mall.product.service;

import java.util.List;
import java.util.Map;

/**
 * 商品推荐服务接口
 */
public interface ProductRecommendService {
    
    /**
     * 获取个性化商品推荐
     * 
     * @param userId 用户ID
     * @param limit 限制数量
     * @return 推荐商品列表
     */
    List<Map<String, Object>> getPersonalizedRecommendations(Long userId, int limit);
    
    /**
     * 获取热门商品推荐
     * 
     * @param limit 限制数量
     * @return 热门商品列表
     */
    List<Map<String, Object>> getHotProductRecommendations(int limit);
    
    /**
     * 获取相似商品推荐
     * 
     * @param productId 商品ID
     * @param limit 限制数量
     * @return 相似商品列表
     */
    List<Map<String, Object>> getSimilarProductRecommendations(Long productId, int limit);
    
    /**
     * 获取商品推荐理由
     * 
     * @param userId 用户ID
     * @param productId 商品ID
     * @return 推荐理由
     */
    String getRecommendReason(Long userId, Long productId);
    
    /**
     * 更新推荐模型
     * 
     * @return 是否更新成功
     */
    boolean updateRecommendModel();
    
    /**
     * 获取推荐统计信息
     * 
     * @return 推荐统计信息
     */
    Map<String, Object> getRecommendStatistics();
}
