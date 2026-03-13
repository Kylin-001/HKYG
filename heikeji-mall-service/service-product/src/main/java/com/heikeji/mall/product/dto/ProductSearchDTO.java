package com.heikeji.mall.product.dto;

import java.math.BigDecimal;

/**
 * 商品搜索条件DTO
 */
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

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Long merchantId) {
        this.merchantId = merchantId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getHasStock() {
        return hasStock;
    }

    public void setHasStock(Boolean hasStock) {
        this.hasStock = hasStock;
    }

    public Boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(Boolean isNew) {
        this.isNew = isNew;
    }

    public Boolean getIsRecommend() {
        return isRecommend;
    }

    public void setIsRecommend(Boolean isRecommend) {
        this.isRecommend = isRecommend;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
