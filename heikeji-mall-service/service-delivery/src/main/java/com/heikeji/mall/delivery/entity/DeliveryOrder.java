package com.heikeji.mall.delivery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 配送订单实体
 */
@Data
@TableName("delivery_order")
public class DeliveryOrder {

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 订单号
     */
    private String orderNo;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 配送员ID
     */
    private Long deliveryUserId;

    /**
     * 订单类型：1-快递取件，2-快递送件，3-跑腿代购，4-文件配送
     */
    private Integer orderType;

    /**
     * 起始地址
     */
    private String startLocation;

    /**
     * 终点地址
     */
    private String endLocation;

    /**
     * 物品描述
     */
    private String itemDescription;

    /**
     * 期望送达时间
     */
    private Date expectedTime;

    /**
     * 配送费用
     */
    private BigDecimal amount;

    /**
     * 小费
     */
    private BigDecimal tip;

    /**
     * 订单状态：0-待接单，1-已接单，2-配送中，3-已完成，4-已取消
     */
    private Integer status;

    /**
     * 接单时间
     */
    private Date acceptTime;

    /**
     * 配送开始时间
     */
    private Date deliveryStartTime;

    /**
     * 配送完成时间
     */
    private Date deliveryEndTime;

    /**
     * 取消原因
     */
    private String cancelReason;

    /**
     * 取消时间
     */
    private Date cancelTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除：0-未删除，1-已删除
     */
    private Integer deleted;
}
