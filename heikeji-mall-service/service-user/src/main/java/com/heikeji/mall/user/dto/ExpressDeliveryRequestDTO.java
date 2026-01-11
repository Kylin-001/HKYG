package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * 快递配送请求DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "快递配送请求DTO")
public class ExpressDeliveryRequestDTO {

    @Schema(description = "快递公司ID")
    @NotNull(message = "快递公司不能为空")
    private Long expressCompanyId;

    @Schema(description = "快递公司名称")
    @NotBlank(message = "快递公司名称不能为空")
    private String expressCompanyName;

    @Schema(description = "寄件人姓名")
    @NotBlank(message = "寄件人姓名不能为空")
    private String senderName;

    @Schema(description = "寄件人电话")
    @NotBlank(message = "寄件人电话不能为空")
    private String senderPhone;

    @Schema(description = "寄件人地址")
    @NotBlank(message = "寄件人地址不能为空")
    private String senderAddress;

    @Schema(description = "收件人姓名")
    @NotBlank(message = "收件人姓名不能为空")
    private String recipientName;

    @Schema(description = "收件人电话")
    @NotBlank(message = "收件人电话不能为空")
    private String recipientPhone;

    @Schema(description = "收件人地址")
    @NotBlank(message = "收件人地址不能为空")
    private String recipientAddress;

    @Schema(description = "快递类型 1:普通快递 2:加急快递")
    @NotNull(message = "快递类型不能为空")
    private Integer expressType;

    @Schema(description = "快递重量(kg)")
    private String weight;

    @Schema(description = "快递体积(cm³)")
    private String volume;

    @Schema(description = "快递物品描述")
    @NotBlank(message = "快递物品描述不能为空")
    private String itemDescription;

    @Schema(description = "快递价值(元)")
    private String itemValue;

    @Schema(description = "是否保价 0:否 1:是")
    private Integer isInsured;

    @Schema(description = "保价金额(元)")
    private String insuredAmount;

    @Schema(description = "备注信息")
    private String remark;

    @Schema(description = "支付方式 1:在线支付 2:货到付款")
    @NotNull(message = "支付方式不能为空")
    private Integer payType;
}
