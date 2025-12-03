package com.heikeji.job.service.impl;

import com.heikeji.job.entity.JobLog;
import com.heikeji.job.feign.OrderFeignClient;
import com.heikeji.job.feign.ProductFeignClient;
import com.heikeji.job.feign.SystemFeignClient;
import com.heikeji.job.service.JobLogService;
import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 定时任务服务实现类
 * 
 * @author heikeji
 */
@Service
@Slf4j
public class JobServiceImpl implements JobService {

    @Value("${job.orderAutoCancel}")
    private Integer orderAutoCancelMinutes;

    @Value("${job.orderAutoConfirm}")
    private Integer orderAutoConfirmDays;

    @Value("${job.logCleanup}")
    private Integer logCleanupDays;

    // 默认库存预警阈值
    private static final Integer DEFAULT_STOCK_WARNING_THRESHOLD = 10;

    @Autowired
    private OrderFeignClient orderFeignClient;

    @Autowired
    private ProductFeignClient productFeignClient;

    @Autowired
    private SystemFeignClient systemFeignClient;

    @Autowired
    private JobLogService jobLogService;

    /**
     * 执行订单自动取消任务
     * 取消超时未支付的订单
     */
    @Override
    public void executeOrderAutoCancel() {
        JobLog jobLog = new JobLog();
        jobLog.setJobName("订单自动取消任务");
        jobLog.setJobGroup("orderJobGroup");
        jobLog.setJobParams("{\"orderAutoCancelMinutes\": " + orderAutoCancelMinutes + "}");
        jobLog.setStartTime(new Date());
        jobLog.setStatus(0); // 默认成功
        log.info("开始执行订单自动取消任务，超时时间: {}分钟", orderAutoCancelMinutes);
        try {
            Integer result = orderFeignClient.cancelTimeoutOrders(orderAutoCancelMinutes);
            jobLog.setResult("成功取消" + result + "个超时订单");
            log.info("订单自动取消任务执行完成，成功取消{}个超时订单", result);
        } catch (Exception e) {
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(e.getMessage());
            log.error("订单自动取消任务执行失败", e);
        } finally {
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            try {
                jobLogService.saveJobLog(jobLog);
            } catch (Exception e) {
                log.error("保存任务日志失败", e);
            }
        }
    }

    /**
     * 执行订单自动确认收货任务
     * 自动确认超时未收货的订单
     */
    @Override
    public void executeOrderAutoConfirm() {
        JobLog jobLog = new JobLog();
        jobLog.setJobName("订单自动确认收货任务");
        jobLog.setJobGroup("orderJobGroup");
        jobLog.setJobParams("{\"orderAutoConfirmDays\": " + orderAutoConfirmDays + "}");
        jobLog.setStartTime(new Date());
        jobLog.setStatus(0); // 默认成功
        log.info("开始执行订单自动确认收货任务，超时时间: {}天", orderAutoConfirmDays);
        try {
            Integer result = orderFeignClient.confirmTimeoutOrders(orderAutoConfirmDays);
            jobLog.setResult("成功确认收货" + result + "个超时订单");
            log.info("订单自动确认收货任务执行完成，成功确认收货{}个超时订单", result);
        } catch (Exception e) {
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(e.getMessage());
            log.error("订单自动确认收货任务执行失败", e);
        } finally {
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            try {
                jobLogService.saveJobLog(jobLog);
            } catch (Exception e) {
                log.error("保存任务日志失败", e);
            }
        }
    }

