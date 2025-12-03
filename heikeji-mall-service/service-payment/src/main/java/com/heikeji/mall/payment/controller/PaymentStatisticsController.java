package com.heikeji.mall.payment.controller;

import com.heikeji.common.core.web.ApiResult;
import com.heikeji.mall.payment.entity.vo.PaymentMethodDistributionVO;
import com.heikeji.mall.payment.entity.vo.PaymentOverviewVO;
import com.heikeji.mall.payment.entity.vo.PaymentTrendVO;
import com.heikeji.mall.payment.service.PaymentStatisticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 支付统计控制器
 * 提供支付统计相关的API接口
 */
@RestController
@RequestMapping("/api/payment/statistics")
public class PaymentStatisticsController {
    private static final Logger log = LoggerFactory.getLogger(PaymentStatisticsController.class);

    @Autowired
    private PaymentStatisticsService paymentStatisticsService;

    /**
     * 获取支付统计概览
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式（可选）
     * @param status 支付状态（可选）
     * @return 支付统计概览数据
     */
    @GetMapping("/overview")
    public ApiResult<PaymentOverviewVO> getPaymentOverview(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer paymentType,
            @RequestParam(required = false) Integer status) {
        log.info("获取支付统计概览: startDate={}, endDate={}, paymentType={}, status={}", 
                startDate, endDate, paymentType, status);
        
        PaymentOverviewVO overview = paymentStatisticsService.getPaymentOverview(startDate, endDate, paymentType, status);
        return ApiResult.success(overview);
    }

    /**
     * 获取支付趋势数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式（可选）
     * @param status 支付状态（可选）
     * @return 支付趋势数据
     */
    @GetMapping("/trend")
    public ApiResult<PaymentTrendVO> getPaymentTrend(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer paymentType,
            @RequestParam(required = false) Integer status) {
        log.info("获取支付趋势数据: startDate={}, endDate={}, paymentType={}, status={}", 
                startDate, endDate, paymentType, status);
        
        PaymentTrendVO trend = paymentStatisticsService.getPaymentTrend(startDate, endDate, paymentType, status);
        return ApiResult.success(trend);
    }

    /**
     * 获取支付方式分布数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param status 支付状态（可选）
     * @return 支付方式分布数据列表
     */
    @GetMapping("/distribution")
    public ApiResult<List<PaymentMethodDistributionVO>> getPaymentMethodDistribution(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer status) {
        log.info("获取支付方式分布: startDate={}, endDate={}, status={}", startDate, endDate, status);
        
        List<PaymentMethodDistributionVO> distribution = 
                paymentStatisticsService.getPaymentMethodDistribution(startDate, endDate, status);
        return ApiResult.success(distribution);
    }

    /**
     * 导出支付统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param paymentType 支付方式（可选）
     * @param status 支付状态（可选）
     * @param format 导出格式（excel/csv）
     * @return 导出结果
     */
    @GetMapping("/export")
    public ApiResult<Map<String, Object>> exportPaymentStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer paymentType,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "excel") String format) {
        log.info("导出支付统计数据: startDate={}, endDate={}, paymentType={}, status={}, format={}", 
                startDate, endDate, paymentType, status, format);
        
        try {
            String filePath = paymentStatisticsService.exportPaymentStatistics(
                    startDate, endDate, paymentType, status, format);
            File file = new File(filePath);
            
            Map<String, Object> result = Map.of(
                    "fileName", file.getName(),
                    "fileSize", file.length(),
                    "downloadUrl", "/api/payment/statistics/download?fileName=" + file.getName()
            );
            
            return ApiResult.success(result);
        } catch (Exception e) {
            log.error("导出支付统计数据失败", e);
            return ApiResult.error("导出失败: " + e.getMessage());
        }
    }

    /**
     * 获取支付记录列表
     * @param params 查询参数
     * @return 支付记录列表
     */
    @PostMapping("/records")
    public ApiResult<Map<String, Object>> getPaymentRecords(@RequestBody Map<String, Object> params) {
        log.info("获取支付记录列表: params={}", params);
        
        Map<String, Object> records = paymentStatisticsService.getPaymentRecords(params);
        return ApiResult.success(records);
    }
}