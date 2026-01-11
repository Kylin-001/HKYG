package com.heikeji.mall.delivery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 配送路线实体
 */
@Data
@TableName("delivery_route")
public class DeliveryRoute {

    /**
     * 主键ID
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
     * 路线状态：0-规划中，1-规划完成，2-已执行，3-已完成
     */
    private Integer status;

    /**
     * 总距离（单位：米）
     */
    private Integer totalDistance;

    /**
     * 预计总时间（单位：分钟）
     */
    private Integer estimatedTime;

    /**
     * 规划时间
     */
    private Date planTime;

    /**
     * 开始执行时间
     */
    private Date startTime;

    /**
     * 完成时间
     */
    private Date finishTime;

    /**
     * 路线描述
     */
    private String routeDescription;

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
