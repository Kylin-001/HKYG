package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.service.DeliveryAssignService;
import com.heikeji.mall.delivery.vo.AssignResultVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 配送订单分配控制器
 */
@Api(tags = "配送订单分配")
@RestController
@RequestMapping("/api/delivery/assign")
public class DeliveryAssignController {

    @Autowired
    private DeliveryAssignService deliveryAssignService;

    /**
     * 自动分配订单给最合适的配送员
     */
    @ApiOperation("自动分配订单")
    @PostMapping("/auto/{orderId}")
    public R<AssignResultVO> autoAssignOrder(@ApiParam("订单ID") @PathVariable Long orderId) {
        AssignResultVO result = deliveryAssignService.assignOrder(orderId);
        if (result.getStatus() == 1) {
            return R.success(result);
        } else {
            return R.error(result.getMessage());
        }
    }

    /**
     * 手动分配订单给指定配送员
     */
    @ApiOperation("手动分配订单")
    @PostMapping("/manual")
    public R<AssignResultVO> manualAssignOrder(@ApiParam("订单ID") @RequestParam Long orderId,
                               @ApiParam("配送员ID") @RequestParam Long deliveryUserId) {
        AssignResultVO result = deliveryAssignService.assignOrderManual(orderId, deliveryUserId);
        if (result.getStatus() == 1) {
            return R.success(result);
        } else {
            return R.error(result.getMessage());
        }
    }

    /**
     * 获取可分配的配送员列表
     */
    @ApiOperation("获取可分配的配送员列表")
    @GetMapping("/users/{orderId}")
    public R<Map<String, Object>> getAvailableDeliveryUsers(@ApiParam("订单ID") @PathVariable Long orderId) {
        Map<String, Object> result = deliveryAssignService.getAvailableDeliveryUsers(orderId);
        return R.success(result);
    }

    /**
     * 计算配送员与订单的匹配度
     */
    @ApiOperation("计算配送员与订单的匹配度")
    @GetMapping("/match-score")
    public R<Map<String, Integer>> calculateMatchScore(@ApiParam("订单ID") @RequestParam Long orderId,
                                @ApiParam("配送员ID") @RequestParam Long deliveryUserId) {
        int matchScore = deliveryAssignService.calculateMatchScore(deliveryUserId, orderId);
        Map<String, Integer> result = new HashMap<>();
        result.put("matchScore", matchScore);
        return R.success(result);
    }
}
