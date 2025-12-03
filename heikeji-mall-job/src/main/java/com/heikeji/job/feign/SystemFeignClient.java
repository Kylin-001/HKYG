package com.heikeji.job.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 系统服务Feign客户端
 * 用于调用系统服务的接口
 * 
 * @author heikeji
 */
@FeignClient(name = "heikeji-system", fallback = SystemFeignClientFallback.class)
public interface SystemFeignClient {

    /**
     * 清理系统日志
     * 
     * @param days 清理天数
     * @return 清理的日志数量
     */
    @PostMapping("/system/log/clean")
    Integer cleanSystemLogs(@RequestParam("days") Integer days);

    /**
     * 执行数据统计
     * 
     * @param date 统计日期，格式：yyyy-MM-dd
     * @return 统计结果
     */
    @PostMapping("/system/statistics/execute")
    Boolean executeStatistics(@RequestParam("date") String date);

}
