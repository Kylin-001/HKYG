package com.heikeji.job.scheduler.job;

import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 订单自动取消任务
 * 处理超时未支付的订单，自动将其取消
 * 
 * @author heikeji
 */
@DisallowConcurrentExecution
@Slf4j
public class OrderAutoCancelJob implements Job {

    /**
     * 执行订单自动取消任务
     * 
     * @param context 任务执行上下文
     * @throws JobExecutionException 任务执行异常
     */
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("开始执行订单自动取消任务");
        SchedulerContext schedulerContext;
        try {
            // 从SchedulerContext获取JobService
            schedulerContext = context.getScheduler().getContext();
            JobService jobService = (JobService) schedulerContext.get("jobService");
            
            if (jobService == null) {
                throw new JobExecutionException("无法获取JobService实例");
            }
            
            // 执行订单自动取消业务逻辑
            jobService.executeOrderAutoCancel();
            log.info("订单自动取消任务执行完成");
        } catch (SchedulerException e) {
            log.error("获取JobService失败", e);
            throw new JobExecutionException("订单自动取消任务执行失败", e);
        } catch (Exception e) {
            log.error("订单自动取消任务执行异常", e);
            throw new JobExecutionException("订单自动取消任务执行异常", e);
        }
    }
}
