package com.heikeji.mall.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 商品批量插入DTO
 * 支持单条和批量商品数据插入，包含完整的字段验证和外键约束检查
 */
@Data
public class ProductBatchInsertDTO {

    /**
     * 商品名称
     */
    @NotBlank(message = "商品名称不能为空")
    @Size(min = 1, max = 200, message = "商品名称长度必须在1-200个字符之间")
    private String name;

    /**
     * 分类ID (外键关联category表)
     */
    @NotNull(message = "分类ID不能为空")
    @Positive(message = "分类ID必须为正数")
    private Long categoryId;

    /**
     * 商家/店铺ID (外键关联store表)
     */
    @NotNull(message = "商家ID不能为空")
    @Positive(message = "商家ID必须为正数")
    private Long storeId;

    /**
     * 商品价格
     */
    @NotNull(message = "商品价格不能为空")
    @DecimalMin(value = "0.01", message = "价格必须大于0")
    @Digits(integer = 8, fraction = 2, message = "价格格式不正确，最多8位整数2位小数")
    private BigDecimal price;

    /**
     * 原价
     */
    @DecimalMin(value = "0.00", message = "原价不能为负数")
    private BigDecimal originalPrice;

    /**
     * 库存数量
     */
    @NotNull(message = "库存数量不能为空")
    @Min(value = 0, message = "库存数量不能为负数")
    @Max(value = 999999, message = "库存数量超出范围")
    private Integer stock = 0;

    /**
     * 销量
     */
    @Min(value = 0, message = "销量不能为负数")
    private Integer salesCount = 0;

    /**
     * 商品图片（JSON数组或逗号分隔）
     */
    @Size(max = 5000, message = "图片信息过长")
    private String images;

    /**
     * 商品描述
     */
    @Size(max = 10000, message = "商品描述过长")
    private String description;

    /**
     * 商品规格（JSON格式）
     */
    @Size(max = 5000, message = "规格信息过长")
    private String specifications;

    /**
     * 商品状态：0-下架，1-上架
     */
    @Min(value = 0, message = "状态值不合法")
    @Max(value = 1, message = "状态值不合法")
    private Integer status = 1;

    /**
     * 是否推荐：0-否，1-是
     */
    @Min(value = 0, message = "推荐标识不合法")
    @Max(value = 1, message = "推荐标识不合法")
    private Integer isFeatured = 0;
}
