package com.heikeji.mall.delivery.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 配送员信息VO
 */
@Data
@Schema(description = "配送员信息响应VO")
public class DeliveryUserInfoVO {

    @Schema(description = "配送员ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "姓名")
    private String name;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "状态：0-待审核，1-已审核，2-审核失败，3-已禁用")
    private Integer status;

    @Schema(description = "配送评分")
    private Double deliveryScore;

    @Schema(description = "总配送单数量")
    private Integer totalOrderCount;

    @Schema(description = "完成订单数量")
    private Integer completedOrderCount;

    @Schema(description = "电动车牌照")
    private String electricVehicleLicense;
}