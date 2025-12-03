package com.heikeji.product.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 产品分页查询DTO
 */
@Data
public class ProductPageDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 页码
     */
    private Integer page;

    /**
     * 每页数量
     */
    private Integer limit;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 搜索关键词
     */
    private String keyword;

    /**
     * 排序字段
     */
    private String sortBy;

    /**
     * 产品状态(0:下架, 1:上架)
     */
    private Integer status;
}
