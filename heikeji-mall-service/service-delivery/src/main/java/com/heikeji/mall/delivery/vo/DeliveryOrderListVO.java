package com.heikeji.mall.delivery.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单列表VO
 */
@Data
@ApiModel(description = "配送订单列表响应VO")
public class DeliveryOrderListVO {

    @ApiModelProperty(value = "订单ID")
    private Long id;

    @ApiModelProperty(value = "订单号")
    private String orderNo;

    @ApiModelProperty(value = "订单类型")
    private Integer orderType;

    @ApiModelProperty(value = "起始地址")
    private String startLocation;

    @ApiModelProperty(value = "终点地址")
    private String endLocation;

    @ApiModelProperty(value = "配送费用")
    private BigDecimal amount;

    @ApiModelProperty(value = "小费")
    private BigDecimal tip;

    @ApiModelProperty(value = "订单状态")
    private Integer status;

    @ApiModelProperty(value = "状态文本")
    private String statusText;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "接单时间")
    private Date acceptTime;

    @ApiModelProperty(value = "完成时间")
    private Date deliveryEndTime;
}