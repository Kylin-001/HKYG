package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.entity.DeliveryRoute;
import com.heikeji.mall.delivery.service.DeliveryRouteService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 配送路线控制器
 */
@RestController
@RequestMapping("/api/delivery/route")
@Api(tags = "配送路线管理")
public class DeliveryRouteController {

    @Autowired
    private DeliveryRouteService deliveryRouteService;

    /**
     * 规划配送路线
     */
    @PostMapping("/plan")
    @ApiOperation("规划配送路线")
    public R<Boolean> planRoute(@RequestParam Long orderId, @RequestParam Long deliveryUserId) {
        boolean success = deliveryRouteService.planRoute(orderId, deliveryUserId);
        return R.success(success);
    }

    /**
     * 根据订单ID获取路线
     */
    @GetMapping("/order/{orderId}")
    @ApiOperation("根据订单ID获取路线")
    public R<DeliveryRoute> getRouteByOrderId(@PathVariable Long orderId) {
        DeliveryRoute route = deliveryRouteService.getRouteByOrderId(orderId);
        return R.success(route);
    }

    /**
     * 根据配送员ID获取路线列表
     */
    @GetMapping("/delivery-user/{deliveryUserId}")
    @ApiOperation("根据配送员ID获取路线列表")
    public R<List<DeliveryRoute>> getRoutesByDeliveryUserId(@PathVariable Long deliveryUserId) {
        List<DeliveryRoute> routes = deliveryRouteService.getRoutesByDeliveryUserId(deliveryUserId);
        return R.success(routes);
    }

    /**
     * 更新路线状态
     */
    @PutMapping("/{routeId}/status")
    @ApiOperation("更新路线状态")
    public R<Boolean> updateRouteStatus(@PathVariable Long routeId, @RequestParam Integer status) {
        boolean success = deliveryRouteService.updateRouteStatus(routeId, status);
        return R.success(success);
    }
}
