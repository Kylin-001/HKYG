package com.heikeji.mall.delivery.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.delivery.service.DeliveryAssignService;
import com.heikeji.mall.delivery.vo.AssignResultVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 配送订单分配控制器
 */
@Tag(name = "配送订单分配")
@RestController
@RequestMapping("/api/delivery/assign")
public class DeliveryAssignController {

    @Autowired
    private DeliveryAssignService deliveryAssignService;

    /**
     * 自动分配订单给最合适的配送员
     */
    @Operation(summary = "自动分配订单")
    @PostMapping("/auto/{orderId}")
    public R<AssignResultVO> autoAssignOrder(@Parameter(description = "订单ID") @PathVariable Long orderId) {
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
    @Operation(summary = "手动分配订单")
    @PostMapping("/manual")
    public R<AssignResultVO> manualAssignOrder(@Parameter(description = "订单ID") @RequestParam Long orderId,
                               @Parameter(description = "配送员ID") @RequestParam Long deliveryUserId) {
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
    @Operation(summary = "获取可分配的配送员列表")
    @GetMapping("/users/{orderId}")
    public R<Map<String, Object>> getAvailableDeliveryUsers(@Parameter(description = "订单ID") @PathVariable Long orderId) {
        Map<String, Object> result = deliveryAssignService.getAvailableDeliveryUsers(orderId);
        return R.success(result);
    }

    /**
     * 计算配送员与订单的匹配度
     */
    @Operation(summary = "计算配送员与订单的匹配度")
    @GetMapping("/match-score")
    public R<Map<String, Integer>> calculateMatchScore(@Parameter(description = "订单ID") @RequestParam Long orderId,
                                @Parameter(description = "配送员ID") @RequestParam Long deliveryUserId) {
        int matchScore = deliveryAssignService.calculateMatchScore(deliveryUserId, orderId);
        Map<String, Integer> result = new HashMap<>();
        result.put("matchScore", matchScore);
        return R.success(result);
    }
}
