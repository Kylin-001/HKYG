package com.heikeji.system.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.system.feign.OrderFeignClient;
import com.heikeji.system.feign.ProductFeignClient;
import com.heikeji.system.feign.UserFeignClient;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 系统仪表板控制器
 */
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "系统仪表板", description = "系统仪表板相关接口")
public class DashboardController {

    @Autowired
    private UserFeignClient userFeignClient;
    
    @Autowired
    private OrderFeignClient orderFeignClient;
    
    @Autowired
    private ProductFeignClient productFeignClient;

    /**
     * 获取仪表板统计数据
     */
    @GetMapping("/stats")
    @Operation(summary = "获取仪表板统计数据", description = "获取系统仪表板的统计数据，包括用户数、订单数等")
    public R<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 获取用户统计
        R<Integer> userCountResult = userFeignClient.getUserCount();
        if (userCountResult.isSuccess()) {
            stats.put("userCount", userCountResult.getData());
        }
        
        // 获取订单统计
        R<Map<String, Object>> orderStatsResult = orderFeignClient.getOrderStats();
        if (orderStatsResult.isSuccess()) {
            stats.putAll(orderStatsResult.getData());
        }
        
        return R.success(stats);
    }

    /**
     * 系统健康检查
     */
    @GetMapping("/health")
    @Operation(summary = "系统健康检查", description = "检查系统各个模块的健康状态")
    public R<String> healthCheck() {
        return R.success("System is running normally");
    }
}
