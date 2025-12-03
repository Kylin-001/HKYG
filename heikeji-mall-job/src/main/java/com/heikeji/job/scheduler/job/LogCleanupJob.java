package com.heikeji.job.scheduler.job;

import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;

/**
 * 日志清理任务
 * 清理指定天数之前的系统日志，优化数据库性能
 * 
 * @author heikeji
 */
@DisallowConcurrentExecution
@Slf4j
public class LogCleanupJob implements Job {

    /**
     * 执行日志清理任务
     * 
     * @param context 任务执行上下文
     * @throws JobExecutionException 任务执行异常
     */
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("开始执行日志清理任务");
        SchedulerContext schedulerContext;
        try {
            // 从SchedulerContext获取JobService
            schedulerContext = context.getScheduler().getContext();
            JobService jobService = (JobService) schedulerContext.get("jobService");
            
            if (jobService == null) {
                throw new JobExecutionException("无法获取JobService实例");
            }
            
            // 执行日志清理业务逻辑
            jobService.executeLogCleanup();
            log.info("日志清理任务执行完成");
        } catch (SchedulerException e) {
            log.error("获取JobService失败", e);
            throw new JobExecutionException("日志清理任务执行失败", e);
        } catch (Exception e) {
            log.error("日志清理任务执行异常", e);
            throw new JobExecutionException("日志清理任务执行异常", e);
        }
    }
}
