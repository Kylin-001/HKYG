package com.heikeji.mall.member.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.member.dto.PointProductDTO;
import com.heikeji.mall.member.dto.PointRecordDTO;
import com.heikeji.mall.member.service.PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/member/points")
@Tag(name = "积分管理", description = "积分相关接口")
public class PointController {

    @Autowired
    private PointService pointService;

    @GetMapping("/balance")
    @Operation(summary = "获取用户积分余额")
    public R<Integer> getUserPoints(
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        Integer points = pointService.getUserPoints(userId);
        return R.ok(points);
    }

    @GetMapping("/records")
    @Operation(summary = "获取用户积分记录")
    public R<List<PointRecordDTO>> getUserPointRecords(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "类型：1-订单消费，2-签到，3-活动奖励，4-积分兑换，5-系统调整") @RequestParam(required = false) Integer type) {
        List<PointRecordDTO> records = pointService.getUserPointRecords(userId, type);
        return R.ok(records);
    }

    @PostMapping("/add")
    @Operation(summary = "增加积分")
    public R<Boolean> addPoints(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "积分") @RequestParam Integer points,
            @Parameter(description = "类型") @RequestParam Integer type,
            @Parameter(description = "来源") @RequestParam(required = false) String source,
            @Parameter(description = "订单号") @RequestParam(required = false) String orderNo,
            @Parameter(description = "备注") @RequestParam(required = false) String remark) {
        boolean success = pointService.addPoints(userId, points, type, source, orderNo, remark);
        return R.ok(success);
    }

    @PostMapping("/deduct")
    @Operation(summary = "扣除积分")
    public R<Boolean> deductPoints(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "积分") @RequestParam Integer points,
            @Parameter(description = "来源") @RequestParam(required = false) String source,
            @Parameter(description = "订单号") @RequestParam(required = false) String orderNo,
            @Parameter(description = "备注") @RequestParam(required = false) String remark) {
        boolean success = pointService.deductPoints(userId, points, source, orderNo, remark);
        return R.ok(success);
    }

    @GetMapping("/products")
    @Operation(summary = "获取积分商品列表")
    public R<List<PointProductDTO>> getPointProducts() {
        List<PointProductDTO> products = pointService.getPointProducts();
        return R.ok(products);
    }

    @GetMapping("/products/{productId}")
    @Operation(summary = "获取积分商品详情")
    public R<PointProductDTO> getPointProductDetail(
            @Parameter(description = "商品ID") @PathVariable Long productId) {
        PointProductDTO product = pointService.getPointProductDetail(productId);
        return R.ok(product);
    }

    @PostMapping("/exchange/{productId}")
    @Operation(summary = "兑换积分商品")
    public R<Boolean> exchangeProduct(
            @Parameter(description = "用户ID") @RequestParam Long userId,
            @Parameter(description = "商品ID") @PathVariable Long productId) {
        boolean success = pointService.exchangeProduct(userId, productId);
        return R.ok(success);
    }
}
