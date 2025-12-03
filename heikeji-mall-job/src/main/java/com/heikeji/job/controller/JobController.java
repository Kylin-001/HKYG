package com.heikeji.job.controller;

import com.heikeji.job.scheduler.QuartzJobScheduler;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobDataMap;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

/**
 * 任务管理控制器
 * 提供RESTful API接口用于管理定时任务
 * 
 * @author heikeji
 */
@RestController
@RequestMapping("/job")
@Api(tags = "任务管理")
@Slf4j
public class JobController {

    @Autowired
    private QuartzJobScheduler quartzJobScheduler;

    /**
     * 添加定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @param jobClassName 任务类全限定名
     * @param cronExpression cron表达式
     * @return 响应结果
     */
    @PostMapping("/add")
    @ApiOperation("添加定时任务")
    public ResponseEntity<String> addJob(@RequestParam String jobName,
                                        @RequestParam String jobGroup,
                                        @RequestParam String triggerName,
                                        @RequestParam String triggerGroup,
                                        @RequestParam String jobClassName,
                                        @RequestParam String cronExpression) {
        try {
            // 验证cron表达式和任务类
            if (!isValidCronExpression(cronExpression)) {
                return ResponseEntity.badRequest().body("无效的cron表达式");
            }

            // 加载任务类
            Class<?> jobClass;
            try {
                jobClass = Class.forName(jobClassName);
                if (!org.quartz.Job.class.isAssignableFrom(jobClass)) {
                    return ResponseEntity.badRequest().body("任务类必须实现org.quartz.Job接口");
                }
            } catch (ClassNotFoundException e) {
                return ResponseEntity.badRequest().body("找不到指定的任务类: " + jobClassName);
            }

            // 添加任务
            quartzJobScheduler.addJob(jobName, jobGroup, triggerName, triggerGroup,
                    jobClass.asSubclass(org.quartz.Job.class), cronExpression, new JobDataMap());
            
            return ResponseEntity.ok("添加定时任务成功");
        } catch (SchedulerException e) {
            log.error("添加定时任务失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("添加定时任务失败: " + e.getMessage());
        }
    }

    /**
     * 更新定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @param cronExpression cron表达式
     * @return 响应结果
     */
    @PostMapping("/update")
    @ApiOperation("更新定时任务")
    public ResponseEntity<String> updateJob(@RequestParam String jobName,
                                          @RequestParam String jobGroup,
                                          @RequestParam String triggerName,
                                          @RequestParam String triggerGroup,
                                          @RequestParam String cronExpression) {
        try {
            // 验证cron表达式
            if (!isValidCronExpression(cronExpression)) {
                return ResponseEntity.badRequest().body("无效的cron表达式");
            }

            // 验证任务是否存在
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                return ResponseEntity.badRequest().body("任务不存在");
            }

            // 更新任务
            quartzJobScheduler.updateJob(jobName, jobGroup, triggerName, triggerGroup, cronExpression);
            
            return ResponseEntity.ok("更新定时任务成功");
        } catch (SchedulerException e) {
            log.error("更新定时任务失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("更新定时任务失败: " + e.getMessage());
        }
    }

    /**
     * 删除定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @return 响应结果
     */
    @PostMapping("/delete")
    @ApiOperation("删除定时任务")
    public ResponseEntity<String> deleteJob(@RequestParam String jobName,
                                          @RequestParam String jobGroup,
                                          @RequestParam String triggerName,
                                          @RequestParam String triggerGroup) {
        try {
            // 验证任务是否存在
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                return ResponseEntity.badRequest().body("任务不存在");
            }

            // 删除任务
            quartzJobScheduler.deleteJob(jobName, jobGroup, triggerName, triggerGroup);
            
            return ResponseEntity.ok("删除定时任务成功");
        } catch (SchedulerException e) {
            log.error("删除定时任务失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("删除定时任务失败: " + e.getMessage());
        }
    }

    /**
     * 暂停定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @return 响应结果
     */
    @PostMapping("/pause")
    @ApiOperation("暂停定时任务")
    public ResponseEntity<String> pauseJob(@RequestParam String jobName,
                                         @RequestParam String jobGroup) {
        try {
            // 验证任务是否存在
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                return ResponseEntity.badRequest().body("任务不存在");
            }

            // 暂停任务
            quartzJobScheduler.pauseJob(jobName, jobGroup);
            
            return ResponseEntity.ok("暂停定时任务成功");
        } catch (SchedulerException e) {
            log.error("暂停定时任务失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("暂停定时任务失败: " + e.getMessage());
        }
    }

    /**
     * 恢复定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @return 响应结果
     */
    @PostMapping("/resume")
    @ApiOperation("恢复定时任务")
    public ResponseEntity<String> resumeJob(@RequestParam String jobName,
                                          @RequestParam String jobGroup) {
        try {
            // 验证任务是否存在
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                return ResponseEntity.badRequest().body("任务不存在");
            }

            // 恢复任务
            quartzJobScheduler.resumeJob(jobName, jobGroup);
            
            return ResponseEntity.ok("恢复定时任务成功");
        } catch (SchedulerException e) {
            log.error("恢复定时任务失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("恢复定时任务失败: " + e.getMessage());
        }
    }

    /**
     * 立即执行定时任务
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @return 响应结果
     */
    @PostMapping("/trigger")
    @ApiOperation("立即执行定时任务")
    public ResponseEntity<String> triggerJob(@RequestParam String jobName,
                                           @RequestParam String jobGroup) {
        try {
            // 验证任务是否存在
            if (!quartzJobScheduler.checkJobExists(jobName, jobGroup)) {
                return ResponseEntity.badRequest().body("任务不存在");
            }

            // 立即执行任务
            quartzJobScheduler.triggerJob(jobName, jobGroup);
            
            return ResponseEntity.ok("立即执行定时任务成功");
        } catch (SchedulerException e) {
            log.error("立即执行定时任务失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("立即执行定时任务失败: " + e.getMessage());
        }
    }

    /**
     * 检查任务是否存在
     * 
     * @param jobName 任务名称
     * @param jobGroup 任务组
     * @return 响应结果
     */
    @GetMapping("/check")
    @ApiOperation("检查任务是否存在")
    public ResponseEntity<Boolean> checkJob(@RequestParam String jobName,
                                          @RequestParam String jobGroup) {
        try {
            boolean exists = quartzJobScheduler.checkJobExists(jobName, jobGroup);
            return ResponseEntity.ok(exists);
        } catch (SchedulerException e) {
            log.error("检查任务是否存在失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    /**
     * 获取任务下次执行时间
     * 
     * @param triggerName 触发器名称
     * @param triggerGroup 触发器组
     * @return 响应结果
     */
    @GetMapping("/next-fire-time")
    @ApiOperation("获取任务下次执行时间")
    public ResponseEntity<String> getNextFireTime(@RequestParam String triggerName,
                                                @RequestParam String triggerGroup) {
        try {
            Date nextFireTime = quartzJobScheduler.getNextFireTime(triggerName, triggerGroup);
            if (nextFireTime != null) {
                return ResponseEntity.ok(nextFireTime.toString());
            } else {
                return ResponseEntity.ok("暂无下次执行时间");
            }
        } catch (SchedulerException e) {
            log.error("获取任务下次执行时间失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("获取任务下次执行时间失败: " + e.getMessage());
        }
    }

    /**
     * 验证cron表达式是否有效
     * 
     * @param cronExpression cron表达式
     * @return 是否有效
     */
    private boolean isValidCronExpression(String cronExpression) {
        try {
            // 简单验证cron表达式格式
            if (cronExpression == null || cronExpression.trim().isEmpty()) {
                return false;
            }
            
            // 使用Quartz的CronExpression验证
            org.quartz.CronExpression.validateExpression(cronExpression);
            return true;
        } catch (Exception e) {
            log.warn("无效的cron表达式 {}", cronExpression, e);
            return false;
        }
    }
}
