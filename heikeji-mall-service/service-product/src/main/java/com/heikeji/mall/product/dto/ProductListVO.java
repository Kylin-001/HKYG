package com.heikeji.mall.product.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 商品列表VO类，用于商品列表展示
 */
@Data
public class ProductListVO {
    private Long id;
    private Long merchantId;
    private Long categoryId;
    private String name;
    private String subtitle;
    private String mainImage;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stock;
    private Integer sales;
    private Integer status;
    private Integer isNew;
    private Integer isRecommend;
}
