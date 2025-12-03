package com.heikeji.job.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Quartz定时任务调度器
 * 提供动态添加、修改、删除和查询任务的功能
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class QuartzJobScheduler {

    @Autowired
    private Scheduler scheduler;

    /**
     * 添加定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @param jobClass 任务类
     * @param cronExpression  cron表达式
     * @param jobDataMap 任务参数
     * @throws SchedulerException 调度器异常
     */
    public void addJob(String jobName, String jobGroup, String triggerName, String triggerGroup,
                      Class<? extends Job> jobClass, String cronExpression, JobDataMap jobDataMap)
            throws SchedulerException {
        // 创建JobDetail
        JobDetail jobDetail = JobBuilder.newJob(jobClass)
                .withIdentity(jobName, jobGroup)
                .setJobData(jobDataMap)
                .build();

        // 创建CronTrigger
        CronTrigger trigger = TriggerBuilder.newTrigger()
                .withIdentity(triggerName, triggerGroup)
                .withSchedule(CronScheduleBuilder.cronSchedule(cronExpression))
                .build();

        // 调度任务
        scheduler.scheduleJob(jobDetail, trigger);
        log.info("添加定时任务成功: jobName={}, jobGroup={}, triggerName={}, triggerGroup={}",
                jobName, jobGroup, triggerName, triggerGroup);
    }

    /**
     * 添加定时任务（无参数）
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @param jobClass 任务类
     * @param cronExpression cron表达式
     * @throws SchedulerException 调度器异常
     */
    public void addJob(String jobName, String jobGroup, String triggerName, String triggerGroup,
                      Class<? extends Job> jobClass, String cronExpression)
            throws SchedulerException {
        addJob(jobName, jobGroup, triggerName, triggerGroup, jobClass, cronExpression, new JobDataMap());
    }

    /**
     * 更新定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @param cronExpression cron表达式
     * @throws SchedulerException 调度器异常
     */
    public void updateJob(String jobName, String jobGroup, String triggerName, String triggerGroup,
                         String cronExpression)
            throws SchedulerException {
        // 获取触发器
        TriggerKey triggerKey = TriggerKey.triggerKey(triggerName, triggerGroup);
        CronTrigger trigger = (CronTrigger) scheduler.getTrigger(triggerKey);

        if (trigger != null) {
            // 更新触发器的cron表达式
            CronScheduleBuilder scheduleBuilder = CronScheduleBuilder.cronSchedule(cronExpression);
            trigger = trigger.getTriggerBuilder()
                    .withSchedule(scheduleBuilder)
                    .build();

            // 重新调度任务
            scheduler.rescheduleJob(triggerKey, trigger);
            log.info("更新定时任务成功: jobName={}, jobGroup={}, triggerName={}, triggerGroup={}",
                    jobName, jobGroup, triggerName, triggerGroup);
        }
    }

    /**
     * 删除定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @throws SchedulerException 调度器异常
     */
    public void deleteJob(String jobName, String jobGroup, String triggerName, String triggerGroup)
            throws SchedulerException {
        // 停止触发器
        TriggerKey triggerKey = TriggerKey.triggerKey(triggerName, triggerGroup);
        scheduler.pauseTrigger(triggerKey);
        // 删除触发器
        scheduler.unscheduleJob(triggerKey);
        // 删除任务
        JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
        scheduler.deleteJob(jobKey);
        log.info("删除定时任务成功: jobName={}, jobGroup={}", jobName, jobGroup);
    }

    /**
     * 暂停定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @throws SchedulerException 调度器异常
     */
    public void pauseJob(String jobName, String jobGroup) throws SchedulerException {
        JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
        scheduler.pauseJob(jobKey);
        log.info("暂停定时任务成功: jobName={}, jobGroup={}", jobName, jobGroup);
    }

    /**
     * 恢复定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @throws SchedulerException 调度器异常
     */
    public void resumeJob(String jobName, String jobGroup) throws SchedulerException {
        JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
        scheduler.resumeJob(jobKey);
        log.info("恢复定时任务成功: jobName={}, jobGroup={}", jobName, jobGroup);
    }

    /**
     * 立即执行定时任务（不影响原有调度计划）
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @throws SchedulerException 调度器异常
     */
    public void triggerJob(String jobName, String jobGroup) throws SchedulerException {
        JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
        scheduler.triggerJob(jobKey);
        log.info("立即执行定时任务成功: jobName={}, jobGroup={}", jobName, jobGroup);
    }

    /**
     * 检查任务是否存在
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @return 是否存在
     * @throws SchedulerException 调度器异常
     */
    public boolean checkJobExists(String jobName, String jobGroup) throws SchedulerException {
        JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
        return scheduler.checkExists(jobKey);
    }

    /**
     * 启动调度器
     * 
     * @throws SchedulerException 调度器异常
     */
    public void startScheduler() throws SchedulerException {
        if (!scheduler.isStarted()) {
            scheduler.start();
            log.info("Quartz调度器启动成功");
        }
    }

    /**
     * 关闭调度器
     * 
     * @param waitForJobsToComplete 是否等待任务完成
     * @throws SchedulerException 调度器异常
     */
    public void shutdownScheduler(boolean waitForJobsToComplete) throws SchedulerException {
        if (!scheduler.isShutdown()) {
            scheduler.shutdown(waitForJobsToComplete);
            log.info("Quartz调度器关闭成功，等待任务完成: {}", waitForJobsToComplete);
        }
    }

    /**
     * 获取任务下次执行时间
     * 
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @return 下次执行时间
     * @throws SchedulerException 调度器异常
     */
    public Date getNextFireTime(String triggerName, String triggerGroup) throws SchedulerException {
        TriggerKey triggerKey = TriggerKey.triggerKey(triggerName, triggerGroup);
        Trigger trigger = scheduler.getTrigger(triggerKey);
        if (trigger != null) {
            return trigger.getNextFireTime();
        }
        return null;
    }
}
