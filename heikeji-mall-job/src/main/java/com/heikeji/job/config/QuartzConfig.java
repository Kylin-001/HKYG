package com.heikeji.job.config;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.CronTriggerImpl;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetailImpl;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobListener;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerListener;
// import org.quartz.listeners.StdJobListener;
// import org.quartz.listeners.StdTriggerListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * Quartz定时任务配置类
 * 配置Quartz调度器的各项参数和监听器
 * 
 * @author heikeji
 */
@Configuration
public class QuartzConfig {

    @Autowired
    private JobServiceImpl jobService;

    /**
     * 创建任务监听器
     * @return 任务监听器列表
     */
    @Bean
    public List<JobListener> jobListeners() {
        List<JobListener> listeners = new ArrayList<>();
        // 添加自定义任务监听器
        listeners.add(new DefaultJobListener());
        return listeners;
    }

    /**
     * 创建触发器监听器
     * @return 触发器监听器列表
     */
    @Bean
    public List<TriggerListener> triggerListeners() {
        List<TriggerListener> listeners = new ArrayList<>();
        // 添加自定义触发器监听器
        listeners.add(new DefaultTriggerListener());
        return listeners;
    }

    /**
     * 自定义任务监听器
     */
    public static class DefaultJobListener implements JobListener {
        @Override
        public String getName() {
            return "defaultJobListener";
        }

        @Override
        public void jobToBeExecuted(JobExecutionContext context) {
            System.out.println("任务即将执行: " + context.getJobDetail().getKey());
        }

        @Override
        public void jobExecutionVetoed(JobExecutionContext context) {
            System.out.println("任务执行被否决: " + context.getJobDetail().getKey());
        }

        @Override
        public void jobWasExecuted(JobExecutionContext context, JobExecutionException jobException) {
            System.out.println("任务执行完成: " + context.getJobDetail().getKey());
            if (jobException != null) {
                System.out.println("任务执行异常: " + jobException.getMessage());
            }
        }
    }

    /**
     * 自定义触发器监听器
     */
    public static class DefaultTriggerListener implements TriggerListener {
        @Override
        public String getName() {
            return "defaultTriggerListener";
        }

        @Override
        public void triggerFired(Trigger trigger, JobExecutionContext context) {
            System.out.println("触发器触发: " + trigger.getKey());
        }

        @Override
        public boolean vetoJobExecution(Trigger trigger, JobExecutionContext context) {
            return false;
        }

        @Override
        public void triggerMisfired(Trigger trigger) {
            System.out.println("触发器错误触发: " + trigger.getKey());
        }

        @Override
        public void triggerComplete(Trigger trigger, JobExecutionContext context, Trigger.CompletedExecutionInstruction triggerInstructionCode) {
            System.out.println("触发器执行完成: " + trigger.getKey());
        }
    }

    /**
     * 配置SchedulerFactoryBean
     * 
     * @param dataSource 数据源（可选，内置模式下不需要）
     * @return SchedulerFactoryBean
     */
    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(DataSource dataSource, 
                                                    List<JobListener> jobListeners, 
                                                    List<TriggerListener> triggerListeners) {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        
        // 任务存储方式为数据库时设置数据源
        if (dataSource != null) {
            factory.setDataSource(dataSource);
        }
        
        // 延时启动，应用启动3秒后初始化
        factory.setStartupDelay(3);
        
        // 允许覆盖已存在的任务
        factory.setOverwriteExistingJobs(true);
        
        // 注册触发器监听器
        factory.setGlobalTriggerListeners(triggerListeners.toArray(new TriggerListener[0]));
        
        // 注册任务监听器
        factory.setGlobalJobListeners(jobListeners.toArray(new JobListener[0]));
        
        // 配置Quartz属性
        factory.setQuartzProperties(quartzProperties());
        
        // 添加关闭钩子插件，确保应用优雅关闭时任务能够正确终止
        factory.setWaitForJobsToCompleteOnShutdown(true);
        
        return factory;
    }

    /**
     * 配置Quartz属性
     * @return Quartz属性
     */
    private Properties quartzProperties() {
        Properties properties = new Properties();
        // 线程池配置
        properties.setProperty("org.quartz.threadPool.threadCount", "10");
        properties.setProperty("org.quartz.threadPool.threadPriority", "5");
        properties.setProperty("org.quartz.threadPool.threadsInheritContextClassLoaderOfInitializingThread", "true");
        
        // 调度器配置
        properties.setProperty("org.quartz.scheduler.instanceId", "AUTO");
        properties.setProperty("org.quartz.scheduler.makeSchedulerThreadDaemon", "true");
        
        // 作业存储配置
        properties.setProperty("org.quartz.jobStore.misfireThreshold", "60000");
        
        return properties;
    }

    /**
     * 配置外卖柜超时释放定时任务
     * 每小时执行一次释放超时占用的外卖柜
     * 
     * @param scheduler 调度器
     * @throws SchedulerException 调度器异常
     */
    @Bean
    public void configureDeliveryLockerTimeoutJob(Scheduler scheduler) throws SchedulerException {
        JobDetailImpl jobDetail = new JobDetailImpl();
        jobDetail.setName("deliveryLockerTimeoutJob");
        jobDetail.setGroup("takeoutJobs");
        jobDetail.setJobClass(DeliveryLockerTimeoutJob.class);
        jobDetail.setDurability(true);
        
        // 设置定时任务执行的执行类
        jobDetail.getJobDataMap().put("jobService", jobService);
        
        // 创建Cron触发器，每小时执行一次
        CronTriggerImpl trigger = new CronTriggerImpl();
        trigger.setName("deliveryLockerTimeoutTrigger");
        trigger.setGroup("takeoutTriggers");
        trigger.setJobGroup("takeoutJobs");
        trigger.setJobName("deliveryLockerTimeoutJob");
        trigger.setCronExpression("0 0 * * * ?"); // 每小时00分执行
        
        // 添加到调度器
        scheduler.scheduleJob(jobDetail, trigger);
        
        System.out.println("外卖柜超时释放定时任务配置完成：每00分执行一次");
    }

    /**
     * 外卖柜超时释放定时任务类
     */
    public static class DeliveryLockerTimeoutJob implements Job {
        
        @Autowired
        private JobServiceImpl jobService;
        
        @Override
        public void execute(JobExecutionContext context) throws JobExecutionException {
            if (jobService != null) {
                try {
                    System.out.println("开始执行外卖柜超时释放任务");
                    jobService.executeDeliveryLockerTimeoutRelease();
                } catch (Exception e) {
                    System.err.println("外卖柜超时释放任务执行异常：" + e.getMessage());
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 创建Scheduler实例
     * 
     * @param schedulerFactoryBean Scheduler工厂
     * @return Scheduler
     */
    @Bean
    public Scheduler scheduler(SchedulerFactoryBean schedulerFactoryBean) {
        return schedulerFactoryBean.getScheduler();
    }

}
