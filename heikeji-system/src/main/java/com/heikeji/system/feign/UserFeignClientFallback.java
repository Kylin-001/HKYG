package com.heikeji.system.feign;

import com.heikeji.common.core.domain.R;
import org.springframework.stereotype.Component;

/**
 * 用户服务Feign客户端降级实现
 */
@Component
public class UserFeignClientFallback implements UserFeignClient {

    @Override
    public R<Boolean> checkUserExists(Long userId) {
        return R.success(false);
    }

    @Override
    public R<Long> getUserStats() {
        return R.success(0L);
    }

    @Override
    public R<Integer> getUserCount() {
        return R.success(0);
    }
}
