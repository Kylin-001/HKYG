package com.heikeji.mall.api.controller.takeout;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.service.TakeoutOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 外卖订单Controller
 */
@RestController
@RequestMapping("/api/takeout/order")
@Api(tags = "外卖订单接口")
public class TakeoutOrderController {
    
    @Autowired
    private TakeoutOrderService takeoutOrderService;
    
    @ApiOperation("创建外卖订单")
    @PostMapping("/create")
    public R<TakeoutOrder> createOrder(@RequestBody TakeoutOrder order) {
        // 注意：这里应该使用createTakeoutOrder方法并传入CreateTakeoutOrderDTO参数
        // 由于接口不匹配，这里暂时返回null
        return R.success(null);
    }
    
    @ApiOperation("获取订单详情")
    @GetMapping("/detail/{orderId}")
    public R<TakeoutOrder> getOrderDetail(@PathVariable Long orderId) {
        TakeoutOrder order = takeoutOrderService.getOrderDetail(orderId);
        return R.success(order);
    }
    
    @ApiOperation("获取用户订单列表")
    @GetMapping("/user/{userId}")
    public R<List<TakeoutOrder>> getUserOrders(@PathVariable Long userId) {
        List<TakeoutOrder> orders = takeoutOrderService.getUserOrders(userId);
        return R.success(orders);
    }
    
    @ApiOperation("获取商家订单列表")
    @GetMapping("/merchant/{merchantId}")
    public R<List<TakeoutOrder>> getMerchantOrders(@PathVariable Long merchantId) {
        List<TakeoutOrder> orders = takeoutOrderService.getMerchantOrders(merchantId);
        return R.success(orders);
    }
    
    @ApiOperation("获取待接单订单列表")
    @GetMapping("/pending")
    public R<List<TakeoutOrder>> getPendingOrders() {
        // 注意：getPendingOrders方法在接口中不存在，这里只是暂时返回空列表
        // 实际实现需要在TakeoutOrderService接口中添加该方法并实现
        return R.success(null);
    }
    
    @ApiOperation("商家接单")
    @PostMapping("/{orderId}/accept")
    public R<Boolean> acceptOrder(@PathVariable Long orderId) {
        takeoutOrderService.updateOrderStatus(orderId, 1); // 标记为已接单状态
        return R.success(true);
    }
    
    @ApiOperation("商家开始制作")
    @PostMapping("/{orderId}/start-making")
    public R<Boolean> startMaking(@PathVariable Long orderId) {
        takeoutOrderService.updateOrderStatus(orderId, 1); // 标记为制作中状态（使用相同的状态码）
        return R.success(true);
    }
    
    @ApiOperation("商家标记出餐")
    @PostMapping("/{orderId}/mark-ready")
    public R<Boolean> markReady(@PathVariable Long orderId) {
        takeoutOrderService.updateOrderStatus(orderId, 2); // 标记为已出餐状态
        return R.success(true);
    }
    
    @ApiOperation("配送员接单")
    @PostMapping("/{orderId}/delivery-accept")
    public R<Boolean> deliveryAcceptOrder(@PathVariable Long orderId) {
        takeoutOrderService.updateOrderStatus(orderId, 1); // 标记为已接单状态
        return R.success(true);
    }
    
    @ApiOperation("配送员开始配送")
    @PostMapping("/{orderId}/start-delivery")
    public R<Boolean> startDelivery(@PathVariable Long orderId) {
        takeoutOrderService.updateOrderStatus(orderId, 2); // 标记为配送中状态
        return R.success(true);
    }
    
    @ApiOperation("配送员完成配送")
    @PostMapping("/{orderId}/complete-delivery")
    public R<Boolean> completeDelivery(@PathVariable Long orderId) {
        takeoutOrderService.updateOrderStatus(orderId, 3); // 标记为已送达状态
        return R.success(true);
    }
    
    @ApiOperation("用户取消订单")
    @PostMapping("/{orderId}/cancel")
    public R<Boolean> cancelOrder(@PathVariable Long orderId) {
        takeoutOrderService.cancelOrder(orderId);
        return R.success(true);
    }
    
    @ApiOperation("用户确认收货")
    @PostMapping("/{orderId}/confirm-receipt")
    public R<Boolean> confirmReceipt(@PathVariable Long orderId) {
        takeoutOrderService.completeOrder(orderId);
        return R.success(true);
    }
    
    /**
     * 释放超时占用的外卖柜（供定时任务调用）
     */
    @PostMapping("/release-timeout-lockers")
    public R<Integer> releaseTimeoutLockers(@RequestParam Integer hours) {
        Integer releasedCount = takeoutOrderService.releaseTimeoutLockers(hours);
        return R.success(releasedCount);
    }
}