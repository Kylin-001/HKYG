package com.heikeji.mall.payment.entity.vo;

import java.math.BigDecimal;

/**
 * 支付统计概览数据VO
 */
public class PaymentOverviewVO {

    /**
     * 总交易金额
     */
    private BigDecimal totalAmount;

    /**
     * 总订单数
     */
    private Integer totalOrders;

    /**
     * 支付成功率
     */
    private Double successRate;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount;

    /**
     * 退款率
     */
    private Double refundRate;

    /**
     * 金额环比增长
     */
    private Double amountTrend;

    /**
     * 订单数环比增长
     */
    private Double orderTrend;

    /**
     * 成功率环比增长
     */
    private Double successRateTrend;

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public Double getRefundRate() {
        return refundRate;
    }

    public void setRefundRate(Double refundRate) {
        this.refundRate = refundRate;
    }

    public Double getAmountTrend() {
        return amountTrend;
    }

    public void setAmountTrend(Double amountTrend) {
        this.amountTrend = amountTrend;
    }

    public Double getOrderTrend() {
        return orderTrend;
    }

    public void setOrderTrend(Double orderTrend) {
        this.orderTrend = orderTrend;
    }

    public Double getSuccessRateTrend() {
        return successRateTrend;
    }

    public void setSuccessRateTrend(Double successRateTrend) {
        this.successRateTrend = successRateTrend;
    }
}