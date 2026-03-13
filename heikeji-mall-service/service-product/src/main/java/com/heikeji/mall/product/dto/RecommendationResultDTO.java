package com.heikeji.mall.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RecommendationResultDTO {
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String mainImage;
    private Double score;
    private String recommendationType;
}
