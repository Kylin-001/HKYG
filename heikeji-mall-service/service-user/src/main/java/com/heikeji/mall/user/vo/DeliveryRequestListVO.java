package com.heikeji.mall.user.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送请求列表视图对象
 * 用于展示配送请求的列表数据
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "配送请求列表视图对象")
public class DeliveryRequestListVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "配送请求ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "用户名")
    private String userName;

    @Schema(description = "服务类型")
    private Integer serviceType;

    @Schema(description = "服务类型名称")
    private String serviceTypeName;

    @Schema(description = "发货人姓名")
    private String senderName;

    @Schema(description = "发货人电话")
    private String senderPhone;

    @Schema(description = "发货地址")
    private String senderAddress;

    @Schema(description = "收货人姓名")
    private String receiverName;

    @Schema(description = "收货人电话")
    private String receiverPhone;

    @Schema(description = "收货地址")
    private String receiverAddress;

    @Schema(description = "货物名称")
    private String goodsName;

    @Schema(description = "货物重量")
    private BigDecimal goodsWeight;

    @Schema(description = "货物体积")
    private BigDecimal goodsVolume;

    @Schema(description = "货物数量")
    private Integer goodsQuantity;

    @Schema(description = "货物描述")
    private String goodsDescription;

    @Schema(description = "配送时间")
    private Date deliveryTime;

    @Schema(description = "配送状态")
    private Integer status;

    @Schema(description = "配送状态名称")
    private String statusName;

    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "更新时间")
    private Date updateTime;
}
