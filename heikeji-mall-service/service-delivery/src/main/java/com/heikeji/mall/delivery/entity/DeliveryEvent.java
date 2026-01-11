package com.heikeji.mall.delivery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 配送事件实体
 * 用于记录配送过程中的各种事件，如接单、开始配送、完成配送等
 */
@Data
@TableName("delivery_event")
public class DeliveryEvent {

    /**
     * 事件ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 配送员ID
     */
    private Long deliveryUserId;

    /**
     * 事件类型
     * 1-订单创建
     * 2-配送员接单
     * 3-开始配送
     * 4-完成配送
     * 5-订单取消
     * 6-位置更新
     * 7-配送延迟
     * 8-异常事件
     */
    private Integer eventType;

    /**
     * 事件描述
     */
    private String eventDesc;

    /**
     * 经度（可选，用于位置更新事件）
     */
    private Double longitude;

    /**
     * 纬度（可选，用于位置更新事件）
     */
    private Double latitude;

    /**
     * 事件时间
     */
    private Date eventTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 删除标志
     */
    private Integer deleted;
}
