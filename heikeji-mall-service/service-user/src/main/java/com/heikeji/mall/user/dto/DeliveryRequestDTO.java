package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 配送请求DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "配送请求DTO")
public class DeliveryRequestDTO {

    @Schema(description = "配送地址ID")
    @NotNull(message = "配送地址不能为空")
    private Long addressId;

    @Schema(description = "收货人姓名")
    @NotBlank(message = "收货人姓名不能为空")
    private String recipientName;

    @Schema(description = "收货人电话")
    @NotBlank(message = "收货人电话不能为空")
    private String recipientPhone;

    @Schema(description = "详细地址")
    @NotBlank(message = "详细地址不能为空")
    private String detailAddress;

    @Schema(description = "配送时间")
    private String deliveryTime;

    @Schema(description = "配送类型 1:即时配送 2:预约配送")
    @NotNull(message = "配送类型不能为空")
    private Integer deliveryType;

    @Schema(description = "配送商品信息")
    @NotBlank(message = "配送商品信息不能为空")
    private String deliveryContent;

    @Schema(description = "备注信息")
    private String remark;

    @Schema(description = "配送费用")
    private String deliveryFee;

    @Schema(description = "支付方式 1:在线支付 2:货到付款")
    @NotNull(message = "支付方式不能为空")
    private Integer payType;
}
