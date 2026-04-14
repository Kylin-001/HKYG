package com.heikeji.mall.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 数据插入异步处理配置
 *
 * 配置专用的线程池用于异步批量插入操作，
 * 避免影响主业务线程。
 */
@Slf4j
@Configuration
public class DataInsertAsyncConfig {

    @Autowired
    private DataInsertProperties properties;

    /**
     * 数据插入专用异步线程池
     */
    @Bean(name = "taskExecutor")
    @ConditionalOnProperty(prefix = "data-insert.batch.async", name = "enabled", havingValue = "true")
    Executor taskExecutor() {
        DataInsertProperties.BatchConfig.AsyncConfig asyncConfig =
                properties.getBatch().getAsync();

        log.info("初始化数据插入异步线程池, 核心线程数={}, 最大线程数={}, 队列容量={}",
                asyncConfig.getThreadPoolCoreSize(),
                asyncConfig.getThreadPoolMaxSize(),
                asyncConfig.getThreadPoolQueueCapacity());

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(asyncConfig.getThreadPoolCoreSize());
        executor.setMaxPoolSize(asyncConfig.getThreadPoolMaxSize());
        executor.setQueueCapacity(asyncConfig.getThreadPoolQueueCapacity());
        executor.setKeepAliveSeconds(asyncConfig.getThreadPoolKeepAliveSeconds());
        executor.setThreadNamePrefix("DataInsertAsync-");

        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();

        log.info("✅ 数据插入异步线程池创建成功");
        return executor;
    }
}
