package com.heikeji.job.scheduler.job;

import com.heikeji.job.service.JobService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;

/**
 * 商品库存预警任务
 * 检查库存低于阈值的商品，并进行预警处理
 * 
 * @author heikeji
 */
@DisallowConcurrentExecution
@Slf4j
public class ProductStockWarningJob implements Job {

    /**
     * 执行商品库存预警任务
     * 
     * @param context 任务执行上下文
     * @throws JobExecutionException 任务执行异常
     */
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("开始执行商品库存预警任务");
        SchedulerContext schedulerContext;
        try {
            // 从SchedulerContext获取JobService
            schedulerContext = context.getScheduler().getContext();
            JobService jobService = (JobService) schedulerContext.get("jobService");
            
            if (jobService == null) {
                throw new JobExecutionException("无法获取JobService实例");
            }
            
            // 执行商品库存预警业务逻辑
            jobService.executeProductStockWarning();
            log.info("商品库存预警任务执行完成");
        } catch (SchedulerException e) {
            log.error("获取JobService失败", e);
            throw new JobExecutionException("商品库存预警任务执行失败", e);
        } catch (Exception e) {
            log.error("商品库存预警任务执行异常", e);
            throw new JobExecutionException("商品库存预警任务执行异常", e);
        }
    }
}
