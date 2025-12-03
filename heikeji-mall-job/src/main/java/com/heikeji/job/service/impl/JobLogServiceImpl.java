package com.heikeji.job.service.impl;

import com.heikeji.job.entity.JobLog;
import com.heikeji.job.service.JobLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 任务日志服务实现类
 * 使用Redis作为临时存储，记录任务执行情况
 * 
 * @author heikeji
 */
@Service
@Slf4j
public class JobLogServiceImpl implements JobLogService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * Redis中任务日志的键前缀
     */
    private static final String JOB_LOG_KEY_PREFIX = "job:log:";

    /**
     * 任务日志列表的键
     */
    private static final String JOB_LOG_LIST_KEY = "job:log:list";

    /**
     * 任务日志的过期时间（小时）
     */
    private static final int JOB_LOG_EXPIRE_HOURS = 72;

    /**
     * 记录任务执行日志
     * 
     * @param jobLog 任务日志
     * @return 影响行数
     */
    @Override
    public int saveJobLog(JobLog jobLog) {
        try {
            // 生成唯一ID
            Long id = redisTemplate.opsForValue().increment("job:log:id");
            jobLog.setId(id);
            
            // 设置创建时间
            if (jobLog.getCreateTime() == null) {
                jobLog.setCreateTime(new Date());
            }
            
            // 计算执行时间
            if (jobLog.getStartTime() != null && jobLog.getEndTime() != null) {
                jobLog.setExecuteTime(jobLog.getEndTime().getTime() - jobLog.getStartTime().getTime());
            }
            
            // 保存日志详情
            String logKey = JOB_LOG_KEY_PREFIX + id;
            redisTemplate.opsForValue().set(logKey, jobLog, JOB_LOG_EXPIRE_HOURS, TimeUnit.HOURS);
            
            // 将日志ID添加到列表中
            redisTemplate.opsForList().leftPush(JOB_LOG_LIST_KEY, id);
            
            // 设置列表过期时间
            redisTemplate.expire(JOB_LOG_LIST_KEY, JOB_LOG_EXPIRE_HOURS, TimeUnit.HOURS);
            
            log.info("保存任务日志成功，任务名称: {}, 执行状态: {}", 
                    jobLog.getJobName(), jobLog.getStatus() == 0 ? "成功" : "失败");
            return 1;
        } catch (Exception e) {
            log.error("保存任务日志失败", e);
            // 失败时记录到本地日志
            log.error("任务日志详情: jobName={}, jobGroup={}, status={}, errorMsg={}",
                    jobLog.getJobName(), jobLog.getJobGroup(), jobLog.getStatus(), jobLog.getErrorMsg());
            return 0;
        }
    }

    /**
     * 根据ID查询任务日志
     * 
     * @param id 日志ID
     * @return 任务日志
     */
    @Override
    public JobLog getJobLogById(Long id) {
        try {
            String logKey = JOB_LOG_KEY_PREFIX + id;
            return (JobLog) redisTemplate.opsForValue().get(logKey);
        } catch (Exception e) {
            log.error("查询任务日志失败，ID: {}", id, e);
            return null;
        }
    }

    /**
     * 查询任务日志列表
     * 
     * @param params 查询参数
     * @return 任务日志列表
     */
    @Override
    public List<JobLog> listJobLogs(Map<String, Object> params) {
        try {
            // 获取所有日志ID
            List<Long> logIds = redisTemplate.opsForList().range(JOB_LOG_LIST_KEY, 0, -1)
                    .stream()
                    .map(id -> Long.valueOf(id.toString()))
                    .collect(Collectors.toList());
            
            // 查询日志详情
            List<JobLog> jobLogs = new ArrayList<>();
            for (Long id : logIds) {
                JobLog jobLog = getJobLogById(id);
                if (jobLog != null) {
                    // 应用过滤条件
                    if (applyFilter(jobLog, params)) {
                        jobLogs.add(jobLog);
                    }
                }
            }
            
            // 排序（按创建时间倒序）
            jobLogs.sort(Comparator.comparing(JobLog::getCreateTime).reversed());
            
            return jobLogs;
        } catch (Exception e) {
            log.error("查询任务日志列表失败", e);
            return new ArrayList<>();
        }
    }

    /**
     * 分页查询任务日志
     * 
     * @param params 查询参数
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 分页结果
     */
    @Override
    public Map<String, Object> pageJobLogs(Map<String, Object> params, int pageNum, int pageSize) {
        try {
            // 查询所有符合条件的日志
            List<JobLog> allLogs = listJobLogs(params);
            
            // 计算总数
            int total = allLogs.size();
            
            // 计算分页索引
            int start = (pageNum - 1) * pageSize;
            int end = Math.min(start + pageSize, total);
            
            // 获取分页数据
            List<JobLog> pageLogs = new ArrayList<>();
            if (start < total) {
                pageLogs = allLogs.subList(start, end);
            }
            
            // 构建返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("total", total);
            result.put("pageNum", pageNum);
            result.put("pageSize", pageSize);
            result.put("list", pageLogs);
            
            return result;
        } catch (Exception e) {
            log.error("分页查询任务日志失败", e);
            Map<String, Object> result = new HashMap<>();
            result.put("total", 0);
            result.put("pageNum", pageNum);
            result.put("pageSize", pageSize);
            result.put("list", new ArrayList<>());
            return result;
        }
    }

    /**
     * 删除任务日志
     * 
     * @param ids 日志ID列表
     * @return 影响行数
     */
    @Override
    public int deleteJobLogs(List<Long> ids) {
        try {
            int count = 0;
            for (Long id : ids) {
                String logKey = JOB_LOG_KEY_PREFIX + id;
                if (redisTemplate.delete(logKey)) {
                    count++;
                }
                // 从列表中移除
                redisTemplate.opsForList().remove(JOB_LOG_LIST_KEY, 0, id);
            }
            log.info("删除任务日志成功，数量: {}", count);
            return count;
        } catch (Exception e) {
            log.error("删除任务日志失败", e);
            return 0;
        }
    }

    /**
     * 清理过期的任务日志
     * 
     * @param days 保留天数
     * @return 清理数量
     */
    @Override
    public int cleanJobLogs(int days) {
        try {
            // 计算清理时间点
            long cleanTime = System.currentTimeMillis() - (long) days * 24 * 60 * 60 * 1000;
            
            // 获取所有日志ID
            List<Long> logIds = redisTemplate.opsForList().range(JOB_LOG_LIST_KEY, 0, -1)
                    .stream()
                    .map(id -> Long.valueOf(id.toString()))
                    .collect(Collectors.toList());
            
            // 清理过期日志
            int cleanCount = 0;
            for (Long id : logIds) {
                JobLog jobLog = getJobLogById(id);
                if (jobLog != null && jobLog.getCreateTime().getTime() < cleanTime) {
                    String logKey = JOB_LOG_KEY_PREFIX + id;
                    if (redisTemplate.delete(logKey)) {
                        cleanCount++;
                    }
                    // 从列表中移除
                    redisTemplate.opsForList().remove(JOB_LOG_LIST_KEY, 0, id);
                }
            }
            
            log.info("清理过期任务日志成功，数量: {}", cleanCount);
            return cleanCount;
        } catch (Exception e) {
            log.error("清理过期任务日志失败", e);
            return 0;
        }
    }

    /**
     * 获取任务执行统计信息
     * 
     * @return 统计信息
     */
    @Override
    public Map<String, Object> getJobLogStatistics() {
        try {
            // 查询最近的任务日志
            List<JobLog> jobLogs = listJobLogs(Collections.emptyMap());
            
            // 统计成功和失败的任务数量
            long successCount = jobLogs.stream().filter(log -> log.getStatus() == 0).count();
            long failCount = jobLogs.stream().filter(log -> log.getStatus() == 1).count();
            
            // 统计各任务的执行情况
            Map<String, Long> jobCountMap = jobLogs.stream()
                    .collect(Collectors.groupingBy(
                            log -> log.getJobGroup() + ":" + log.getJobName(),
                            Collectors.counting()
                    ));
            
            // 构建统计结果
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalCount", jobLogs.size());
            statistics.put("successCount", successCount);
            statistics.put("failCount", failCount);
            statistics.put("jobCountMap", jobCountMap);
            
            return statistics;
        } catch (Exception e) {
            log.error("获取任务执行统计信息失败", e);
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalCount", 0);
            statistics.put("successCount", 0);
            statistics.put("failCount", 0);
            statistics.put("jobCountMap", new HashMap<>());
            return statistics;
        }
    }

    /**
     * 应用过滤条件
     * 
     * @param jobLog 任务日志
     * @param params 查询参数
     * @return 是否符合条件
     */
    private boolean applyFilter(JobLog jobLog, Map<String, Object> params) {
        // 任务名称过滤
        if (params.containsKey("jobName")) {
            String jobName = (String) params.get("jobName");
            if (!jobLog.getJobName().contains(jobName)) {
                return false;
            }
        }
        
        // 任务组过滤
        if (params.containsKey("jobGroup")) {
            String jobGroup = (String) params.get("jobGroup");
            if (!jobLog.getJobGroup().equals(jobGroup)) {
                return false;
            }
        }
        
        // 执行状态过滤
        if (params.containsKey("status")) {
            Integer status = (Integer) params.get("status");
            if (!jobLog.getStatus().equals(status)) {
                return false;
            }
        }
        
        // 时间范围过滤
        if (params.containsKey("startTime")) {
            Date startTime = (Date) params.get("startTime");
            if (jobLog.getCreateTime().before(startTime)) {
                return false;
            }
        }
        
        if (params.containsKey("endTime")) {
            Date endTime = (Date) params.get("endTime");
            if (jobLog.getCreateTime().after(endTime)) {
                return false;
            }
        }
        
        return true;
    }
}
