package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.service.DeliveryTrackingService;
import com.heikeji.mall.delivery.vo.DeliveryTrackingVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 配送跟踪控制器
 */
@RestController
@RequestMapping("/api/delivery/tracking")
@Tag(name = "配送跟踪管理")
public class DeliveryTrackingController {

    @Autowired
    private DeliveryTrackingService deliveryTrackingService;

    /**
     * 获取订单配送跟踪信息
     */
    @GetMapping("/order/{orderId}")
    @Operation(summary = "获取订单配送跟踪信息")
    public R<DeliveryTrackingVO> getTrackingInfo(@PathVariable Long orderId) {
        DeliveryTrackingVO trackingVO = deliveryTrackingService.getTrackingByOrderId(orderId);
        return R.success(trackingVO);
    }

    /**
     * 更新配送位置（配送员调用）
     */
    @PostMapping("/location/update")
    @Operation(summary = "更新配送位置")
    public R<Boolean> updateLocation(@RequestParam Long orderId,
                                    @RequestParam Double latitude,
                                    @RequestParam Double longitude,
                                    @RequestParam(required = false) Integer status) {
        boolean result = deliveryTrackingService.updateLocation(orderId, latitude, longitude, status);
        return R.success(result);
    }

    /**
     * 添加配送事件
     */
    @PostMapping("/event/add")
    @Operation(summary = "添加配送事件")
    public R<Boolean> addTrackingEvent(@RequestParam Long orderId,
                                     @RequestParam Integer eventType,
                                     @RequestParam String eventDesc) {
        boolean result = deliveryTrackingService.addTrackingEvent(orderId, eventType, eventDesc);
        return R.success(result);
    }
}