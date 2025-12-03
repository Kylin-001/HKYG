package com.heikeji.job.feign.fallback;

import com.heikeji.job.feign.SystemFeignClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 系统服务Feign客户端降级类
 * 用于服务断开时提供降级处理
 * 
 * @author heikeji
 */
@Component
@Slf4j
public class SystemFeignClientFallback implements SystemFeignClient {

    /**
     * 清理系统日志 - 降级实现
     * 
     * @param days 清理天数
     * @return 0
     */
    @Override
    public Integer cleanSystemLogs(Integer days) {
        log.error("调用系统服务清理日志失败，执行降级处理");
        return 0;
    }

    /**
     * 执行数据统计 - 降级实现
     * 
     * @param date 统计日期
     * @return false
     */
    @Override
    public Boolean executeStatistics(String date) {
        log.error("调用系统服务执行数据统计失败，执行降级处理");
        return false;
    }
}
