package com.heikeji.mall.payment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.payment.constants.PaymentConstants;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.entity.vo.PaymentMethodDistributionVO;
import com.heikeji.mall.payment.entity.vo.PaymentOverviewVO;
import com.heikeji.mall.payment.entity.vo.PaymentTrendVO;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.service.PaymentStatisticsService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 支付统计服务实现类
 */
@Service
public class PaymentStatisticsServiceImpl implements PaymentStatisticsService {

    private static final Logger log = LoggerFactory.getLogger(PaymentStatisticsServiceImpl.class);


    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public PaymentOverviewVO getPaymentOverview(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status) {
        // 计算当前统计周期的数据
        Map<String, Object> currentStats = calculateStatistics(startDate, endDate, paymentType, status);
        
        // 计算上一周期的数据用于环比
        LocalDate prevStartDate = startDate.minusDays(endDate.toEpochDay() - startDate.toEpochDay() + 1);
        LocalDate prevEndDate = startDate.minusDays(1);
        Map<String, Object> previousStats = calculateStatistics(prevStartDate, prevEndDate, paymentType, status);
        
        PaymentOverviewVO overviewVO = new PaymentOverviewVO();
        overviewVO.setTotalAmount((BigDecimal) currentStats.get("totalAmount"));
        overviewVO.setTotalOrders((Integer) currentStats.get("totalOrders"));
        overviewVO.setSuccessRate((Double) currentStats.get("successRate"));
        overviewVO.setRefundAmount((BigDecimal) currentStats.get("refundAmount"));
        overviewVO.setRefundRate((Double) currentStats.get("refundRate"));
        
        // 计算环比增长
        overviewVO.setAmountTrend(calculateTrend(
                (BigDecimal) currentStats.get("totalAmount"), 
                (BigDecimal) previousStats.get("totalAmount")));
        overviewVO.setOrderTrend(calculateTrend(
                (Integer) currentStats.get("totalOrders"), 
                (Integer) previousStats.get("totalOrders")));
        overviewVO.setSuccessRateTrend(calculateTrend(
                (Double) currentStats.get("successRate"), 
                (Double) previousStats.get("successRate")));
        
        return overviewVO;
    }

    @Override
    public PaymentTrendVO getPaymentTrend(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status) {
        PaymentTrendVO trendVO = new PaymentTrendVO();
        List<String> labels = new ArrayList<>();
        List<BigDecimal> amountData = new ArrayList<>();
        List<Integer> orderData = new ArrayList<>();
        
        // 遍历日期范围，获取每天的数据
        LocalDate current = startDate;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");
        
        while (!current.isAfter(endDate)) {
            Map<String, Object> dailyStats = calculateStatistics(current, current, paymentType, status);
            labels.add(current.format(formatter));
            amountData.add((BigDecimal) dailyStats.get("totalAmount"));
            orderData.add((Integer) dailyStats.get("totalOrders"));
            current = current.plusDays(1);
        }
        
        trendVO.setLabels(labels);
        trendVO.setAmountData(amountData);
        trendVO.setOrderData(orderData);
        
        return trendVO;
    }

