package com.heikeji.mall.payment.service;

import com.heikeji.mall.payment.entity.vo.PaymentOverviewVO;
import com.heikeji.mall.payment.entity.vo.PaymentTrendVO;
import com.heikeji.mall.payment.entity.vo.PaymentMethodDistributionVO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 支付统计服务接口
 * 提供支付相关的统计分析功能
 */
public interface PaymentStatisticsService {

    /**
     * 获取支付统计概览数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式（可选）
     * @param status 支付状态（可选）
     * @return 支付统计概览数据
     */
    PaymentOverviewVO getPaymentOverview(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status);

    /**
     * 获取支付趋势数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式（可选）
     * @param status 支付状态（可选）
     * @return 支付趋势数据
     */
    PaymentTrendVO getPaymentTrend(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status);

    /**
     * 获取支付方式分布数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param status 支付状态（可选）
     * @return 支付方式分布数据列表
     */
    List<PaymentMethodDistributionVO> getPaymentMethodDistribution(LocalDate startDate, LocalDate endDate, Integer status);

    /**
     * 导出支付统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式（可选）
     * @param status 支付状态（可选）
     * @param format 导出格式（excel/csv）
     * @return 导出文件路径
     */
    String exportPaymentStatistics(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status, String format);

    /**
     * 获取支付记录分页数据
     * @param params 查询参数，包含分页信息、筛选条件等
     * @return 分页数据结果
     */
    Map<String, Object> getPaymentRecords(Map<String, Object> params);
}