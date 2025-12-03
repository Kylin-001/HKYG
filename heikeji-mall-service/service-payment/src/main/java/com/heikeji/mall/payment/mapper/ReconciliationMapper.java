package com.heikeji.mall.payment.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.heikeji.mall.payment.entity.Reconciliation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 支付对账记录Mapper
 */
@Mapper
public interface ReconciliationMapper extends BaseMapper<Reconciliation> {

    /**
     * 根据批次号查询对账记录
     */
    List<Reconciliation> selectByBatchNo(@Param("batchNo") String batchNo);

    /**
     * 根据对账日期和支付方式查询对账记录
     */
    List<Reconciliation> selectByDateAndPaymentType(
            @Param("reconciliationDate") String reconciliationDate,
            @Param("paymentType") Integer paymentType);

    /**
     * 根据对账状态统计数量
     */
    Integer countByStatus(@Param("batchNo") String batchNo, @Param("status") Integer status);

    /**
     * 根据交易号查询对账记录
     */
    Reconciliation selectByTransactionId(@Param("transactionId") String transactionId);

    /**
     * 根据支付流水号查询对账记录
     */
    Reconciliation selectByPaymentNo(@Param("paymentNo") String paymentNo);

    /**
     * 批量插入对账记录
     */
    int batchInsert(@Param("list") List<Reconciliation> reconciliationList);

    /**
     * 批量更新对账记录状态
     */
    int batchUpdateStatus(@Param("ids") List<Long> ids, @Param("status") Integer status, 
                         @Param("diffAmount") BigDecimal diffAmount, @Param("errorReason") String errorReason);

    /**
     * 统计指定日期范围内的对账差异
     */
    Map<String, Object> countReconciliationDiff(
            @Param("startDate") String startDate, @Param("endDate") String endDate);

    /**
     * 查询未解决的对账差异
     */
    List<Reconciliation> selectUnresolvedDiff(@Param("limit") Integer limit);

    /**
     * 更新对账记录的解决状态
     */
    int updateSolveStatus(@Param("id") Long id, @Param("solveStatus") Integer solveStatus,
                         @Param("solution") String solution, @Param("solver") String solver,
                         @Param("solveTime") Date solveTime);

    /**
     * 根据批次号和状态查询对账记录列表
     */
    List<Reconciliation> selectByBatchNoAndStatus(
            @Param("batchNo") String batchNo, @Param("status") Integer status);
}