    /**
     * 执行商品库存预警任务
     * 检查库存不足的商品并发送预警
     */
    @Override
    public void executeProductStockWarning() {
        JobLog jobLog = new JobLog();
        jobLog.setJobName("商品库存预警任务");
        jobLog.setJobGroup("productJobGroup");
        jobLog.setJobParams("{\"warningThreshold\": " + DEFAULT_STOCK_WARNING_THRESHOLD + "}");
        jobLog.setStartTime(new Date());
        jobLog.setStatus(0); // 默认成功
        log.info("开始执行商品库存预警任务，预警阈值: {}", DEFAULT_STOCK_WARNING_THRESHOLD);
        try {
            Integer result = productFeignClient.checkStockWarning(DEFAULT_STOCK_WARNING_THRESHOLD);
            jobLog.setResult("发现" + result + "个库存不足商品");
            log.info("商品库存预警任务执行完成，发现{}个库存不足商品", result);
        } catch (Exception e) {
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(e.getMessage());
            log.error("商品库存预警任务执行失败", e);
        } finally {
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            try {
                jobLogService.saveJobLog(jobLog);
            } catch (Exception e) {
                log.error("保存任务日志失败", e);
            }
        }
    }

    /**
     * 执行日志清理任务
     * 清理超过指定天数的日志
     */
    @Override
    public void executeLogCleanup() {
        JobLog jobLog = new JobLog();
        jobLog.setJobName("日志清理任务");
        jobLog.setJobGroup("systemJobGroup");
        jobLog.setJobParams("{\"logCleanupDays\": " + logCleanupDays + "}");
        jobLog.setStartTime(new Date());
        jobLog.setStatus(0); // 默认成功
        log.info("开始执行日志清理任务，清理{}天前的日志", logCleanupDays);
        try {
            Integer result = systemFeignClient.cleanSystemLogs(logCleanupDays);
            jobLog.setResult("成功清理" + result + "条日志");
            log.info("日志清理任务执行完成，成功清理{}条日志", result);
        } catch (Exception e) {
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(e.getMessage());
            log.error("日志清理任务执行失败", e);
        } finally {
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            try {
                jobLogService.saveJobLog(jobLog);
            } catch (Exception e) {
                log.error("保存任务日志失败", e);
            }
        }
    }

    /**
     * 执行数据统计任务
     * 统计订单、销售等数据
     */
    @Override
    public void executeDataStatistics() {
        JobLog jobLog = new JobLog();
        jobLog.setJobName("数据统计任务");
        jobLog.setJobGroup("statisticsJobGroup");
        jobLog.setStartTime(new Date());
        jobLog.setStatus(0); // 默认成功
        log.info("开始执行数据统计任务");
        try {
            // 获取前一天的日期
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date yesterday = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
            String date = sdf.format(yesterday);
            
            jobLog.setJobParams("{\"date\": \"" + date + "\"}");
            
            Boolean result = systemFeignClient.executeStatistics(date);
            jobLog.setResult("数据统计执行" + (result ? "成功" : "失败"));
            log.info("数据统计任务执行完成，统计日期: {}，执行结果: {}", date, result);
        } catch (Exception e) {
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(e.getMessage());
            log.error("数据统计任务执行失败", e);
        } finally {
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            try {
                jobLogService.saveJobLog(jobLog);
            } catch (Exception e) {
                log.error("保存任务日志失败", e);
            }
        }
    }

    /**
     * 执行外卖柜超时释放任务
     * 释放超时未取货的外卖柜格子
     */
    @Override
    public void executeDeliveryLockerTimeoutRelease() {
        JobLog jobLog = new JobLog();
        jobLog.setJobName("外卖柜超时释放任务");
        jobLog.setJobGroup("takeoutJobGroup");
        jobLog.setStartTime(new Date());
        jobLog.setStatus(0); // 默认成功
        
        // 默认超时时间为2小时
        Integer timeoutHours = 2;
        jobLog.setJobParams("{\"timeoutHours\": " + timeoutHours + "}");
        
        log.info("开始执行外卖柜超时释放任务，超时时间: {}小时", timeoutHours);
        try {
            Integer result = orderFeignClient.releaseTimeoutLockers(timeoutHours);
            jobLog.setResult("成功释放" + result + "个超时外卖柜");
            log.info("外卖柜超时释放任务执行完成，成功释放{}个超时外卖柜", result);
        } catch (Exception e) {
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(e.getMessage());
            log.error("外卖柜超时释放任务执行失败", e);
        } finally {
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            try {
                jobLogService.saveJobLog(jobLog);
            } catch (Exception e) {
                log.error("保存任务日志失败", e);
            }
        }
    }
}
