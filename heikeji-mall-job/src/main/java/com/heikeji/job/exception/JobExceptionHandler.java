package com.heikeji.job.exception;

import com.heikeji.job.entity.JobLog;
import com.heikeji.job.service.JobLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 定时任务异常处理器
 * 统一处理任务执行过程中的异常，记录日志并进行必要的恢复处理
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class JobExceptionHandler {

    @Autowired
    private JobLogService jobLogService;

    /**
     * 处理任务执行异常
     * 
     * @param jobName     任务名称
     * @param jobGroup    任务组名
     * @param jobParams   任务参数
     * @param startTime   任务开始时间
     * @param exception   异常对象
     */
    public void handleException(String jobName, String jobGroup, String jobParams, Date startTime, Exception exception) {
        log.error("任务执行异常，任务名称: {}, 任务组: {}", jobName, jobGroup, exception);
        
        // 记录任务执行日志
        try {
            JobLog jobLog = new JobLog();
            jobLog.setJobName(jobName);
            jobLog.setJobGroup(jobGroup);
            jobLog.setJobParams(jobParams);
            jobLog.setStartTime(startTime);
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            jobLog.setStatus(1); // 执行失败
            jobLog.setErrorMsg(exception.getMessage());
            jobLog.setResult("任务执行失败: " + exception.getMessage());
            
            jobLogService.saveJobLog(jobLog);
        } catch (Exception e) {
            log.error("保存任务异常日志失败", e);
        }
        
        // 这里可以添加额外的异常处理逻辑，如：
        // 1. 发送告警通知
        // 2. 触发失败重试机制
        // 3. 其他业务恢复逻辑
    }

    /**
     * 记录任务执行成功日志
     * 
     * @param jobName     任务名称
     * @param jobGroup    任务组名
     * @param jobParams   任务参数
     * @param startTime   任务开始时间
     * @param result      执行结果
     */
    public void recordSuccessLog(String jobName, String jobGroup, String jobParams, Date startTime, String result) {
        try {
            JobLog jobLog = new JobLog();
            jobLog.setJobName(jobName);
            jobLog.setJobGroup(jobGroup);
            jobLog.setJobParams(jobParams);
            jobLog.setStartTime(startTime);
            jobLog.setEndTime(new Date());
            jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            jobLog.setStatus(0); // 执行成功
            jobLog.setResult(result);
            
            jobLogService.saveJobLog(jobLog);
        } catch (Exception e) {
            log.error("保存任务成功日志失败", e);
        }
    }
}
