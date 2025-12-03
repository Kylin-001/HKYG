package com.heikeji.system.feign;

import com.heikeji.common.core.domain.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

/**
 * 订单服务Feign客户端
 */
@FeignClient(name = "heikeji-order", fallback = OrderFeignClientFallback.class)
public interface OrderFeignClient {

    /**
     * 获取订单统计信息
     */
    @GetMapping("/api/order/stats")
    R<Map<String, Object>> getOrderStats();

    /**
     * 根据用户ID获取订单数量
     */
    @GetMapping("/api/order/user/count")
    R<Integer> getUserOrderCount(@RequestParam("userId") Long userId);
}
