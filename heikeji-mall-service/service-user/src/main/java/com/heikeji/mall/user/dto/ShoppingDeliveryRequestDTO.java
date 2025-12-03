package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * 购物配送请求DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "购物配送请求DTO")
public class ShoppingDeliveryRequestDTO {

    @Schema(description = "配送员ID")
    private Long deliveryPersonId;

    @Schema(description = "配送地址ID")
    @NotNull(message = "配送地址不能为空")
    private Long addressId;

    @Schema(description = "配送类型 1:立即配送 2:预约配送")
    @NotNull(message = "配送类型不能为空")
    private Integer deliveryType;

    @Schema(description = "预约配送时间")
    private String reserveTime;

    @Schema(description = "配送商品列表")
    @NotNull(message = "配送商品列表不能为空")
    private List<ShoppingItemDTO> items;

    @Schema(description = "备注信息")
    private String remark;

    @Schema(description = "支付方式 1:在线支付 2:货到付款")
    @NotNull(message = "支付方式不能为空")
    private Integer payType;

    /**
     * 购物商品项DTO
     */
    @Data
    public static class ShoppingItemDTO {

        @Schema(description = "商品ID")
        @NotNull(message = "商品ID不能为空")
        private Long productId;

        @Schema(description = "商品名称")
        @NotBlank(message = "商品名称不能为空")
        private String productName;

        @Schema(description = "商品数量")
        @NotNull(message = "商品数量不能为空")
        private Integer quantity;

        @Schema(description = "商品单价")
        @NotNull(message = "商品单价不能为空")
        private String price;

        @Schema(description = "商品图片")
        private String productImage;
    }
}
