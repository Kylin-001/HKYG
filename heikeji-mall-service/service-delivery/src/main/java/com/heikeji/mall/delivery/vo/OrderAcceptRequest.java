package com.heikeji.mall.delivery.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 订单接单请求
 */
@Data
@ApiModel(description = "订单接单请求")
public class OrderAcceptRequest {

    @ApiModelProperty(value = "订单ID", required = true)
    private Long orderId;

    @ApiModelProperty(value = "配送员ID", required = true)
    private Long deliveryUserId;
}