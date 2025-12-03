package com.heikeji.mall.user.controller;

import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.dto.DeliveryRequestDTO;
import com.heikeji.mall.user.entity.DeliveryRequest;
import com.heikeji.mall.user.service.DeliveryRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 配送请求控制器
 * 处理配送请求相关的API请求
 */
@RestController
@RequestMapping("/api/delivery/request")
@Tag(name = "配送请求管理", description = "配送请求管理相关接口")
public class DeliveryRequestController {

    @Autowired
    private DeliveryRequestService deliveryRequestService;

    /**
     * 获取配送请求列表
     *
     * @return 配送请求列表
     */
    @Operation(summary = "获取配送请求列表", description = "获取所有配送请求的列表")
    @GetMapping("/list")
    public Result<List<DeliveryRequest>> list() {
        List<DeliveryRequest> deliveryRequests = deliveryRequestService.list();
        return Result.success(deliveryRequests);
    }

    /**
     * 根据ID获取配送请求信息
     *
     * @param id 配送请求ID
     * @return 配送请求信息
     */
    @Operation(summary = "获取配送请求详情", description = "根据ID获取配送请求的详细信息")
    @GetMapping("/{id}")
    public Result<DeliveryRequest> getById(@PathVariable Long id) {
        DeliveryRequest deliveryRequest = deliveryRequestService.getById(id);
        if (deliveryRequest == null) {
            return Result.error("配送请求不存在");
        }
        return Result.success(deliveryRequest);
    }

    /**
     * 创建配送请求
     *
     * @param deliveryRequestDTO 配送请求信息
     * @return 创建结果
     */
    @Operation(summary = "创建配送请求", description = "创建新的配送请求")
    @PostMapping
    public Result<Boolean> create(@RequestBody DeliveryRequestDTO deliveryRequestDTO) {
        boolean success = deliveryRequestService.create(deliveryRequestDTO);
        return success ? Result.success() : Result.error();
    }

    /**
     * 更新配送请求状态
     *
     * @param id     配送请求ID
     * @param status 状态 0:待处理 1:已接受 2:配送中 3:已完成 4:已取消
     * @return 更新结果
     */
    @Operation(summary = "更新配送请求状态", description = "更新配送请求的处理状态")
    @PutMapping("/{id}/status")
    public Result<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        boolean success = deliveryRequestService.updateStatus(id, status);
        return success ? Result.success() : Result.error();
    }

    /**
     * 分配配送员
     *
     * @param id              配送请求ID
     * @param deliveryPersonId 配送员ID
     * @return 分配结果
     */
    @Operation(summary = "分配配送员", description = "为配送请求分配配送员")
    @PutMapping("/{id}/assign")
    public Result<Boolean> assignDeliveryPerson(@PathVariable Long id, @RequestParam Long deliveryPersonId) {
        boolean success = deliveryRequestService.assignDeliveryPerson(id, deliveryPersonId);
        return success ? Result.success() : Result.error();
    }

    /**
     * 删除配送请求
     *
     * @param id 配送请求ID
     * @return 删除结果
     */
    @Operation(summary = "删除配送请求", description = "根据ID删除配送请求")
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean success = deliveryRequestService.delete(id);
        return success ? Result.success() : Result.error();
    }

    /**
     * 根据用户ID获取配送请求列表
     *
     * @param userId 用户ID
     * @return 配送请求列表
     */
    @Operation(summary = "根据用户ID获取配送请求列表", description = "根据用户ID获取其发起的配送请求列表")
    @GetMapping("/user/{userId}")
    public Result<List<DeliveryRequest>> getByUserId(@PathVariable Long userId) {
        List<DeliveryRequest> deliveryRequests = deliveryRequestService.getByUserId(userId);
        return Result.success(deliveryRequests);
    }

    /**
     * 根据配送员ID获取配送请求列表
     *
     * @param deliveryPersonId 配送员ID
     * @return 配送请求列表
     */
    @Operation(summary = "根据配送员ID获取配送请求列表", description = "根据配送员ID获取其负责的配送请求列表")
    @GetMapping("/deliveryPerson/{deliveryPersonId}")
    public Result<List<DeliveryRequest>> getByDeliveryPersonId(@PathVariable Long deliveryPersonId) {
        List<DeliveryRequest> deliveryRequests = deliveryRequestService.getByDeliveryPersonId(deliveryPersonId);
        return Result.success(deliveryRequests);
    }
}