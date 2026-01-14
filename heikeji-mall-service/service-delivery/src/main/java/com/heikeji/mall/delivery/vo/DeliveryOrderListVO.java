package com.heikeji.mall.delivery.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单列表VO
 */
@Data
@Schema(description = "配送订单列表响应VO")
public class DeliveryOrderListVO {

    @Schema(description = "订单ID")
    private Long id;

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "订单类型")
    private Integer orderType;

    @Schema(description = "起始地址")
    private String startLocation;

    @Schema(description = "终点地址")
    private String endLocation;

    @Schema(description = "配送费用")
    private BigDecimal amount;

    @Schema(description = "小费")
    private BigDecimal tip;

    @Schema(description = "订单状态")
    private Integer status;

    @Schema(description = "状态文本")
    private String statusText;

    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "接单时间")
    private Date acceptTime;

    @Schema(description = "完成时间")
    private Date deliveryEndTime;
}