package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.entity.ProductComment;
import com.heikeji.mall.product.entity.ProductViewHistory;
import com.heikeji.mall.product.entity.UserBehaviorLog;
import com.heikeji.mall.product.dto.UserSimilarityDTO;
import com.heikeji.mall.product.dto.ItemSimilarityDTO;
import com.heikeji.mall.product.dto.RecommendationResultDTO;
import com.heikeji.mall.product.mapper.ProductMapper;
import com.heikeji.mall.product.mapper.ProductCommentMapper;
import com.heikeji.mall.product.mapper.ProductViewHistoryMapper;
import com.heikeji.mall.product.mapper.UserBehaviorLogMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CollaborativeFilteringServiceImpl extends ServiceImpl<CollaborativeFilteringService> implements CollaborativeFilteringService {

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ProductCommentMapper productCommentMapper;

    @Autowired
    private ProductViewHistoryMapper productViewHistoryMapper;

    @Autowired
    private UserBehaviorLogMapper userBehaviorLogMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String USER_SIMILARITY_CACHE_PREFIX = "user_similarity:";
    private static final String ITEM_SIMILARITY_CACHE_PREFIX = "item_similarity:";
    private static final long CACHE_TTL = 3600;
    private static final int SIMILAR_USER_LIMIT = 20;
    private static final int SIMILAR_ITEM_LIMIT = 20;
    private static final int RECOMMENDATION_LIMIT = 10;

    @Override
    public List<UserSimilarityDTO> findSimilarUsers(Long userId, int limit) {
        String cacheKey = USER_SIMILARITY_CACHE_PREFIX + userId;
        List<UserSimilarityDTO> cached = (List<UserSimilarityDTO>) redisTemplate.opsForValue().get(cacheKey);
        if (CollectionUtils.isNotEmpty(cached)) {
            log.info("从缓存获取用户相似度: userId={}", userId);
            return cached.stream().limit(limit).collect(Collectors.toList());
        }

        List<UserBehaviorLog> userBehaviors = userBehaviorLogMapper.selectList(
            new LambdaQueryWrapper<UserBehaviorLog>()
                    .eq(UserBehaviorLog::getUserId, userId)
                    .in(UserBehaviorLog::getBehaviorType, Arrays.asList("browse", "purchase", "favorite", "comment"))
                    .orderByDesc(UserBehaviorLog::getBehaviorTime)
                    .last("LIMIT 100")
        );

        Map<Long, List<Long>> userProductMap = new HashMap<>();
        Map<Long, Integer> userProductCountMap = new HashMap<>();

        for (UserBehaviorLog behavior : userBehaviors) {
            Long productId = behavior.getProductId();
            if (productId != null) {
                userProductMap.computeIfAbsent(productId, k -> new ArrayList<>()).add(behavior.getUserId());
                userProductCountMap.merge(productId, 1, Integer::sum);
            }
        }

        List<UserSimilarityDTO> similarityList = new ArrayList<>();
        Set<Long> processedUsers = new HashSet<>();

        for (Map.Entry<Long, List<Long>> entry : userProductMap.entrySet()) {
            if (processedUsers.contains(entry.getKey())) continue;

            List<Long> otherUserIds = entry.getValue();
            int commonCount = 0;
            List<Long> commonProductIds = new ArrayList<>();

            for (Long otherUserId : otherUserIds) {
                if (otherUserId.equals(userId)) continue;

                List<Long> otherUserProducts = userProductMap.get(otherUserId);
                if (CollectionUtils.isEmpty(otherUserProducts)) continue;

                List<Long> intersection = new ArrayList<>(userProductMap.get(userId));
                intersection.retainAll(otherUserProducts);

                commonCount += intersection.size();
                commonProductIds.addAll(intersection);
            }

            if (commonCount > 0) {
                double jaccardSimilarity = (double) commonCount / (userProductMap.get(userId).size() + otherUserProducts.size() - commonCount);
                double cosineSimilarity = calculateCosineSimilarity(userId, entry.getKey(), userProductMap);

                double combinedSimilarity = 0.7 * jaccardSimilarity + 0.3 * cosineSimilarity;

                UserSimilarityDTO dto = new UserSimilarityDTO();
                dto.setUserId(entry.getKey());
                dto.setSimilarUserId(entry.getKey());
                dto.setSimilarity(combinedSimilarity);
                dto.setCommonProductIds(commonProductIds);
                dto.setCommonCategoryIds(getCommonCategories(userId, entry.getKey(), userProductMap));

                similarityList.add(dto);
                processedUsers.add(entry.getKey());

                if (similarityList.size() >= limit) break;
            }
        }

        similarityList.sort((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity()).reversed());

        redisTemplate.opsForValue().set(cacheKey, similarityList, CACHE_TTL, java.util.concurrent.TimeUnit.SECONDS);

        log.info("计算用户相似度完成: userId={}, 结果数={}", userId, similarityList.size());
        return similarityList.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<ItemSimilarityDTO> findSimilarItems(Long productId, int limit) {
        String cacheKey = ITEM_SIMILARITY_CACHE_PREFIX + productId;
        List<ItemSimilarityDTO> cached = (List<ItemSimilarityDTO>) redisTemplate.opsForValue().get(cacheKey);
        if (CollectionUtils.isNotEmpty(cached)) {
            log.info("从缓存获取商品相似度: productId={}", productId);
            return cached.stream().limit(limit).collect(Collectors.toList());
        }

        Product targetProduct = productMapper.selectById(productId);
        if (targetProduct == null) {
            log.warn("商品不存在: productId={}", productId);
            return new ArrayList<>();
        }

        List<ProductComment> comments = productCommentMapper.selectList(
                new LambdaQueryWrapper<ProductComment>()
                        .eq(ProductComment::getProductId, productId)
                        .orderByDesc(ProductComment::getCreateTime)
                        .last("LIMIT 100")
        );

        Map<Long, Double> userRatings = new HashMap<>();
        Map<Long, Integer> userInteractionCounts = new HashMap<>();

        for (ProductComment comment : comments) {
            Long userId = comment.getUserId();
            if (userId != null) {
                userRatings.merge(userId, comment.getScore(), Double::sum);
                userInteractionCounts.merge(userId, 1, Integer::sum);
            }
        }

        List<ProductViewHistory> viewHistory = productViewHistoryMapper.selectList(
                new LambdaQueryWrapper<ProductViewHistory>()
                        .eq(ProductViewHistory::getProductId, productId)
                        .orderByDesc(ProductViewHistory::getViewTime)
                        .last("LIMIT 1000")
        );

        Map<Long, Integer> viewCounts = new HashMap<>();
        for (ProductViewHistory history : viewHistory) {
            Long userId = history.getUserId();
            if (userId != null) {
                viewCounts.merge(userId, 1, Integer::sum);
            }
        }

        List<Product> allProducts = productMapper.selectList(
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getStatus, 1)
                        .eq(Product::getCategoryId, targetProduct.getCategoryId())
                        .last("LIMIT 100")
        );

        List<ItemSimilarityDTO> similarityList = new ArrayList<>();
        Set<Long> processedProducts = new HashSet<>();

        for (Product product : allProducts) {
            if (product.getId().equals(productId) || processedProducts.contains(product.getId())) continue;

            double ratingSimilarity = calculateRatingSimilarity(targetProduct, product, userRatings);
            double categorySimilarity = targetProduct.getCategoryId().equals(product.getCategoryId()) ? 1.0 : 0.0;
            double priceSimilarity = calculatePriceSimilarity(targetProduct, product);

            double combinedSimilarity = 0.5 * ratingSimilarity + 0.3 * categorySimilarity + 0.2 * priceSimilarity;

            ItemSimilarityDTO dto = new ItemSimilarityDTO();
            dto.setProductId(product.getId());
            dto.setSimilarProductId(product.getId());
            dto.setSimilarity(combinedSimilarity);
            dto.setAvgRating(userRatings.getOrDefault(product.getId(), 0.0));
            dto.setInteractionCount(viewCounts.getOrDefault(product.getId(), 0));

            similarityList.add(dto);
            processedProducts.add(product.getId());

            if (similarityList.size() >= limit) break;
        }

        similarityList.sort((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity()).reversed());

        redisTemplate.opsForValue().set(cacheKey, similarityList, CACHE_TTL, java.util.concurrent.TimeUnit.SECONDS);

        log.info("计算商品相似度完成: productId={}, 结果数={}", productId, similarityList.size());
        return similarityList.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<Product> recommendByUserCF(Long userId, int limit) {
        List<UserSimilarityDTO> similarUsers = findSimilarUsers(userId, SIMILAR_USER_LIMIT);
        if (CollectionUtils.isEmpty(similarUsers)) {
            log.warn("未找到相似用户: userId={}", userId);
            return new ArrayList<>();
        }

        List<Long> recommendedProductIds = new ArrayList<>();
        Set<Long> excludeProductIds = new HashSet<>();

        for (UserSimilarityDTO similarUser : similarUsers) {
            List<Long> commonProductIds = similarUser.getCommonProductIds();
            if (CollectionUtils.isNotEmpty(commonProductIds)) {
                List<Product> commonProducts = productMapper.selectBatchIds(commonProductIds);
                List<Product> filteredProducts = commonProducts.stream()
                        .filter(p -> !excludeProductIds.contains(p.getId()))
                        .sorted((p1, p2) -> Integer.compare(p2.getSales(), p1.getSales()).reversed())
                        .limit(RECOMMENDATION_LIMIT)
                        .collect(Collectors.toList());

                recommendedProductIds.addAll(filteredProducts.stream().map(Product::getId).collect(Collectors.toList()));
                excludeProductIds.addAll(filteredProducts.stream().map(Product::getId).collect(Collectors.toList()));
            }
        }

        if (recommendedProductIds.isEmpty()) {
            log.warn("User-CF未产生推荐: userId={}", userId);
            return new ArrayList<>();
        }

        List<Product> recommendedProducts = productMapper.selectBatchIds(recommendedProductIds);
        log.info("User-CF推荐完成: userId={}, 推荐数={}", userId, recommendedProducts.size());
        return recommendedProducts.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<Product> recommendByItemCF(Long productId, int limit) {
        List<ItemSimilarityDTO> similarItems = findSimilarItems(productId, SIMILAR_ITEM_LIMIT);
        if (CollectionUtils.isEmpty(similarItems)) {
            log.warn("未找到相似商品: productId={}", productId);
            return new ArrayList<>();
        }

        List<Long> recommendedProductIds = similarItems.stream()
                .sorted((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity()).reversed())
                .map(ItemSimilarityDTO::getSimilarProductId)
                .distinct()
                .limit(RECOMMENDATION_LIMIT)
                .collect(Collectors.toList());

        List<Product> recommendedProducts = productMapper.selectBatchIds(recommendedProductIds);
        log.info("Item-CF推荐完成: productId={}, 推荐数={}", productId, recommendedProducts.size());
        return recommendedProducts.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public List<Product> recommendHybrid(Long userId, int limit) {
        List<Product> userCFProducts = recommendByUserCF(userId, limit / 2);
        List<Product> itemCFProducts = new ArrayList<>();

        List<UserBehaviorLog> recentBehaviors = userBehaviorLogMapper.selectList(
                new LambdaQueryWrapper<UserBehaviorLog>()
                        .eq(UserBehaviorLog::getUserId, userId)
                        .in(UserBehaviorLog::getBehaviorType, Arrays.asList("browse", "purchase"))
                        .orderByDesc(UserBehaviorLog::getBehaviorTime)
                        .last("LIMIT 10")
        );

        if (CollectionUtils.isNotEmpty(recentBehaviors)) {
            Long lastViewedProductId = recentBehaviors.get(0).getProductId();
            if (lastViewedProductId != null) {
                List<Product> similarItems = findSimilarItems(lastViewedProductId, limit / 2);
                itemCFProducts.addAll(similarItems.stream().map(ItemSimilarityDTO::getSimilarProductId).collect(Collectors.toList()));
            }
        }

        Set<Long> recommendedIds = new HashSet<>();
        recommendedIds.addAll(userCFProducts.stream().map(Product::getId).collect(Collectors.toList()));
        recommendedIds.addAll(itemCFProducts.stream().map(Product::getId).collect(Collectors.toList()));

        List<Product> hybridProducts = productMapper.selectBatchIds(new ArrayList<>(recommendedIds));
        log.info("混合推荐完成: userId={}, 推荐数={}", userId, hybridProducts.size());
        return hybridProducts.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> calculateUserSimilarity(Long userId) {
        List<UserBehaviorLog> userBehaviors = userBehaviorLogMapper.selectList(
                new LambdaQueryWrapper<UserBehaviorLog>()
                        .eq(UserBehaviorLog::getUserId, userId)
                        .in(UserBehaviorLog::getBehaviorType, Arrays.asList("browse", "purchase", "favorite", "comment"))
                        .orderByDesc(UserBehaviorLog::getBehaviorTime)
                        .last("LIMIT 100")
        );

        Map<Long, List<Long>> userProductMap = new HashMap<>();
        Map<Long, Integer> userProductCountMap = new HashMap<>();

        for (UserBehaviorLog behavior : userBehaviors) {
            Long productId = behavior.getProductId();
            if (productId != null) {
                userProductMap.computeIfAbsent(productId, k -> new ArrayList<>()).add(behavior.getUserId());
                userProductCountMap.merge(productId, 1, Integer::sum);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalProducts", userProductMap.size());
        result.put("totalInteractions", userBehaviors.size());
        result.put("avgProductsPerUser", userBehaviors.size() / (double) userProductMap.size());

        return result;
    }

    @Override
    public Map<String, Object> calculateItemSimilarity(Long productId) {
        Product targetProduct = productMapper.selectById(productId);
        if (targetProduct == null) {
            return new HashMap<>();
        }

        List<ProductComment> comments = productCommentMapper.selectList(
                new LambdaQueryWrapper<ProductComment>()
                        .eq(ProductComment::getProductId, productId)
                        .orderByDesc(ProductComment::getCreateTime)
                        .last("LIMIT 100")
        );

        Map<Long, Double> userRatings = new HashMap<>();
        Map<Long, Integer> userInteractionCounts = new HashMap<>();

        for (ProductComment comment : comments) {
            Long userId = comment.getUserId();
            if (userId != null) {
                userRatings.merge(userId, comment.getScore(), Double::sum);
                userInteractionCounts.merge(userId, 1, Integer::sum);
            }
        }

        List<ProductViewHistory> viewHistory = productViewHistoryMapper.selectList(
                new LambdaQueryWrapper<ProductViewHistory>()
                        .eq(ProductViewHistory::getProductId, productId)
                        .orderByDesc(ProductViewHistory::getViewTime)
                        .last("LIMIT 1000")
        );

        Map<Long, Integer> viewCounts = new HashMap<>();
        for (ProductViewHistory history : viewHistory) {
            Long userId = history.getUserId();
            if (userId != null) {
                viewCounts.merge(userId, 1, Integer::sum);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRatings", userRatings.size());
        result.put("totalViews", viewHistory.size());
        result.put("avgRating", userRatings.values().stream().mapToDouble(Double::doubleValue).collect(Collectors.averagingDouble()));
        result.put("avgViews", viewCounts.values().stream().mapToInt(Integer::intValue).collect(Collectors.averagingInt()));

        return result;
    }

    private double calculateCosineSimilarity(Long userId1, Long userId2, Map<Long, List<Long>> userProductMap) {
        List<Long> products1 = userProductMap.getOrDefault(userId1, new ArrayList<>());
        List<Long> products2 = userProductMap.getOrDefault(userId2, new ArrayList<>());

        if (CollectionUtils.isEmpty(products1) || CollectionUtils.isEmpty(products2)) {
            return 0.0;
        }

        Set<Long> intersection = new HashSet<>(products1);
        intersection.retainAll(products2);

        int commonCount = intersection.size();
        int unionCount = products1.size() + products2.size() - commonCount;

        return (double) commonCount / unionCount;
    }

    private double calculateRatingSimilarity(Product targetProduct, Product product, Map<Long, Double> userRatings) {
        Double targetRating = userRatings.getOrDefault(targetProduct.getId(), 0.0);
        Double productRating = userRatings.getOrDefault(product.getId(), 0.0);

        if (targetRating == null || productRating == null) {
            return 0.0;
        }

        double maxRating = Math.max(targetRating, productRating);
        double minRating = Math.min(targetRating, productRating);

        if (maxRating - minRating == 0) {
            return 0.0;
        }

        double ratingDiff = 1.0 - (Math.abs(targetRating - productRating) / (maxRating - minRating));
        return ratingDiff;
    }

    private double calculatePriceSimilarity(Product targetProduct, Product product) {
        if (targetProduct.getPrice() == null || product.getPrice() == null) {
            return 0.0;
        }

        double targetPrice = targetProduct.getPrice().doubleValue();
        double productPrice = product.getPrice().doubleValue();

        if (targetPrice == 0 || productPrice == 0) {
            return 0.0;
        }

        double priceRatio = Math.min(targetPrice, productPrice) / Math.max(targetPrice, productPrice);
        double priceSimilarity = 1.0 - priceRatio;

        return priceSimilarity;
    }

    private List<Long> getCommonCategories(Long userId, Long similarUserId, Map<Long, List<Long>> userProductMap) {
        List<Long> user1Products = userProductMap.getOrDefault(userId, new ArrayList<>());
        List<Long> user2Products = userProductMap.getOrDefault(similarUserId, new ArrayList<>());

        if (CollectionUtils.isEmpty(user1Products) || CollectionUtils.isEmpty(user2Products)) {
            return new ArrayList<>();
        }

        Set<Long> commonProductIds = new HashSet<>();
        Set<Long> intersection = new HashSet<>(user1Products);
        intersection.retainAll(user2Products);

        List<Long> productIds = productMapper.selectBatchIds(new ArrayList<>(intersection));
        Set<Long> categoryIds = productIds.stream()
                .map(Product::getCategoryId)
                .collect(Collectors.toSet());

        return new ArrayList<>(categoryIds);
    }
}
