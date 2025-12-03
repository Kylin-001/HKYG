package com.heikeji.mall.payment.service;

import com.heikeji.mall.payment.entity.Reconciliation;
import com.heikeji.mall.payment.entity.ReconciliationBatch;
import com.baomidou.mybatisplus.extension.service.IService;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 支付对账服务接口
 */
public interface ReconciliationService extends IService<Reconciliation> {

    /**
     * 启动对账任务
     * @param reconciliationDate 对账日期，格式：yyyy-MM-dd
     * @param paymentType 支付方式
     * @return 对账批次号
     */
    String startReconciliation(String reconciliationDate, Integer paymentType);

    /**
     * 执行对账逻辑
     * @param batchNo 对账批次号
     */
    void executeReconciliation(String batchNo);

    /**
     * 获取平台交易数据
     * @param date 对账日期
     * @param paymentType 支付方式
     * @return 平台交易数据列表
     */
    List<Map<String, Object>> fetchPlatformTransactions(String date, Integer paymentType);

    /**
     * 获取系统交易数据
     * @param date 对账日期
     * @param paymentType 支付方式
     * @return 系统交易数据列表
     */
    List<Map<String, Object>> fetchSystemTransactions(String date, Integer paymentType);

    /**
     * 进行数据比对
     * @param systemData 系统数据
     * @param platformData 平台数据
     * @param batchNo 对账批次号
     */
    void matchTransactions(List<Map<String, Object>> systemData, 
                          List<Map<String, Object>> platformData, 
                          String batchNo);

    /**
     * 处理对账差异
     * @param diffList 差异数据列表
     * @param batchNo 对账批次号
     */
    void handleReconciliationDiff(List<Reconciliation> diffList, String batchNo);

    /**
     * 生成对账报表
     * @param batchNo 对账批次号
     * @return 对账报表数据
     */
    Map<String, Object> generateReconciliationReport(String batchNo);

    /**
     * 导出对账数据
     * @param batchNo 对账批次号
     * @return 导出文件路径
     */
    String exportReconciliationData(String batchNo);

    /**
     * 查询对账批次详情
     * @param batchNo 对账批次号
     * @return 对账批次信息
     */
    ReconciliationBatch getBatchByNo(String batchNo);

    /**
     * 查询对账记录列表
     * @param batchNo 对账批次号
     * @param status 对账状态
     * @return 对账记录列表
     */
    List<Reconciliation> getReconciliationList(String batchNo, Integer status);

    /**
     * 解决对账差异
     * @param id 对账记录ID
     * @param solution 解决方案
     * @param solver 解决人
     */
    void solveReconciliationDiff(Long id, String solution, String solver);

    /**
     * 查询未解决的对账差异
     * @param limit 查询数量限制
     * @return 未解决的对账差异列表
     */
    List<Reconciliation> getUnresolvedDiffs(Integer limit);

    /**
     * 手动触发对账
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式
     * @return 任务ID
     */
    String triggerManualReconciliation(String startDate, String endDate, Integer paymentType);

    /**
     * 查询对账统计信息
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 统计信息
     */
    Map<String, Object> getReconciliationStatistics(String startDate, String endDate);
}