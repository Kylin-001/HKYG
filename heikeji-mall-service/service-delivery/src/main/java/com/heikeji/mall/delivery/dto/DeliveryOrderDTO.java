package com.heikeji.mall.delivery.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单DTO
 */
@Data
@ApiModel(description = "配送订单请求DTO")
public class DeliveryOrderDTO {

    @ApiModelProperty(value = "订单类型：1-快递取件，2-快递送件，3-跑腿代购，4-文件配送")
    private Integer orderType;

    @ApiModelProperty(value = "起始地址")
    private String startLocation;

    @ApiModelProperty(value = "终点地址")
    private String endLocation;

    @ApiModelProperty(value = "物品描述")
    private String itemDescription;

    @ApiModelProperty(value = "期望送达时间")
    private Date expectedTime;

    @ApiModelProperty(value = "配送费用")
    private BigDecimal amount;

    @ApiModelProperty(value = "小费")
    private BigDecimal tip;

    @ApiModelProperty(value = "支付方式：1-微信支付，2-支付宝支付")
    private Integer payType;

    @ApiModelProperty(value = "备注")
    private String remark;
}
