package com.heikeji.mall.takeout.domain.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 外卖订单VO类，用于前端展示
 */
@Data
public class TakeoutOrderVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 订单ID
     */
    private Long id;

    /**
     * 订单编号
     */
    private String orderNo;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 商家ID
     */
    private Long merchantId;

    /**
     * 配送方式（1：外卖柜，2：特殊地点，3：送到宿舍）
     */
    private Integer deliveryType;

    /**
     * 配送方式名称
     */
    private String deliveryTypeName;

    /**
     * 外卖柜编码（外卖柜方式）
     */
    private String deliveryLockerCode;

    /**
     * 特殊地点描述（特殊地点方式）
     */
    private String deliverySpecialPlace;

    /**
     * 楼栋号（宿舍方式）
     */
    private String deliveryDormBuilding;

    /**
     * 房间号（宿舍方式）
     */
    private String deliveryDormRoom;

    /**
     * 收货人姓名
     */
    private String receiverName;

    /**
     * 收货人电话
     */
    private String receiverPhone;

    /**
     * 收货地址
     */
    private String receiverAddress;

    /**
     * 备注信息
     */
    private String remark;

    /**
     * 订单状态（0：待接单，1：已接单，2：配送中，3：已送达，4：已取消，5：已完成，6：退款中）
     */
    private Integer status;

    /**
     * 状态名称
     */
    private String statusName;

    /**
     * 退款原因
     */
    private String refundReason;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * 实际送达时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date actualTime;

    /**
     * 配送距离（公里）
     */
    private Double distance;

    /**
     * 预计送达时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date estimatedTime;
}