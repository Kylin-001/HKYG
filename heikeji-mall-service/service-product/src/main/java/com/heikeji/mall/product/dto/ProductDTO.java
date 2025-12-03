package com.heikeji.mall.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 商品DTO类
 */
@Data
public class ProductDTO {
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
    private Integer sales;
    private String detail;
    private Integer status;
    private Integer sortOrder;
    
    // 扩展字段
    private String merchantName;
    private String categoryName;
    private String statusStr;
    
    // 辅助方法
    public String getStatusStr() {
        if (status == null) return "";
        switch (status) {
            case 0: return "下架";
            case 1: return "上架";
            default: return "未知";
        }
    }
}