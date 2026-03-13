package com.heikeji.mall.secondhand.util;

import com.heikeji.mall.secondhand.entity.SecondhandProduct;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class ProductRecommender {

    private final Map<Long, List<Long>> userBrowsingHistory = new HashMap<>();
    private final Map<Long, List<Long>> productSimilarityMap = new HashMap<>();

    public List<SecondhandProduct> recommendByBrowsingHistory(Long userId, List<SecondhandProduct> allProducts, int limit) {
        List<Long> history = userBrowsingHistory.getOrDefault(userId, new ArrayList<>());
        if (history.isEmpty()) {
            return getHotProducts(allProducts, limit);
        }

        Set<Long> recommendations = new HashSet<>();
        history.forEach(productId -> {
            List<Long> similarProducts = productSimilarityMap.getOrDefault(productId, new ArrayList<>());
            similarProducts.forEach(recommendations::add);
        });

        history.forEach(recommendations::remove);

        return allProducts.stream()
                .filter(p -> recommendations.contains(p.getId()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<SecondhandProduct> recommendByCollaborativeFiltering(Long userId, List<SecondhandProduct> allProducts, int limit) {
        return getHotProducts(allProducts, limit);
    }

    public List<SecondhandProduct> getHotProducts(List<SecondhandProduct> allProducts, int limit) {
        return allProducts.stream()
                .sorted((p1, p2) -> {
                    int score1 = p1.getViewCount() != null ? p1.getViewCount() : 0;
                    int score2 = p2.getViewCount() != null ? p2.getViewCount() : 0;
                    return Integer.compare(score2, score1);
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<SecondhandProduct> getSimilarProducts(SecondhandProduct product, List<SecondhandProduct> allProducts, int limit) {
        return allProducts.stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .sorted((p1, p2) -> {
                    double sim1 = calculateProductSimilarity(product, p1);
                    double sim2 = calculateProductSimilarity(product, p2);
                    return Double.compare(sim2, sim1);
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    public double calculateProductSimilarity(SecondhandProduct product1, SecondhandProduct product2) {
        double similarity = 0.0;

        if (product1.getCategoryId() != null && product1.getCategoryId().equals(product2.getCategoryId())) {
            similarity += 0.5;
        }

        if (product1.getPrice() != null && product2.getPrice() != null) {
            BigDecimal priceDiff = product1.getPrice().subtract(product2.getPrice()).abs();
            BigDecimal maxPrice = product1.getPrice().max(product2.getPrice());
            if (maxPrice.compareTo(BigDecimal.ZERO) > 0) {
                similarity += (1 - priceDiff.divide(maxPrice, 4, RoundingMode.HALF_UP).doubleValue()) * 0.3;
            }
        }

        String tags1 = product1.getTags() != null ? product1.getTags() : "";
        String tags2 = product2.getTags() != null ? product2.getTags() : "";
        if (!tags1.isEmpty() && !tags2.isEmpty()) {
            Set<String> tagSet1 = new HashSet<>(Arrays.asList(tags1.split(",")));
            Set<String> tagSet2 = new HashSet<>(Arrays.asList(tags2.split(",")));
            Set<String> commonTags = new HashSet<>(tagSet1);
            commonTags.retainAll(tagSet2);
            Set<String> allTags = new HashSet<>(tagSet1);
            allTags.addAll(tagSet2);
            if (!allTags.isEmpty()) {
                similarity += ((double) commonTags.size() / allTags.size()) * 0.2;
            }
        }

        return similarity;
    }

    public void addBrowsingHistory(Long userId, Long productId) {
        userBrowsingHistory.computeIfAbsent(userId, k -> new ArrayList<>()).add(productId);
    }

    public void updateProductSimilarity(Long productId, List<Long> similarProductIds) {
        productSimilarityMap.put(productId, similarProductIds);
    }
}
