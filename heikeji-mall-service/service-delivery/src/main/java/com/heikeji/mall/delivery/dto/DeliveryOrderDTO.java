package com.heikeji.mall.delivery.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单DTO
 */
@Data
@Schema(description = "配送订单请求DTO")
public class DeliveryOrderDTO {

    @Schema(description = "订单类型：1-快递取件，2-快递送件，3-跑腿代购，4-文件配送")
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

    @Schema(description = "支付方式：1-微信支付，2-支付宝支付")
    private Integer payType;

    @Schema(description = "备注")
    private String remark;
}
