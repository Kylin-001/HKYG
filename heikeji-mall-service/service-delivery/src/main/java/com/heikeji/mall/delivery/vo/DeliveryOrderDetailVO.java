package com.heikeji.mall.delivery.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单详情VO
 */
@Data
@Schema(description = "配送订单详情响应VO")
public class DeliveryOrderDetailVO {

    @Schema(description = "订单ID")
    private Long id;

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "配送员ID")
    private Long deliveryUserId;

    @Schema(description = "订单类型")
    private Integer orderType;

    @Schema(description = "起始地址")
    private String startLocation;

    @Schema(description = "终点地址")
    private String endLocation;

    @Schema(description = "物品描述")
    private String itemDescription;

    @Schema(description = "期望送达时间")
    private Date expectedTime;

    @Schema(description = "配送费用")
    private BigDecimal amount;

    @Schema(description = "小费")
    private BigDecimal tip;

    @Schema(description = "订单状态")
    private Integer status;

    @Schema(description = "状态文本")
    private String statusText;

    @Schema(description = "接单时间")
    private Date acceptTime;

    @Schema(description = "配送开始时间")
    private Date deliveryStartTime;

    @Schema(description = "配送完成时间")
    private Date deliveryEndTime;

    @Schema(description = "取消原因")
    private String cancelReason;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "更新时间")
    private Date updateTime;
}