package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 配送请求查询DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "配送请求查询DTO")
public class DeliveryRequestQueryDTO {

    @Schema(description = "配送请求ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "配送地址ID")
    private Long addressId;

    @Schema(description = "配送类型 1:即时配送 2:预约配送")
    private Integer deliveryType;

    @Schema(description = "配送状态 1:待接单 2:已接单 3:配送中 4:已完成 5:已取消")
    private Integer deliveryStatus;

    @Schema(description = "支付方式 1:在线支付 2:货到付款")
    private Integer payType;

    @Schema(description = "支付状态 0:未支付 1:已支付 2:已退款")
    private Integer payStatus;

    @Schema(description = "配送员ID")
    private Long deliveryPersonId;

    @Schema(description = "开始时间")
    private String startTime;

    @Schema(description = "结束时间")
    private String endTime;

    @Schema(description = "页码")
    private Integer pageNum;

    @Schema(description = "每页数量")
    private Integer pageSize;
}
