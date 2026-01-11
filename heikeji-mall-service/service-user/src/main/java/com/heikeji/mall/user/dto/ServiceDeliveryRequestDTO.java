package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 服务配送请求数据传输对象
 * 用于接收配送服务请求的相关参数
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(name = "ServiceDeliveryRequestDTO", description = "服务配送请求DTO，用于接收配送服务请求的相关参数")
public class ServiceDeliveryRequestDTO {

    @Schema(description = "用户ID", example = "1", required = true)
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @Schema(description = "服务类型", example = "1", required = true)
    @NotNull(message = "服务类型不能为空")
    private Integer serviceType;

    @Schema(description = "取货地址", example = "北京市朝阳区建国路88号", required = true)
    @NotNull(message = "取货地址不能为空")
    @Size(max = 200, message = "取货地址长度不能超过200个字符")
    private String pickupAddress;

    @Schema(description = "取货联系人", example = "张三", required = true)
    @NotNull(message = "取货联系人不能为空")
    @Size(max = 20, message = "取货联系人长度不能超过20个字符")
    private String pickupContact;

    @Schema(description = "取货联系电话", example = "13800138000", required = true)
    @NotNull(message = "取货联系电话不能为空")
    @Size(max = 20, message = "取货联系电话长度不能超过20个字符")
    private String pickupPhone;

    @Schema(description = "送货地址", example = "北京市海淀区中关村大街1号", required = true)
    @NotNull(message = "送货地址不能为空")
    @Size(max = 200, message = "送货地址长度不能超过200个字符")
    private String deliveryAddress;

    @Schema(description = "送货联系人", example = "李四", required = true)
    @NotNull(message = "送货联系人不能为空")
    @Size(max = 20, message = "送货联系人长度不能超过20个字符")
    private String deliveryContact;

    @Schema(description = "送货联系电话", example = "13900139000", required = true)
    @NotNull(message = "送货联系电话不能为空")
    @Size(max = 20, message = "送货联系电话长度不能超过20个字符")
    private String deliveryPhone;

    @Schema(description = "货物名称", example = "文件", required = true)
    @NotNull(message = "货物名称不能为空")
    @Size(max = 100, message = "货物名称长度不能超过100个字符")
    private String goodsName;

    @Schema(description = "货物重量(kg)", example = "0.5")
    private BigDecimal goodsWeight;

    @Schema(description = "货物数量", example = "1")
    private Integer goodsQuantity;

    @Schema(description = "货物描述", example = "重要文件，需妥善保管")
    @Size(max = 500, message = "货物描述长度不能超过500个字符")
    private String goodsDescription;

    @Schema(description = "期望送达时间", example = "2024-12-20 14:30:00")
    private String expectedDeliveryTime;

    @Schema(description = "是否需要保价", example = "false")
    private Boolean needInsurance;

    @Schema(description = "保价金额", example = "1000.00")
    private BigDecimal insuranceAmount;

    @Schema(description = "备注", example = "请尽量在上午送达")
    @Size(max = 500, message = "备注长度不能超过500个字符")
    private String remark;

    @Schema(description = "支付方式", example = "1")
    private Integer paymentMethod;

    @Schema(description = "是否使用优惠券", example = "false")
    private Boolean useCoupon;

    @Schema(description = "优惠券ID", example = "1")
    private Long couponId;
}
