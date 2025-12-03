package com.heikeji.job.scheduler;

import com.heikeji.job.scheduler.job.DataStatisticsJob;
import com.heikeji.job.scheduler.job.LogCleanupJob;
import com.heikeji.job.scheduler.job.OrderAutoCancelJob;
import com.heikeji.job.scheduler.job.OrderAutoConfirmJob;
import com.heikeji.job.scheduler.job.ProductStockWarningJob;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 任务初始化类
 * 在应用启动时初始化所有定时任务
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class JobInitializer implements ApplicationRunner {

    @Autowired
    private QuartzJobScheduler quartzJobScheduler;

    /**
     * 应用启动时初始化定时任务
     * 
     * @param args 应用启动参数
     */
    @Override
    public void run(ApplicationArguments args) {
        try {
            log.info("开始初始化定时任务...");
            
            // 初始化订单自动取消任务（每分钟执行一次）
            initOrderAutoCancelJob();
            
            // 初始化订单自动确认收货任务（每天凌晨1点执行）
            initOrderAutoConfirmJob();
            
            // 初始化商品库存预警任务（每天上午9点执行）
            initProductStockWarningJob();
            
            // 初始化日志清理任务（每周一凌晨3点执行）
            initLogCleanupJob();
            
            // 初始化数据统计任务（每天凌晨2点执行）
            initDataStatisticsJob();
            
            // 启动调度器
            quartzJobScheduler.startScheduler();
            
            log.info("所有定时任务初始化完成，Quartz调度器启动成功");
        } catch (Exception e) {
            log.error("初始化定时任务失败", e);
        }
    }

    /**
     * 初始化订单自动取消任务
     */
    private void initOrderAutoCancelJob() {
        try {
            String jobName = "orderAutoCancelJob";
            String jobGroup = "orderJobGroup";
            String triggerName = jobName + "Trigger";
            String triggerGroup = jobGroup;
            String cronExpression = "0 0/1 * * * ?";
            
            // 检查任务是否已存在，避免重复添加
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                quartzJobScheduler.addJob(jobName, jobGroup, triggerName, triggerGroup, 
                        OrderAutoCancelJob.class, cronExpression);
                log.info("初始化订单自动取消任务成功");
            } else {
                log.info("订单自动取消任务已存在，跳过初始化");
            }
        } catch (SchedulerException e) {
            log.error("初始化订单自动取消任务失败", e);
        }
    }

    /**
     * 初始化订单自动确认收货任务
     */
    private void initOrderAutoConfirmJob() {
        try {
            String jobName = "orderAutoConfirmJob";
            String jobGroup = "orderJobGroup";
            String triggerName = jobName + "Trigger";
            String triggerGroup = jobGroup;
            String cronExpression = "0 0 1 * * ?";
            
            // 检查任务是否已存在，避免重复添加
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                quartzJobScheduler.addJob(jobName, jobGroup, triggerName, triggerGroup, 
                        OrderAutoConfirmJob.class, cronExpression);
                log.info("初始化订单自动确认收货任务成功");
            } else {
                log.info("订单自动确认收货任务已存在，跳过初始化");
            }
        } catch (SchedulerException e) {
            log.error("初始化订单自动确认收货任务失败", e);
        }
    }

    /**
     * 初始化商品库存预警任务
     */
    private void initProductStockWarningJob() {
        try {
            String jobName = "productStockWarningJob";
            String jobGroup = "productJobGroup";
            String triggerName = jobName + "Trigger";
            String triggerGroup = jobGroup;
            String cronExpression = "0 0 9 * * ?";
            
            // 检查任务是否已存在，避免重复添加
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                quartzJobScheduler.addJob(jobName, jobGroup, triggerName, triggerGroup, 
                        ProductStockWarningJob.class, cronExpression);
                log.info("初始化商品库存预警任务成功");
            } else {
                log.info("商品库存预警任务已存在，跳过初始化");
            }
        } catch (SchedulerException e) {
            log.error("初始化商品库存预警任务失败", e);
        }
    }

    /**
     * 初始化日志清理任务
     */
    private void initLogCleanupJob() {
        try {
            String jobName = "logCleanupJob";
            String jobGroup = "systemJobGroup";
            String triggerName = jobName + "Trigger";
            String triggerGroup = jobGroup;
            String cronExpression = "0 0 3 ? * 1";
            
            // 检查任务是否已存在，避免重复添加
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                quartzJobScheduler.addJob(jobName, jobGroup, triggerName, triggerGroup, 
                        LogCleanupJob.class, cronExpression);
                log.info("初始化日志清理任务成功");
            } else {
                log.info("日志清理任务已存在，跳过初始化");
            }
        } catch (SchedulerException e) {
            log.error("初始化日志清理任务失败", e);
        }
    }

    /**
     * 初始化数据统计任务
     */
    private void initDataStatisticsJob() {
        try {
            String jobName = "dataStatisticsJob";
            String jobGroup = "statisticsJobGroup";
            String triggerName = jobName + "Trigger";
            String triggerGroup = jobGroup;
            String cronExpression = "0 0 2 * * ?";
            
            // 检查任务是否已存在，避免重复添加
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                quartzJobScheduler.addJob(jobName, jobGroup, triggerName, triggerGroup, 
                        DataStatisticsJob.class, cronExpression);
                log.info("初始化数据统计任务成功");
            } else {
                log.info("数据统计任务已存在，跳过初始化");
            }
        } catch (SchedulerException e) {
            log.error("初始化数据统计任务失败", e);
        }
    }
}
