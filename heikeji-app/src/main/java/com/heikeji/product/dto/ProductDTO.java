package com.heikeji.product.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 产品DTO
 */
@Data
public class ProductDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 产品ID
     */
    private Long id;

    /**
     * 产品名称
     */
    private String name;

    /**
     * 产品描述
     */
    private String description;

    /**
     * 产品价格
     */
    private BigDecimal price;

    /**
     * 产品库存
     */
    private Integer stock;

    /**
     * 产品分类ID
     */
    private Long categoryId;

    /**
     * 产品图片
     */
    private String image;

    /**
     * 产品详情
     */
    private String detail;

    /**
     * 产品状态(0:下架, 1:上架)
     */
    private Integer status;

    /**
     * 产品销量
     */
    private Integer sales;

    /**
     * 产品评分
     */
    private BigDecimal rating;

    /**
     * 产品规格列表
     */
    private List<ProductSkuDTO> skus;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 产品SKU DTO
     */
    @Data
    public static class ProductSkuDTO implements Serializable {
        private static final long serialVersionUID = 1L;

        /**
         * SKU ID
         */
        private String id;

        /**
         * SKU属性
         */
        private String attrs;

        /**
         * SKU价格
         */
        private BigDecimal price;

        /**
         * SKU库存
         */
        private Integer stock;
    }
}
