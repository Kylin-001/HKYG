package com.heikeji.mall.product.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 商品详情VO类，用于商品详情展示
 */
@Data
public class ProductDetailVO {
    private Long id;
    private Long merchantId;
    private Long categoryId;
    private String name;
    private String subtitle;
    private String mainImage;
    private String images;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stock;
    private Integer lockedStock;
    private Integer sales;
    private String detail;
    private Integer status;
    private Integer isNew;
    private Integer isRecommend;
    private Date createTime;
    private Date updateTime;
}
