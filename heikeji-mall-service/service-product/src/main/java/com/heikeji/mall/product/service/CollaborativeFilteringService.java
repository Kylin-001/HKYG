package com.heikeji.mall.product.service;

import com.heikeji.mall.product.dto.UserSimilarityDTO;
import com.heikeji.mall.product.dto.ItemSimilarityDTO;
import com.heikeji.mall.product.dto.RecommendationResultDTO;
import com.heikeji.mall.product.entity.Product;
import java.util.List;
import java.util.Map;

public interface CollaborativeFilteringService {
    
    List<UserSimilarityDTO> findSimilarUsers(Long userId, int limit);
    
    List<ItemSimilarityDTO> findSimilarItems(Long productId, int limit);
    
    List<Product> recommendByUserCF(Long userId, int limit);
    
    List<Product> recommendByItemCF(Long productId, int limit);
    
    List<Product> recommendHybrid(Long userId, int limit);
    
    Map<String, Object> calculateUserSimilarity(Long userId);
    
    Map<String, Object> calculateItemSimilarity(Long productId);
}
