package com.heikeji.mall.delivery.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 配送订单状态统计VO
 */
@Data
@Schema(description = "配送订单状态统计响应VO")
public class DeliveryOrderStatusVO {

    @Schema(description = "待接单数量")
    private Integer pendingCount;

    @Schema(description = "已接单数量")
    private Integer acceptedCount;

    @Schema(description = "配送中数量")
    private Integer deliveringCount;

    @Schema(description = "已完成数量")
    private Integer completedCount;

    @Schema(description = "已取消数量")
    private Integer cancelledCount;

    @Schema(description = "总数量")
    private Integer totalCount;
}