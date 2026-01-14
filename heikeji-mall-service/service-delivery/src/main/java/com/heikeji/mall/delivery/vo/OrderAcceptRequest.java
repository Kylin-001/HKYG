package com.heikeji.mall.delivery.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 订单接单请求
 */
@Data
@Schema(description = "订单接单请求")
public class OrderAcceptRequest {

    @Schema(description = "订单ID", required = true)
    private Long orderId;

    @Schema(description = "配送员ID", required = true)
    private Long deliveryUserId;
}