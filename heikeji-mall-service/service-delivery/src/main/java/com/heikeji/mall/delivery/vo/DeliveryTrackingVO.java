package com.heikeji.mall.delivery.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 配送跟踪信息VO
 */
@Data
public class DeliveryTrackingVO {

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 配送员ID
     */
    private Long deliveryUserId;

    /**
     * 配送员姓名
     */
    private String deliveryUserName;

    /**
     * 配送员手机号
     */
    private String deliveryUserPhone;

    /**
     * 当前状态
     */
    private Integer status;

    /**
     * 状态文本
     */
    private String statusText;

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
     * 预计送达时间
     */
    private Date estimatedArrivalTime;

    /**
     * 配送事件列表
     */
    private List<DeliveryEvent> events;

    /**
     * 配送事件
     */
    @Data
    public static class DeliveryEvent {
        /**
         * 事件类型
         */
        private Integer eventType;

        /**
         * 事件描述
         */
        private String eventDesc;

        /**
         * 发生时间
         */
        private Date eventTime;
    }
}