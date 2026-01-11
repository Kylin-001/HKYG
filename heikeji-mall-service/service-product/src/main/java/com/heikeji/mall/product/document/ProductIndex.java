package com.heikeji.mall.product.document;

import com.heikeji.mall.product.entity.Product;
import lombok.Data;
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
@Data
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

    @Field(type = FieldType.Keyword) // 改为Keyword避免精度丢失
    private BigDecimal price;

    @Field(type = FieldType.Keyword) // 改为Keyword避免精度丢失
    private BigDecimal originalPrice;

    @Field(type = FieldType.Integer, index = true) // 添加索引，方便按库存过滤
    private Integer stock;

    @Field(type = FieldType.Integer, index = false) // 锁定库存不需要搜索，不建索引
    private Integer lockedStock;

    @Field(type = FieldType.Integer, index = true) // 添加索引，方便按销量排序和搜索
    private Integer sales;

    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String detail;

    @Field(type = FieldType.Integer, index = true) // 添加索引，方便按状态过滤
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
    
    /**
     * 是否新品
     */
    @Field(type = FieldType.Integer, index = true)
    private Integer isNew;
    
    /**
     * 是否推荐
     */
    @Field(type = FieldType.Integer, index = true)
    private Integer isRecommend;

    // Convert from Product entity to ProductIndex
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