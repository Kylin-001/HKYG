package com.heikeji.mall.payment.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 支付对账记录实体类
 */
@Data
@TableName("payment_reconciliation")
public class Reconciliation implements Serializable {
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
     * 平台支付流水号
     */
    private String paymentNo;

    /**
     * 支付平台交易号
     */
    private String transactionId;

    /**
     * 订单号
     */
    private String orderNo;

    /**
     * 订单金额
     */
    private BigDecimal orderAmount;

    /**
     * 实际支付金额
     */
    private BigDecimal actualAmount;

    /**
     * 平台对账金额
     */
    private BigDecimal platformAmount;

    /**
     * 对账状态：0-未对账，1-对账成功，2-对账失败（金额不符），3-对账失败（平台有本系统无），4-对账失败（本系统有平台无）
     */
    private Integer reconciliationStatus;

    /**
     * 差异金额
     */
    private BigDecimal diffAmount;

    /**
     * 错误原因
     */
    private String errorReason;

    /**
     * 解决状态：0-未解决，1-已解决
     */
    private Integer solveStatus;

    /**
     * 解决方案
     */
    private String solution;

    /**
     * 解决人
     */
    private String solver;

    /**
     * 解决时间
     */
    private Date solveTime;

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

    public void setPaymentNo(String paymentNo) {
        this.paymentNo = paymentNo;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public void setOrderAmount(BigDecimal orderAmount) {
        this.orderAmount = orderAmount;
    }

    public void setActualAmount(BigDecimal actualAmount) {
        this.actualAmount = actualAmount;
    }

    public void setPlatformAmount(BigDecimal platformAmount) {
        this.platformAmount = platformAmount;
    }

    public void setReconciliationStatus(Integer reconciliationStatus) {
        this.reconciliationStatus = reconciliationStatus;
    }

    public void setDiffAmount(BigDecimal diffAmount) {
        this.diffAmount = diffAmount;
    }

    public void setErrorReason(String errorReason) {
        this.errorReason = errorReason;
    }

    public void setSolveStatus(Integer solveStatus) {
        this.solveStatus = solveStatus;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public void setSolver(String solver) {
        this.solver = solver;
    }

    public void setSolveTime(Date solveTime) {
        this.solveTime = solveTime;
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

    public String getPaymentNo() {
        return paymentNo;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public BigDecimal getOrderAmount() {
        return orderAmount;
    }

    public BigDecimal getActualAmount() {
        return actualAmount;
    }

    public BigDecimal getPlatformAmount() {
        return platformAmount;
    }

    public Integer getReconciliationStatus() {
        return reconciliationStatus;
    }

    public BigDecimal getDiffAmount() {
        return diffAmount;
    }

    public String getErrorReason() {
        return errorReason;
    }

    public Integer getSolveStatus() {
        return solveStatus;
    }

    public String getSolution() {
        return solution;
    }

    public String getSolver() {
        return solver;
    }

    public Date getSolveTime() {
        return solveTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }
}