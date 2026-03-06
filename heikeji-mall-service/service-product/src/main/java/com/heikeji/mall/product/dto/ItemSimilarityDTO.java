package com.heikeji.mall.product.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ItemSimilarityDTO implements Serializable {
    private Long productId;
    private Long similarProductId;
    private Double similarity;
    private Double avgRating;
    private Integer interactionCount;
}
