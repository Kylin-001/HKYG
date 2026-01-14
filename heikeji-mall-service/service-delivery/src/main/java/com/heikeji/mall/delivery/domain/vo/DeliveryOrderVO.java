package com.heikeji.mall.delivery.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单VO
 */
@Data
@Schema(description = "配送订单响应VO")
public class DeliveryOrderVO {

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "订单类型")
    private Integer orderType;

    @Schema(description = "订单类型名称")
    private String orderTypeName;

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

    @Schema(description = "状态名称")
    private String statusName;

    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "更新时间")
    private Date updateTime;
}
