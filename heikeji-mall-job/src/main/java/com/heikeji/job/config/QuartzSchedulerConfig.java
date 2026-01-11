package com.heikeji.job.config;

import com.heikeji.job.service.JobService;
import org.quartz.Scheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

/**
 * Quartz调度器配置类
 * 用于将JobService注册到SchedulerContext中，供Quartz任务使用
 * 
 * @author heikeji
 */
@Configuration
public class QuartzSchedulerConfig {

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private JobService jobService;

    /**
     * 初始化时将JobService注册到SchedulerContext
     */
    @PostConstruct
    public void init() {
        try {
            // 将JobService注册到SchedulerContext中
            scheduler.getContext().put("jobService", jobService);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Quartz scheduler context", e);
        }
    }

}
