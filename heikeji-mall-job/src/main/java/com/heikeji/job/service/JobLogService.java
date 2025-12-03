package com.heikeji.job.service;

import com.heikeji.job.entity.JobLog;

import java.util.List;
import java.util.Map;

/**
 * 任务日志服务接口
 * 提供任务执行日志的记录和查询功能
 * 
 * @author heikeji
 */
public interface JobLogService {

    /**
     * 记录任务执行日志
     * 
     * @param jobLog 任务日志
     * @return 影响行数
     */
    int saveJobLog(JobLog jobLog);

    /**
     * 根据ID查询任务日志
     * 
     * @param id 日志ID
     * @return 任务日志
     */
    JobLog getJobLogById(Long id);

    /**
     * 查询任务日志列表
     * 
     * @param params 查询参数
     * @return 任务日志列表
     */
    List<JobLog> listJobLogs(Map<String, Object> params);

    /**
     * 分页查询任务日志
     * 
     * @param params 查询参数
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 分页结果
     */
    Map<String, Object> pageJobLogs(Map<String, Object> params, int pageNum, int pageSize);

    /**
     * 删除任务日志
     * 
     * @param ids 日志ID列表
     * @return 影响行数
     */
    int deleteJobLogs(List<Long> ids);

    /**
     * 清理过期的任务日志
     * 
     * @param days 保留天数
     * @return 清理数量
     */
    int cleanJobLogs(int days);

    /**
     * 获取任务执行统计信息
     * 
     * @return 统计信息
     */
    Map<String, Object> getJobLogStatistics();
}
