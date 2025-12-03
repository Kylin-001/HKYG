package com.heikeji.job.feign;

import org.springframework.stereotype.Component;

/**
 * 系统服务Feign客户端降级处理类
 * 当系统服务不可用时的降级处理
 * 
 * @author heikeji
 */
@Component
public class SystemFeignClientFallback implements SystemFeignClient {

    @Override
    public Integer cleanSystemLogs(Integer days) {
        System.out.println("系统服务不可用，无法清理日志");
        return 0;
    }

    @Override
    public Boolean executeStatistics(String date) {
        System.out.println("系统服务不可用，无法执行统计");
        return false;
    }

}
