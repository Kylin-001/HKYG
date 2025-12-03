package com.heikeji.job.scheduler.job;

import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 数据统计任务
 * 执行系统数据统计，生成各类统计报表
 * 
 * @author heikeji
 */
@DisallowConcurrentExecution
@Slf4j
public class DataStatisticsJob implements Job {

    /**
     * 执行数据统计任务
     * 
     * @param context 任务执行上下文
     * @throws JobExecutionException 任务执行异常
     */
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("开始执行数据统计任务");
        SchedulerContext schedulerContext;
        try {
            // 从SchedulerContext获取JobService
            schedulerContext = context.getScheduler().getContext();
            JobService jobService = (JobService) schedulerContext.get("jobService");
            
            if (jobService == null) {
                throw new JobExecutionException("无法获取JobService实例");
            }
            
            // 执行数据统计业务逻辑
            jobService.executeDataStatistics();
            log.info("数据统计任务执行完成");
        } catch (SchedulerException e) {
            log.error("获取JobService失败", e);
            throw new JobExecutionException("数据统计任务执行失败", e);
        } catch (Exception e) {
            log.error("数据统计任务执行异常", e);
            throw new JobExecutionException("数据统计任务执行异常", e);
        }
    }
}
