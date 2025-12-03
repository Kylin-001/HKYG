package com.heikeji.mall.user.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 配送请求详情VO
 * 用于展示配送请求的详细信息
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "配送请求详情VO")
public class DeliveryRequestDetailVO {

    @Schema(description = "配送请求ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户昵称")
    private String userNickname;

    @Schema(description = "收件人姓名")
    private String recipientName;

    @Schema(description = "收件人手机号")
    private String recipientPhone;

    @Schema(description = "取件地址")
    private String pickupAddress;

    @Schema(description = "送达地址")
    private String deliveryAddress;

    @Schema(description = "取件时间")
    private LocalDateTime pickupTime;

    @Schema(description = "送达时间")
    private LocalDateTime deliveryTime;

    @Schema(description = "配送物品类型")
    private String itemType;

    @Schema(description = "配送物品重量")
    private Double weight;

    @Schema(description = "配送物品数量")
    private Integer quantity;

    @Schema(description = "备注信息")
    private String remark;

    @Schema(description = "配送费用")
    private Double deliveryFee;

    @Schema(description = "支付状态")
    private Integer paymentStatus;

    @Schema(description = "支付状态名称")
    private String paymentStatusName;

    @Schema(description = "配送状态")
    private Integer status;

    @Schema(description = "配送状态名称")
    private String statusName;

    @Schema(description = "配送人员ID")
    private Long deliveryPersonId;

    @Schema(description = "配送人员姓名")
    private String deliveryPersonName;

    @Schema(description = "配送人员手机号")
    private String deliveryPersonPhone;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}