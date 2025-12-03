package com.heikeji.mall.takeout.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 外卖订单商品DTO
 */
@Data
public class TakeoutOrderItemDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品单价
     */
    private Double price;

    /**
     * 商品数量
     */
    private Integer quantity;

    /**
     * 商品总价
     */
    private Double totalPrice;

    /**
     * 商品规格（可选）
     */
    private String specifications;

    /**
     * 商品备注（可选）
     */
    private String remark;
}