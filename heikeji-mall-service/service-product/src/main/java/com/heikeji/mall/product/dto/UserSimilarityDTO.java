package com.heikeji.mall.product.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserSimilarityDTO implements Serializable {
    private Long userId;
    private Long similarUserId;
    private Double similarity;
    private List<Long> commonProductIds;
    private List<Long> commonCategoryIds;
}
