package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.service.DeliveryOrderService;
import com.heikeji.mall.delivery.vo.DeliveryOrderDetailVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderListVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderStatusVO;
import com.heikeji.mall.delivery.vo.OrderAcceptRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 配送订单控制器
 */
@RestController
@RequestMapping("/api/delivery/order")
@Tag(name = "配送订单管理")
public class DeliveryOrderController {

    @Autowired
    private DeliveryOrderService deliveryOrderService;

    /**
     * 创建配送订单
     */
    @PostMapping
    @Operation(summary = "创建配送订单")
    public R<DeliveryOrder> createOrder(@RequestBody DeliveryOrder order) {
        // 设置默认用户ID和配送员ID（简化处理）
        if (order.getUserId() == null) {
            order.setUserId(1L);
        }
        DeliveryOrder createdOrder = deliveryOrderService.createOrder(order);
        return R.success(createdOrder);
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/detail/{orderId}")
    @Operation(summary = "获取订单详情")
    public R<DeliveryOrderDetailVO> getOrderDetail(@PathVariable Long orderId) {
        DeliveryOrderDetailVO orderDetail = deliveryOrderService.getOrderDetail(orderId);
        return R.success(orderDetail);
    }

    /**
     * 获取订单列表
     */
    @GetMapping("/list")
    @Operation(summary = "获取订单列表")
    public R<List<DeliveryOrderListVO>> getOrderList(@RequestParam Map<String, Object> params) {
        List<DeliveryOrderListVO> orderList = deliveryOrderService.getOrderList(params);
        return R.success(orderList);
    }

    /**
     * 配送员接单
     */
    @PostMapping("/accept")
    @Operation(summary = "配送员接单")
    public R<Boolean> acceptOrder(@RequestBody OrderAcceptRequest request) {
        // 设置默认配送员ID（简化处理）
        if (request.getDeliveryUserId() == null) {
            request.setDeliveryUserId(1L);
        }
        boolean result = deliveryOrderService.acceptOrder(request);
        return R.success(result);
    }

    /**
     * 开始配送
     */
    @PostMapping("/start/{orderId}")
    @Operation(summary = "开始配送")
    public R<Boolean> startDelivery(@PathVariable Long orderId) {
        // 设置默认配送员ID（简化处理）
        Long deliveryUserId = 1L;
        boolean result = deliveryOrderService.startDelivery(orderId, deliveryUserId);
        return R.success(result);
    }

    /**
     * 完成配送
     */
    @PostMapping("/complete/{orderId}")
    @Operation(summary = "完成配送")
    public R<Boolean> completeDelivery(@PathVariable Long orderId) {
        boolean result = deliveryOrderService.completeDelivery(orderId);
        return R.success(result);
    }

    /**
     * 取消订单
     */
    @PostMapping("/cancel/{orderId}")
    @Operation(summary = "取消订单")
    public R<Boolean> cancelOrder(@PathVariable Long orderId, @RequestParam String reason) {
        boolean result = deliveryOrderService.cancelOrder(orderId, reason);
        return R.success(result);
    }

    /**
     * 获取订单状态统计
     */
    @GetMapping("/status/count")
    @Operation(summary = "获取订单状态统计")
    public R<DeliveryOrderStatusVO> getOrderStatusCount(@RequestParam Map<String, Object> params) {
        DeliveryOrderStatusVO statusCount = deliveryOrderService.getOrderStatusCount(params);
        return R.success(statusCount);
    }

    /**
     * 获取配送员待处理订单
     */
    @GetMapping("/delivery/pending")
    @Operation(summary = "获取配送员待处理订单")
    public R<List<DeliveryOrderListVO>> getDeliveryPendingOrders() {
        // 设置默认配送员ID（简化处理）
        Long deliveryUserId = 1L;
        List<DeliveryOrderListVO> orderList = deliveryOrderService.getDeliveryPendingOrders(deliveryUserId);
        return R.success(orderList);
    }

    /**
     * 获取配送员历史订单
     */
    @GetMapping("/delivery/history")
    @Operation(summary = "获取配送员历史订单")
    public R<List<DeliveryOrderListVO>> getDeliveryHistoryOrders(@RequestParam Map<String, Object> params) {
        // 设置默认配送员ID（简化处理）
        Long deliveryUserId = 1L;
        List<DeliveryOrderListVO> orderList = deliveryOrderService.getDeliveryHistoryOrders(deliveryUserId, params);
        return R.success(orderList);
    }
}
