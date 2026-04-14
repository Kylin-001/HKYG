package com.heikeji.mall.api.controller.takeout;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.TakeoutOrderItem;
import com.heikeji.mall.takeout.service.TakeoutOrderItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 外卖订单详情Controller
 */
@RestController
@RequestMapping("/api/takeout/order-item")
@Tag(name = "外卖订单详情接口")
public class TakeoutOrderItemController {
    
    @Autowired
    private TakeoutOrderItemService takeoutOrderItemService;
    
    @Operation(summary = "根据订单ID获取订单商品")
    @GetMapping("/order/{orderId}")
    public R<List<TakeoutOrderItem>> getItemsByOrder(@PathVariable Long orderId) {
        List<TakeoutOrderItem> items = takeoutOrderItemService.getOrderItemsByOrderId(orderId);
        return R.success(items);
    }
}