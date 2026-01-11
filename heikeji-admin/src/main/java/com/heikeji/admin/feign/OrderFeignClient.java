package com.heikeji.admin.feign;

import com.heikeji.admin.common.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 订单服务Feign客户端
 * 用于后台管理系统调用订单服务的管理接口
 */
@FeignClient(name = "heikeji-order")
public interface OrderFeignClient {
    
    /**
     * 分页查询订单列表
     */
    @GetMapping("/api/order/list")
    R orderList(@RequestParam Map<String, Object> params);
    
    /**
     * 根据ID获取订单详情
     */
    @GetMapping("/api/order/{id}")
    R getOrderById(@PathVariable("id") Long id);
    
    /**
     * 更新订单状态
     */
    @PutMapping("/api/order/{id}/status")
    R updateOrderStatus(@PathVariable("id") Long id, @RequestParam Integer status);
    
    /**
     * 取消订单
     */
    @PutMapping("/api/order/{id}/cancel")
    R cancelOrder(@PathVariable("id") Long id);
    
    /**
     * 批量发货
     */
    @PutMapping("/api/order/batch/deliver")
    R batchDeliver(@RequestBody List<Long> ids);
    
    /**
     * 获取订单统计数据
     */
    @GetMapping("/api/order/stats")
    R getOrderStats();
}
