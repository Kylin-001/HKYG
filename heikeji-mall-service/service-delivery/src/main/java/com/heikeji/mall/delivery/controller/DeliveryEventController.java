package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.entity.DeliveryEvent;
import com.heikeji.mall.delivery.service.DeliveryEventService;
import com.heikeji.mall.delivery.vo.DeliveryEventVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 配送事件控制器
 */
@Api(tags = "配送事件管理")
@RestController
@RequestMapping("/api/delivery/event")
public class DeliveryEventController {

    @Autowired
    private DeliveryEventService deliveryEventService;

    /**
     * 获取订单的配送事件列表
     */
    @ApiOperation("获取订单的配送事件列表")
    @GetMapping("/order/{orderId}")
    public R<List<DeliveryEventVO>> getOrderEvents(@ApiParam("订单ID") @PathVariable Long orderId) {
        List<DeliveryEventVO> events = deliveryEventService.getEventVOsByOrderId(orderId);
        return R.success(events);
    }

    /**
     * 添加配送事件
     */
    @ApiOperation("添加配送事件")
    @PostMapping
    public R<Boolean> addEvent(@ApiParam("配送事件") @RequestBody DeliveryEvent event) {
        boolean success = deliveryEventService.addEvent(event);
        return R.success(success);
    }

    /**
     * 记录订单创建事件
     */
    @ApiOperation("记录订单创建事件")
    @PostMapping("/order-create")
    public R<Boolean> recordOrderCreateEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                            @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordOrderCreateEvent(orderId, eventDesc);
        return R.success(success);
    }

    /**
     * 记录配送员接单事件
     */
    @ApiOperation("记录配送员接单事件")
    @PostMapping("/order-accept")
    public R<Boolean> recordOrderAcceptEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                            @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                            @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordOrderAcceptEvent(orderId, deliveryUserId, eventDesc);
        return R.success(success);
    }

    /**
     * 记录开始配送事件
     */
    @ApiOperation("记录开始配送事件")
    @PostMapping("/start-delivery")
    public R<Boolean> recordStartDeliveryEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                             @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                             @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordStartDeliveryEvent(orderId, deliveryUserId, eventDesc);
        return R.success(success);
    }

    /**
     * 记录完成配送事件
     */
    @ApiOperation("记录完成配送事件")
    @PostMapping("/complete-delivery")
    public R<Boolean> recordCompleteDeliveryEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                               @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                               @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordCompleteDeliveryEvent(orderId, deliveryUserId, eventDesc);
        return R.success(success);
    }

    /**
     * 记录订单取消事件
     */
    @ApiOperation("记录订单取消事件")
    @PostMapping("/order-cancel")
    public R<Boolean> recordOrderCancelEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                            @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                            @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordOrderCancelEvent(orderId, deliveryUserId, eventDesc);
        return R.success(success);
    }

    /**
     * 记录位置更新事件
     */
    @ApiOperation("记录位置更新事件")
    @PostMapping("/location-update")
    public R<Boolean> recordLocationUpdateEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                              @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                              @ApiParam("经度") @RequestParam Double longitude,
                                              @ApiParam("纬度") @RequestParam Double latitude,
                                              @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordLocationUpdateEvent(orderId, deliveryUserId, longitude, latitude, eventDesc);
        return R.success(success);
    }

    /**
     * 记录配送延迟事件
     */
    @ApiOperation("记录配送延迟事件")
    @PostMapping("/delay")
    public R<Boolean> recordDelayEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                      @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                      @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordDelayEvent(orderId, deliveryUserId, eventDesc);
        return R.success(success);
    }

    /**
     * 记录异常事件
     */
    @ApiOperation("记录异常事件")
    @PostMapping("/exception")
    public R<Boolean> recordExceptionEvent(@ApiParam("订单ID") @RequestParam Long orderId,
                                         @ApiParam("配送员ID") @RequestParam Long deliveryUserId,
                                         @ApiParam("事件描述") @RequestParam String eventDesc) {
        boolean success = deliveryEventService.recordExceptionEvent(orderId, deliveryUserId, eventDesc);
        return R.success(success);
    }
}
