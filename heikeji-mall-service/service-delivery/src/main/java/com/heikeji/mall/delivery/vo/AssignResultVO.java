package com.heikeji.mall.delivery.vo;

import lombok.Data;

/**
 * 订单分配结果VO
 */
@Data
public class AssignResultVO {
    /**
     * 分配状态：0-失败，1-成功
     */
    private Integer status;
    /**
     * 状态描述
     */
    private String message;
    /**
     * 订单ID
     */
    private Long orderId;
    /**
     * 分配的配送员ID
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
     * 匹配度分数
     */
    private Integer matchScore;
}
