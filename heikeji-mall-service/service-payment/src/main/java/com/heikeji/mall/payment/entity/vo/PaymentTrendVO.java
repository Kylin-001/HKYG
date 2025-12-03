package com.heikeji.mall.payment.entity.vo;

import java.math.BigDecimal;
import java.util.List;

/**
 * 支付趋势数据VO
 */
public class PaymentTrendVO {

    /**
     * 日期标签列表
     */
    private List<String> labels;

    /**
     * 交易金额数据列表
     */
    private List<BigDecimal> amountData;

    /**
     * 订单数量数据列表
     */
    private List<Integer> orderData;

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<BigDecimal> getAmountData() {
        return amountData;
    }

    public void setAmountData(List<BigDecimal> amountData) {
        this.amountData = amountData;
    }

    public List<Integer> getOrderData() {
        return orderData;
    }

    public void setOrderData(List<Integer> orderData) {
        this.orderData = orderData;
    }
}