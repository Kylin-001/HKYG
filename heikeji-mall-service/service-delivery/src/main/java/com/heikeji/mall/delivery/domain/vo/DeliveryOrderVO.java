package com.heikeji.mall.delivery.domain.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单VO
 */
@Data
@ApiModel(description = "配送订单响应VO")
public class DeliveryOrderVO {

    @ApiModelProperty(value = "订单号")
    private String orderNo;

    @ApiModelProperty(value = "订单类型")
    private Integer orderType;

    @ApiModelProperty(value = "订单类型名称")
    private String orderTypeName;

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

    @ApiModelProperty(value = "订单状态")
    private Integer status;

    @ApiModelProperty(value = "状态名称")
    private String statusName;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "更新时间")
    private Date updateTime;
}
