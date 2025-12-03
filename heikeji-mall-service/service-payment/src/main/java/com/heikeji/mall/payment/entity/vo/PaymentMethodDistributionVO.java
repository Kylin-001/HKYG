package com.heikeji.mall.payment.entity.vo;

import java.math.BigDecimal;

/**
 * 支付方式分布数据VO
 */
public class PaymentMethodDistributionVO {

    /**
     * 支付方式名称
     */
    private String name;

    /**
     * 金额占比或订单数占比
     */
    private Double value;

    /**
     * 实际金额（可选）
     */
    private BigDecimal amount;

    /**
     * 订单数量（可选）
     */
    private Integer count;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}