package com.heikeji.job.controller;

import com.heikeji.job.entity.JobLog;
import com.heikeji.job.service.JobLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 任务日志控制器
 * 提供API接口用于查询和管理任务日志
 * 
 * @author heikeji
 */
@RestController
@RequestMapping("/job-log")
@Api(tags = "任务日志管理")
public class JobLogController {

    @Autowired
    private JobLogService jobLogService;

    /**
     * 根据ID查询任务日志
     * 
     * @param id 日志ID
     * @return 任务日志
     */
    @GetMapping("/{id}")
    @ApiOperation("根据ID查询任务日志")
    public ResponseEntity<JobLog> getJobLogById(@PathVariable Long id) {
        JobLog jobLog = jobLogService.getJobLogById(id);
        if (jobLog != null) {
            return ResponseEntity.ok(jobLog);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 分页查询任务日志
     * 
     * @param jobName 任务名称（可选）
     * @param jobGroup 任务组（可选）
     * @param status 执行状态（可选，0-成功，1-失败）
     * @param startTime 开始时间（可选，格式：yyyy-MM-dd HH:mm:ss）
     * @param endTime 结束时间（可选，格式：yyyy-MM-dd HH:mm:ss）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 分页结果
     */
    @GetMapping("/page")
    @ApiOperation("分页查询任务日志")
    public ResponseEntity<Map<String, Object>> pageJobLogs(
            @RequestParam(required = false) String jobName,
            @RequestParam(required = false) String jobGroup,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        try {
            // 构建查询参数
            Map<String, Object> params = new HashMap<>();
            if (jobName != null && !jobName.trim().isEmpty()) {
                params.put("jobName", jobName);
            }
            if (jobGroup != null && !jobGroup.trim().isEmpty()) {
                params.put("jobGroup", jobGroup);
            }
            if (status != null) {
                params.put("status", status);
            }
            
            // 处理时间参数
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (startTime != null && !startTime.trim().isEmpty()) {
                try {
                    params.put("startTime", sdf.parse(startTime));
                } catch (ParseException e) {
                    return ResponseEntity.badRequest().body(null);
                }
            }
            if (endTime != null && !endTime.trim().isEmpty()) {
                try {
                    params.put("endTime", sdf.parse(endTime));
                } catch (ParseException e) {
                    return ResponseEntity.badRequest().body(null);
                }
            }
            
            // 验证分页参数
            if (pageNum < 1) {
                pageNum = 1;
            }
            if (pageSize < 1 || pageSize > 100) {
                pageSize = 10;
            }
            
            // 查询分页数据
            Map<String, Object> result = jobLogService.pageJobLogs(params, pageNum, pageSize);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * 删除任务日志
     * 
     * @param ids 日志ID列表
     * @return 响应结果
     */
    @DeleteMapping("/batch")
    @ApiOperation("批量删除任务日志")
    public ResponseEntity<String> deleteJobLogs(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body("请选择要删除的日志");
        }
        
        int count = jobLogService.deleteJobLogs(ids);
        return ResponseEntity.ok("成功删除 " + count + " 条日志");
    }

    /**
     * 清理过期的任务日志
     * 
     * @param days 保留天数
     * @return 响应结果
     */
    @PostMapping("/clean")
    @ApiOperation("清理过期任务日志")
    public ResponseEntity<String> cleanJobLogs(@RequestParam(defaultValue = "30") int days) {
        if (days < 1) {
            return ResponseEntity.badRequest().body("保留天数不能小于1");
        }
        
        int count = jobLogService.cleanJobLogs(days);
        return ResponseEntity.ok("成功清理 " + count + " 条过期日志");
    }

    /**
     * 获取任务执行统计信息
     * 
     * @return 统计信息
     */
    @GetMapping("/statistics")
    @ApiOperation("获取任务执行统计信息")
    public ResponseEntity<Map<String, Object>> getJobLogStatistics() {
        try {
            Map<String, Object> statistics = jobLogService.getJobLogStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
