package com.heikeji.job.scheduler;

import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 定时任务调度类
 * 使用Spring的@Scheduled注解实现定时任务调度
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class JobScheduler {

    @Autowired
    private JobService jobService;

    /**
     * 订单自动取消任务
     * 每分钟执行一次
     */
    @Scheduled(cron = "0 0/1 * * * ?")
    public void orderAutoCancelJob() {
        jobService.executeOrderAutoCancel();
    }

    /**
     * 订单自动确认收货任务
     * 每天凌晨1点执行
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void orderAutoConfirmJob() {
        jobService.executeOrderAutoConfirm();
    }

    /**
     * 商品库存预警任务
     * 每天上午9点执行
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void productStockWarningJob() {
        jobService.executeProductStockWarning();
    }

    /**
     * 日志清理任务
     * 每周日凌晨3点执行
     */
    @Scheduled(cron = "0 0 3 ? * 1")
    public void logCleanupJob() {
        jobService.executeLogCleanup();
    }

    /**
     * 数据统计任务
     * 每天凌晨2点执行
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void dataStatisticsJob() {
        jobService.executeDataStatistics();
    }

}
