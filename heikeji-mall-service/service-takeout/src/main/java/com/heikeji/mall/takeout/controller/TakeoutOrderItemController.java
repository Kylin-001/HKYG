package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutOrderItem;
import com.heikeji.mall.takeout.service.TakeoutOrderItemService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 外卖订单商品详情控制器
 */
@RestController
@RequestMapping("/api/takeout/order-item")
@Tag(name = "外卖订单商品详情管理")
public class TakeoutOrderItemController {

    @Autowired
    private TakeoutOrderItemService takeoutOrderItemService;

    /**
     * 根据订单ID获取订单商品列表
     */
    @GetMapping("/order/{orderId}")
    @Operation(summary = "根据订单ID获取订单商品列表")
    public R<List<TakeoutOrderItem>> getOrderItemsByOrderId(@PathVariable Long orderId) {
        List<TakeoutOrderItem> orderItems = takeoutOrderItemService.getOrderItemsByOrderId(orderId);
        return R.success(orderItems);
    }

    /**
     * 批量保存订单商品
     */
    @PostMapping("/batch")
    @Operation(summary = "批量保存订单商品")
    public R<Boolean> saveBatchOrderItems(@RequestBody List<TakeoutOrderItem> orderItems) {
        boolean result = takeoutOrderItemService.saveBatchOrderItems(orderItems);
        return R.success(result);
    }

}