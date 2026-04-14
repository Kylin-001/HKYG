package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.feign.OrderFeignClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 订单管理控制器
 */
@Tag(name = "订单管理")
@RestController
@RequestMapping("/api/order")
public class OrderController {
    
    @Autowired
    private OrderFeignClient orderFeignClient;

    /**
     * 分页查询订单列表
     */
    @Operation(summary = "分页查询订单列表")
    @GetMapping("/list")
    public R orderList(@Parameter(description = "查询参数，包括page、limit、orderNo、status等") @RequestParam Map<String, Object> params) {
        // 调用订单服务获取真实数据
        return orderFeignClient.orderList(params);
    }

    /**
     * 根据ID获取订单详情
     */
    @Operation(summary = "根据ID获取订单详情")
    @GetMapping("/{id}")
    public R getOrderById(@Parameter(description = "订单ID") @PathVariable("id") Long id) {
        // 调用订单服务获取真实数据
        return orderFeignClient.getOrderById(id);
    }

    /**
     * 更新订单状态
     */
    @Operation(summary = "更新订单状态")
    @PutMapping("/{id}/status")
    public R updateOrderStatus(@Parameter(description = "订单ID") @PathVariable("id") Long id, 
                              @Parameter(description = "订单状态") @RequestParam Integer status) {
        // 调用订单服务更新状态
        return orderFeignClient.updateOrderStatus(id, status);
    }

    /**
     * 取消订单
     */
    @Operation(summary = "取消订单")
    @PutMapping("/{id}/cancel")
    public R cancelOrder(@Parameter(description = "订单ID") @PathVariable("id") Long id) {
        // 调用订单服务取消订单
        return orderFeignClient.cancelOrder(id);
    }

    /**
     * 批量发货
     */
    @Operation(summary = "批量发货")
    @PutMapping("/batch/deliver")
    public R batchDeliver(@Parameter(description = "订单ID列表") @RequestBody List<Long> ids) {
        // 调用订单服务处理批量发货
        return orderFeignClient.batchDeliver(ids);
    }

    /**
     * 获取订单统计数据
     */
    @Operation(summary = "获取订单统计数据")
    @GetMapping("/stats")
    public R getOrderStats() {
        // 调用订单服务获取真实统计数据
        return orderFeignClient.getOrderStats();
    }
}