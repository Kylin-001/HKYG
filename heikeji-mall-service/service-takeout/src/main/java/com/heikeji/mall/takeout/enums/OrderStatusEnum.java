package com.heikeji.mall.takeout.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 订单状态枚举
 */
@Getter
@AllArgsConstructor
public enum OrderStatusEnum {
    PENDING("pending", "待接单"),
    ACCEPTED("accepted", "已接单"),
    DELIVERING("delivering", "配送中"),
    DELIVERED("delivered", "已送达"),
    CANCELLED("cancelled", "已取消");

    private final String value;
    private final String text;

    /**
     * 根据值获取对应的枚举
     */
    public static OrderStatusEnum getByValue(String value) {
        for (OrderStatusEnum status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        return null;
    }

    /**
     * 根据值获取状态文本
     */
    public static String getTextByValue(String value) {
        OrderStatusEnum status = getByValue(value);
        return status != null ? status.text : "未知状态";
    }
}