    @Override
    public List<PaymentMethodDistributionVO> getPaymentMethodDistribution(LocalDate startDate, LocalDate endDate, Integer status) {
        List<PaymentMethodDistributionVO> distributionList = new ArrayList<>();
        
        // 获取各支付方式的数据
        Map<Integer, Map<String, Object>> methodStats = calculateMethodStatistics(startDate, endDate, status);
        
        // 计算总金额用于占比计算
        BigDecimal totalAmount = methodStats.values().stream()
                .map(stat -> (BigDecimal) stat.get("amount"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // 构建支付方式分布数据
        methodStats.forEach((type, stats) -> {
            PaymentMethodDistributionVO vo = new PaymentMethodDistributionVO();
            vo.setName(getPaymentTypeName(type));
            vo.setAmount((BigDecimal) stats.get("amount"));
            vo.setCount((Integer) stats.get("count"));
            
            // 计算占比
            if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                vo.setValue(((BigDecimal) stats.get("amount")).divide(totalAmount, 4, BigDecimal.ROUND_HALF_UP).doubleValue() * 100);
            } else {
                vo.setValue(0.0);
            }
            
            distributionList.add(vo);
        });
        
        return distributionList;
    }

    @Override
    public String exportPaymentStatistics(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status, String format) {
        // 构建查询条件
        LambdaQueryWrapper<Payment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.ge(Payment::getCreateTime, startDate)
                .le(Payment::getCreateTime, endDate);
        
        if (paymentType != null) {
            queryWrapper.eq(Payment::getPaymentType, paymentType);
        }
        if (status != null) {
            queryWrapper.eq(Payment::getStatus, status);
        }
        
        // 获取支付记录
        List<Payment> payments = paymentMapper.selectList(queryWrapper);
        
        // 生成导出文件路径
        String exportDir = System.getProperty("java.io.tmpdir") + File.separator + "payment_export";
        File dir = new File(exportDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        String fileName = "payment_statistics_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "." + format;
        String filePath = exportDir + File.separator + fileName;
        
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            // 这里简化实现，实际项目中应使用POI或opencsv库进行导出
            // 模拟导出内容
            String header = "订单号,支付流水号,支付方式,金额,状态,创建时间,完成时间\n";
            fos.write(header.getBytes());
            
            for (Payment payment : payments) {
                String line = String.join(",", 
                        payment.getOrderNo(),
                        payment.getPaymentNo(),
                        getPaymentTypeName(payment.getPaymentType()),
                        payment.getAmount().toString(),
                        getStatusName(payment.getStatus()),
                        payment.getCreateTime().toString(),
                        payment.getPayTime() != null ? payment.getPayTime().toString() : "\n");
                fos.write(line.getBytes());
            }
        } catch (IOException e) {
            log.error("导出支付统计数据失败", e);
            throw new RuntimeException("导出失败", e);
        }
        
        return filePath;
    }

    @Override
    public Map<String, Object> getPaymentRecords(Map<String, Object> params) {
        // 构建分页参数
        Integer pageNum = (Integer) params.getOrDefault("pageNum", 1);
        Integer pageSize = (Integer) params.getOrDefault("pageSize", 10);
        Page<Payment> page = new Page<>(pageNum, pageSize);
        
        // 构建查询条件
        LambdaQueryWrapper<Payment> queryWrapper = new LambdaQueryWrapper<>();
        
        // 订单号筛选
        if (params.containsKey("orderNo")) {
            queryWrapper.eq(Payment::getOrderNo, params.get("orderNo"));
        }
        
        // 支付流水号筛选
        if (params.containsKey("paymentNo")) {
            queryWrapper.eq(Payment::getPaymentNo, params.get("paymentNo"));
        }
        
        // 支付方式筛选
        if (params.containsKey("paymentType")) {
            queryWrapper.eq(Payment::getPaymentType, params.get("paymentType"));
        }
        
        // 状态筛选
        if (params.containsKey("status")) {
            queryWrapper.eq(Payment::getStatus, params.get("status"));
        }
        
        // 时间范围筛选
        if (params.containsKey("startDate")) {
            queryWrapper.ge(Payment::getCreateTime, params.get("startDate"));
        }
        if (params.containsKey("endDate")) {
            queryWrapper.le(Payment::getCreateTime, params.get("endDate"));
        }
        
        // 按创建时间倒序
        queryWrapper.orderByDesc(Payment::getCreateTime);
        
        // 执行分页查询
        IPage<Payment> paymentPage = paymentMapper.selectPage(page, queryWrapper);
        
        // 构建返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("records", paymentPage.getRecords());
        result.put("total", paymentPage.getTotal());
        result.put("pages", paymentPage.getPages());
        result.put("current", paymentPage.getCurrent());
        result.put("size", paymentPage.getSize());
        
        return result;
    }

    /**
     * 计算统计周期内的支付数据
     */
    private Map<String, Object> calculateStatistics(LocalDate startDate, LocalDate endDate, Integer paymentType, Integer status) {
        LambdaQueryWrapper<Payment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.ge(Payment::getCreateTime, startDate)
                .le(Payment::getCreateTime, endDate);
        
        if (paymentType != null) {
            queryWrapper.eq(Payment::getPaymentType, paymentType);
        }
        
        // 计算总订单数和总金额
        Long totalOrders = paymentMapper.selectCount(queryWrapper);
        BigDecimal totalAmount = paymentMapper.sumAmount(queryWrapper);
        
        // 计算成功支付的订单数和金额
        queryWrapper.eq(Payment::getStatus, PaymentConstants.PAYMENT_STATUS.PAID);
        Long successOrders = paymentMapper.selectCount(queryWrapper);
        BigDecimal successAmount = paymentMapper.sumAmount(queryWrapper);
        
        // 计算退款金额和退款率
        queryWrapper.eq(Payment::getStatus, PaymentConstants.PAYMENT_STATUS.REFUNDED);
        Long refundOrders = paymentMapper.selectCount(queryWrapper);
        BigDecimal refundAmount = paymentMapper.sumAmount(queryWrapper);
        
        // 计算成功率和退款率
        double successRate = totalOrders > 0 ? (double) successOrders / totalOrders * 100 : 0;
        double refundRate = totalOrders > 0 ? (double) refundOrders / totalOrders * 100 : 0;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("totalAmount", totalAmount != null ? totalAmount : BigDecimal.ZERO);
        stats.put("successRate", successRate);
        stats.put("refundAmount", refundAmount != null ? refundAmount : BigDecimal.ZERO);
        stats.put("refundRate", refundRate);
        
        return stats;
    }

    /**
     * 计算各支付方式的统计数据
     */
    private Map<Integer, Map<String, Object>> calculateMethodStatistics(LocalDate startDate, LocalDate endDate, Integer status) {
        LambdaQueryWrapper<Payment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.ge(Payment::getCreateTime, startDate)
                .le(Payment::getCreateTime, endDate);
        
        if (status != null) {
            queryWrapper.eq(Payment::getStatus, status);
        } else {
            queryWrapper.eq(Payment::getStatus, PaymentConstants.PAYMENT_STATUS.PAID);
        }
        
        // 获取所有支付方式的统计数据
        List<Map<String, Object>> methodStats = paymentMapper.groupByPaymentType(queryWrapper);
        
        Map<Integer, Map<String, Object>> result = new HashMap<>();
        for (Map<String, Object> stat : methodStats) {
            Integer paymentType = (Integer) stat.get("paymentType");
            Map<String, Object> methodData = new HashMap<>();
            methodData.put("amount", stat.get("totalAmount"));
            methodData.put("count", stat.get("count"));
            result.put(paymentType, methodData);
        }
        
        return result;
    }

    /**
     * 计算环比增长率
     */
    private Double calculateTrend(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current != null ? 
                current.subtract(previous).divide(previous, 4, BigDecimal.ROUND_HALF_UP).doubleValue() * 100 : 
                -100.0;
    }

    private Double calculateTrend(Long current, Long previous) {
        if (previous == null || previous == 0) {
            return current != null && current > 0 ? 100.0 : 0.0;
        }
        return current != null ? (double) (current - previous) / previous * 100 : -100.0;
    }

    private Double calculateTrend(Integer current, Integer previous) {
        if (previous == null || previous == 0) {
            return current != null && current > 0 ? 100.0 : 0.0;
        }
        return current != null ? (double) (current - previous) / previous * 100 : -100.0;
    }

    private Double calculateTrend(Double current, Double previous) {
        if (previous == null || previous == 0) {
            return current != null && current > 0 ? 100.0 : 0.0;
        }
        return current != null ? (current - previous) / previous * 100 : -100.0;
    }

    /**
     * 获取支付方式名称
     */
    private String getPaymentTypeName(Integer paymentType) {
        if (PaymentConstants.PAYMENT_TYPE.WECHAT_PAY.equals(paymentType)) {
            return "微信支付";
        } else if (PaymentConstants.PAYMENT_TYPE.ALIPAY.equals(paymentType)) {
            return "支付宝";
        } else if (PaymentConstants.PAYMENT_TYPE.BALANCE_PAY.equals(paymentType)) {
            return "余额支付";
        } else {
            return "其他";
        }
    }

    /**
     * 获取状态名称
     */
    private String getStatusName(Integer status) {
        if (PaymentConstants.PAYMENT_STATUS.WAITING.equals(status)) {
            return "待支付";
        } else if (PaymentConstants.PAYMENT_STATUS.PAID.equals(status)) {
            return "支付成功";
        } else if (PaymentConstants.PAYMENT_STATUS.REFUNDED.equals(status)) {
            return "已退款";
        } else {
            return "未知状态";
        }
    }
}