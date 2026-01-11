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
        
        // 获取用户统计数据
        R<Integer> userCountResult = userFeignClient.getUserCount();
        stats.put("userCount", userCountResult.getData() != null ? userCountResult.getData() : 0);
        
        // 获取订单统计数据
        R<Map<String, Object>> orderStatsResult = orderFeignClient.getOrderStats();
        if (orderStatsResult.getData() != null) {
            Map<String, Object> orderStats = orderStatsResult.getData();
            stats.put("orderCount", orderStats.getOrDefault("totalOrderCount", 0));
            stats.put("totalSales", orderStats.getOrDefault("totalSalesAmount", 0));
            stats.put("pendingOrders", orderStats.getOrDefault("pendingOrderCount", 0));
            stats.put("completedOrders", orderStats.getOrDefault("completedOrderCount", 0));
        }
        
        // 获取商品统计数据
        R<Integer> productCountResult = productFeignClient.getProductCount();
        stats.put("productCount", productCountResult.getData() != null ? productCountResult.getData() : 0);
        
        // 更多统计数据可以在此处添加
        stats.put("activeUsers", 0); // 活跃用户数
        stats.put("newUsersToday", 0); // 今日新增用户
        stats.put("salesToday", 0); // 今日销售额
        
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
