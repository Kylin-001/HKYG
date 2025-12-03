package com.heikeji.common.core.cache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * 缓存预热和刷新管理器
 * 用于系统启动时预热缓存和定期刷新缓存
 *
 * @author generator
 * @date 2024-01-01
 */
@Component
public class CacheWarmUpManager implements ApplicationRunner {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private TaskScheduler taskScheduler;



    /**
     * 缓存刷新任务集合
     */
    private final Map<String, ScheduledFuture<?>> refreshTasks = new HashMap<>();

    /**
     * 初始化方法
     */
    @PostConstruct
    public void init() {
        // 可以在这里初始化一些基础配置
    }

    /**
     * 系统启动完成后执行缓存预热
     *
     * @param args 应用参数
     */
    @Override
    public void run(ApplicationArguments args) {
        // 查找所有实现了CacheWarmUpTask接口的组件并执行预热
        Map<String, CacheWarmUpTask> warmUpTasks = applicationContext.getBeansOfType(CacheWarmUpTask.class);
        warmUpTasks.forEach((name, task) -> {
            try {
                // 使用Java内置的定时器执行预热任务，避免阻塞启动
                java.util.concurrent.Executors.newSingleThreadScheduledExecutor()
                    .schedule(() -> {
                        try {
                            task.warmUp();
                        } catch (Exception e) {
                            // 记录异常但不影响启动
                            System.err.println("Cache warm-up task failed: " + name + ", error: " + e.getMessage());
                        }
                    }, 1, TimeUnit.SECONDS); // 延迟1秒执行
            } catch (Exception e) {
                System.err.println("Failed to schedule cache warm-up task: " + name + ", error: " + e.getMessage());
            }
        });
    }

    /**
     * 注册缓存刷新任务
     *
     * @param taskName 任务名称
     * @param cronExpression cron表达式
     * @param refreshTask 刷新任务
     */
    public void registerRefreshTask(String taskName, String cronExpression, Runnable refreshTask) {
        // 取消已存在的同名任务
        cancelRefreshTask(taskName);
        
        // 创建新的定时任务
        ScheduledFuture<?> future = taskScheduler.schedule(refreshTask, new CronTrigger(cronExpression));
        refreshTasks.put(taskName, future);
    }

    /**
     * 注册固定间隔的刷新任务
     *
     * @param taskName 任务名称
     * @param interval 间隔时间
     * @param timeUnit 时间单位
     * @param refreshTask 刷新任务
     */
    public void registerFixedRateTask(String taskName, long interval, TimeUnit timeUnit, Runnable refreshTask) {
        // 取消已存在的同名任务
        cancelRefreshTask(taskName);
        
        // 使用Java内置的定时任务
        ScheduledFuture<?> future = java.util.concurrent.Executors.newSingleThreadScheduledExecutor()
            .scheduleAtFixedRate(refreshTask, interval, interval, timeUnit);
        refreshTasks.put(taskName, future);
    }

    /**
     * 取消缓存刷新任务
     *
     * @param taskName 任务名称
     */
    public void cancelRefreshTask(String taskName) {
        ScheduledFuture<?> future = refreshTasks.remove(taskName);
        if (future != null) {
            future.cancel(false);
        }
    }

    /**
     * 手动触发缓存刷新
     *
     * @param taskName 任务名称
     */
    public void triggerRefreshTask(String taskName) {
        CacheWarmUpTask task = applicationContext.getBean(taskName, CacheWarmUpTask.class);
        if (task != null) {
            // 使用单线程执行，避免阻塞
            new Thread(task::warmUp).start();
        }
    }

    /**
     * 缓存预热任务接口
     * 业务模块可以实现此接口来定义自己的缓存预热逻辑
     */
    public interface CacheWarmUpTask {
        /**
         * 执行缓存预热
         */
        void warmUp();
    }

    /**
     * 获取缓存统计信息
     *
     * @return 缓存统计信息
     */
    public CacheStats getCacheStats() {
        // 返回空的统计信息，避免调用不存在的方法
        return new CacheStats();
    }

    /**
     * 缓存统计信息类
     */
    public static class CacheStats {
        private long hitCount;
        private long missCount;
        private long loadSuccessCount;
        private long loadExceptionCount;
        private long evictionCount;

        // Getters and setters
        public long getHitCount() {
            return hitCount;
        }

        public void setHitCount(long hitCount) {
            this.hitCount = hitCount;
        }

        public long getMissCount() {
            return missCount;
        }

        public void setMissCount(long missCount) {
            this.missCount = missCount;
        }

        public long getLoadSuccessCount() {
            return loadSuccessCount;
        }

        public void setLoadSuccessCount(long loadSuccessCount) {
            this.loadSuccessCount = loadSuccessCount;
        }

        public long getLoadExceptionCount() {
            return loadExceptionCount;
        }

        public void setLoadExceptionCount(long loadExceptionCount) {
            this.loadExceptionCount = loadExceptionCount;
        }

        public long getEvictionCount() {
            return evictionCount;
        }

        public void setEvictionCount(long evictionCount) {
            this.evictionCount = evictionCount;
        }

        /**
         * 获取缓存命中率
         *
         * @return 命中率
         */
        public double getHitRate() {
            long total = hitCount + missCount;
            return total == 0 ? 0.0 : (double) hitCount / total;
        }
    }
}