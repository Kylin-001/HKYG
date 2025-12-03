package com.heikeji.mall.product.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 商品搜索条件DTO
 */
@Data
public class ProductSearchDTO {
    
    /**
     * 关键字（商品名称、副标题）
     */
    private String keyword;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 商家ID
     */
    private Long merchantId;
    
    /**
     * 商品状态
     */
    private Integer status;
    
    /**
     * 最低价格
     */
    private BigDecimal minPrice;
    
    /**
     * 最高价格
     */
    private BigDecimal maxPrice;
    
    /**
     * 排序字段（price/sales/update_time）
     */
    private String sortBy;
    
    /**
     * 排序方向（asc/desc）
     */
    private String sortOrder;
    
    /**
     * 是否仅查询有库存商品
     */
    private Boolean hasStock;
    
    /**
     * 是否新品
     */
    private Boolean isNew;
    
    /**
     * 是否推荐
     */
    private Boolean isRecommend;
    
    /**
     * 当前页码
     */
    private Integer pageNum;
    
    /**
     * 每页大小
     */
    private Integer pageSize;
}