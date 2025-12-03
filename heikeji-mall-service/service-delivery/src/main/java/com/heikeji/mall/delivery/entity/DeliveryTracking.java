package com.heikeji.mall.delivery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 配送跟踪实体
 */
@Data
@TableName("delivery_tracking")
public class DeliveryTracking {

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
     * 当前状态
     */
    private Integer status;

    /**
     * 最新纬度
     */
    private Double latitude;

    /**
     * 最新经度
     */
    private Double longitude;

    /**
     * 最后更新时间
     */
    private Date lastUpdateTime;

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