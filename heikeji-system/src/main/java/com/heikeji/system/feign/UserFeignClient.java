package com.heikeji.system.feign;

import com.heikeji.common.core.domain.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 用户服务Feign客户端
 */
@FeignClient(name = "heikeji-member", fallback = UserFeignClientFallback.class)
public interface UserFeignClient {

    /**
     * 检查用户是否存在
     */
    @GetMapping("/api/member/check")
    R<Boolean> checkUserExists(@RequestParam("userId") Long userId);

    /**
     * 获取用户统计信息
     */
    @GetMapping("/api/member/stats")
    R<Long> getUserStats();
    
    /**
     * 获取用户总数
     */
    @GetMapping("/api/member/count")
    R<Integer> getUserCount();
}
