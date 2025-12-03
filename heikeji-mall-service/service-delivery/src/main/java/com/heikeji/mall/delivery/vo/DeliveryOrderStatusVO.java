package com.heikeji.mall.delivery.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 配送订单状态统计VO
 */
@Data
@ApiModel(description = "配送订单状态统计响应VO")
public class DeliveryOrderStatusVO {

    @ApiModelProperty(value = "待接单数量")
    private Integer pendingCount;

    @ApiModelProperty(value = "已接单数量")
    private Integer acceptedCount;

    @ApiModelProperty(value = "配送中数量")
    private Integer deliveringCount;

    @ApiModelProperty(value = "已完成数量")
    private Integer completedCount;

    @ApiModelProperty(value = "已取消数量")
    private Integer cancelledCount;

    @ApiModelProperty(value = "总数量")
    private Integer totalCount;
}