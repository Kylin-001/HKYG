package com.heikeji.mall.payment.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 支付对账批次实体类
 */
@Data
@TableName("payment_reconciliation_batch")
public class ReconciliationBatch implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 对账批次号
     */
    private String batchNo;

    /**
     * 对账日期，格式：yyyy-MM-dd
     */
    private String reconciliationDate;

    /**
     * 支付方式：1-微信支付，2-余额支付
     */
    private Integer paymentType;

    /**
     * 系统交易笔数
     */
    private Integer systemTransactionCount;

    /**
     * 系统交易总金额
     */
    private BigDecimal systemTotalAmount;

    /**
     * 平台交易笔数
     */
    private Integer platformTransactionCount;

    /**
     * 平台交易总金额
     */
    private BigDecimal platformTotalAmount;

    /**
     * 对账成功笔数
     */
    private Integer successCount;

    /**
     * 对账失败笔数
     */
    private Integer failCount;

    /**
     * 对账状态：0-未开始，1-进行中，2-已完成，3-失败
     */
    private Integer reconciliationStatus;

    /**
     * 开始时间
     */
    private Date startTime;

    /**
     * 结束时间
     */
    private Date endTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    public void setId(Long id) {
        this.id = id;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public void setReconciliationDate(String reconciliationDate) {
        this.reconciliationDate = reconciliationDate;
    }

    public void setPaymentType(Integer paymentType) {
        this.paymentType = paymentType;
    }

    public void setSystemTransactionCount(Integer systemTransactionCount) {
        this.systemTransactionCount = systemTransactionCount;
    }

    public void setSystemTotalAmount(BigDecimal systemTotalAmount) {
        this.systemTotalAmount = systemTotalAmount;
    }

    public void setPlatformTransactionCount(Integer platformTransactionCount) {
        this.platformTransactionCount = platformTransactionCount;
    }

    public void setPlatformTotalAmount(BigDecimal platformTotalAmount) {
        this.platformTotalAmount = platformTotalAmount;
    }

    public void setSuccessCount(Integer successCount) {
        this.successCount = successCount;
    }

    public void setFailCount(Integer failCount) {
        this.failCount = failCount;
    }

    public void setReconciliationStatus(Integer reconciliationStatus) {
        this.reconciliationStatus = reconciliationStatus;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getId() {
        return id;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public String getReconciliationDate() {
        return reconciliationDate;
    }

    public Integer getPaymentType() {
        return paymentType;
    }

    public Integer getSystemTransactionCount() {
        return systemTransactionCount;
    }

    public BigDecimal getSystemTotalAmount() {
        return systemTotalAmount;
    }

    public Integer getPlatformTransactionCount() {
        return platformTransactionCount;
    }

    public BigDecimal getPlatformTotalAmount() {
        return platformTotalAmount;
    }

    public Integer getSuccessCount() {
        return successCount;
    }

    public Integer getFailCount() {
        return failCount;
    }

    public Integer getReconciliationStatus() {
        return reconciliationStatus;
    }

    public Date getStartTime() {
        return startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }
}