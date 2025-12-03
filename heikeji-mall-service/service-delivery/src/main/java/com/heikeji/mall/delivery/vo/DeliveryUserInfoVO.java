package com.heikeji.mall.delivery.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 配送员信息VO
 */
@Data
@ApiModel(description = "配送员信息响应VO")
public class DeliveryUserInfoVO {

    @ApiModelProperty(value = "配送员ID")
    private Long id;

    @ApiModelProperty(value = "用户ID")
    private Long userId;

    @ApiModelProperty(value = "姓名")
    private String name;

    @ApiModelProperty(value = "手机号")
    private String phone;

    @ApiModelProperty(value = "状态：0-待审核，1-已审核，2-审核失败，3-已禁用")
    private Integer status;

    @ApiModelProperty(value = "配送评分")
    private Double deliveryScore;

    @ApiModelProperty(value = "总配送单数量")
    private Integer totalOrderCount;

    @ApiModelProperty(value = "完成订单数量")
    private Integer completedOrderCount;

    @ApiModelProperty(value = "电动车牌照")
    private String electricVehicleLicense;
}