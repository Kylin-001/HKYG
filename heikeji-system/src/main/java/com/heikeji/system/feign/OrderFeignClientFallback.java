package com.heikeji.system.feign;

import com.heikeji.common.core.domain.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

/**
 * 订单服务Feign客户端降级实现
 */
@Component
public class OrderFeignClientFallback implements OrderFeignClient {

    @Override
    public R<Map<String, Object>> getOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", 0);
        stats.put("totalAmount", 0.0);
        stats.put("pendingOrders", 0);
        return R.success(stats);
    }

    @Override
    public R<Integer> getUserOrderCount(Long userId) {
        return R.success(0);
    }
}
