package com.heikeji.mall.product.document;

import com.heikeji.mall.product.entity.Product;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.Date;

/**
 * Product Index Entity Class
 * Used for Elasticsearch document mapping
 */
@Document(indexName = "product_index")
public class ProductIndex {

    @Id
    @Field(type = FieldType.Long)
    private Long id;

    @Field(type = FieldType.Long)
    private Long merchantId;

    @Field(type = FieldType.Long)
    private Long categoryId;

    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String name;

    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String subtitle;

    @Field(type = FieldType.Keyword, index = false)
    private String mainImage;

    @Field(type = FieldType.Keyword, index = false)
    private String images;

    @Field(type = FieldType.Keyword)
    private BigDecimal price;

    @Field(type = FieldType.Keyword)
    private BigDecimal originalPrice;

    @Field(type = FieldType.Integer, index = true)
    private Integer stock;

    @Field(type = FieldType.Integer, index = false)
    private Integer lockedStock;

    @Field(type = FieldType.Integer, index = true)
    private Integer sales;

    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String detail;

    @Field(type = FieldType.Integer, index = true)
    private Integer status;

    @Field(type = FieldType.Integer)
    private Integer sortOrder;

    @Field(type = FieldType.Date, format = {}, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @Field(type = FieldType.Date, format = {}, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    @Field(type = FieldType.Integer)
    private Integer delFlag;

    @Field(type = FieldType.Integer)
    private Integer version;
    
    @Field(type = FieldType.Integer, index = true)
    private Integer isNew;
    
    @Field(type = FieldType.Integer, index = true)
    private Integer isRecommend;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Long merchantId) {
        this.merchantId = merchantId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getLockedStock() {
        return lockedStock;
    }

    public void setLockedStock(Integer lockedStock) {
        this.lockedStock = lockedStock;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Integer delFlag) {
        this.delFlag = delFlag;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Integer getIsNew() {
        return isNew;
    }

    public void setIsNew(Integer isNew) {
        this.isNew = isNew;
    }

    public Integer getIsRecommend() {
        return isRecommend;
    }

    public void setIsRecommend(Integer isRecommend) {
        this.isRecommend = isRecommend;
    }

    public static ProductIndex fromProduct(Product product) {
        ProductIndex index = new ProductIndex();
        index.setId(product.getId());
        index.setMerchantId(product.getMerchantId());
        index.setCategoryId(product.getCategoryId());
        index.setName(product.getName());
        index.setSubtitle(product.getSubtitle());
        index.setMainImage(product.getMainImage());
        index.setImages(product.getImages());
        index.setPrice(product.getPrice());
        index.setOriginalPrice(product.getOriginalPrice());
        index.setStock(product.getStock());
        index.setLockedStock(product.getLockedStock());
        index.setSales(product.getSales());
        index.setDetail(product.getDetail());
        index.setStatus(product.getStatus());
        index.setSortOrder(product.getSortOrder());
        index.setCreateTime(product.getCreateTime());
        index.setUpdateTime(product.getUpdateTime());
        index.setDelFlag(product.getDelFlag());
        index.setVersion(product.getVersion());
        index.setIsNew(product.getIsNew());
        index.setIsRecommend(product.getIsRecommend());
        return index;
    }
}
