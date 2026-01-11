package com.heikeji.mall.delivery.vo;

import lombok.Data;

import java.util.Date;

/**
 * 配送事件VO
 */
@Data
public class DeliveryEventVO {

    /**
     * 事件ID
     */
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
     * 配送员姓名
     */
    private String deliveryUserName;

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
     * 事件类型文本
     */
    private String eventTypeText;

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
     * 获取事件类型文本
     * @return 事件类型文本
     */
    public String getEventTypeText() {
        switch (eventType) {
            case 1: return "订单创建";
            case 2: return "配送员接单";
            case 3: return "开始配送";
            case 4: return "完成配送";
            case 5: return "订单取消";
            case 6: return "位置更新";
            case 7: return "配送延迟";
            case 8: return "异常事件";
            default: return "未知事件";
        }
    }
}
