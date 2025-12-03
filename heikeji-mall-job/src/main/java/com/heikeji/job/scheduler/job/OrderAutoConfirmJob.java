package com.heikeji.job.scheduler.job;

import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;

/**
 * 订单自动确认收货任务
 * 处理超时未确认收货的订单，自动将其标记为已收货
 * 
 * @author heikeji
 */
@DisallowConcurrentExecution
@Slf4j
public class OrderAutoConfirmJob implements Job {

    /**
     * 执行订单自动确认收货任务
     * 
     * @param context 任务执行上下文
     * @throws JobExecutionException 任务执行异常
     */
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("开始执行订单自动确认收货任务");
        SchedulerContext schedulerContext;
        try {
            // 从SchedulerContext获取JobService
            schedulerContext = context.getScheduler().getContext();
            JobService jobService = (JobService) schedulerContext.get("jobService");
            
            if (jobService == null) {
                throw new JobExecutionException("无法获取JobService实例");
            }
            
            // 执行订单自动确认收货业务逻辑
            jobService.executeOrderAutoConfirm();
            log.info("订单自动确认收货任务执行完成");
        } catch (SchedulerException e) {
            log.error("获取JobService失败", e);
            throw new JobExecutionException("订单自动确认收货任务执行失败", e);
        } catch (Exception e) {
            log.error("订单自动确认收货任务执行异常", e);
            throw new JobExecutionException("订单自动确认收货任务执行异常", e);
        }
    }
}
