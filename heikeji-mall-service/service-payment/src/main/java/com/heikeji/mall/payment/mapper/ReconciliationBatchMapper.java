package com.heikeji.mall.payment.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.payment.entity.ReconciliationBatch;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 支付对账批次Mapper
 */
@Mapper
public interface ReconciliationBatchMapper extends BaseMapper<ReconciliationBatch> {

    /**
     * 根据批次号查询对账批次
     */
    ReconciliationBatch selectByBatchNo(@Param("batchNo") String batchNo);

    /**
     * 根据对账日期和支付方式查询对账批次
     */
    ReconciliationBatch selectByDateAndPaymentType(
            @Param("reconciliationDate") String reconciliationDate,
            @Param("paymentType") Integer paymentType);

    /**
     * 更新对账批次状态
     */
    int updateStatus(@Param("id") Long id, @Param("status") Integer status,
                    @Param("endTime") Date endTime);

    /**
     * 更新对账批次统计信息
     */
    int updateStatistics(@Param("id") Long id,
                        @Param("successCount") Integer successCount,
                        @Param("failCount") Integer failCount);

    /**
     * 查询指定日期范围内的对账批次
     */
    List<ReconciliationBatch> selectByDateRange(
            @Param("startDate") String startDate, @Param("endDate") String endDate);

    /**
     * 查询最近的对账批次
     */
    ReconciliationBatch selectLatestBatch(@Param("paymentType") Integer paymentType);

    /**
     * 统计对账批次信息
     */
    Map<String, Object> countBatchStatistics();

    /**
     * 查询进行中的对账批次
     */
    List<ReconciliationBatch> selectProcessingBatches();
}