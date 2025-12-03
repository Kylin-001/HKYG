package com.heikeji.mall.user.controller;

import com.heikeji.mall.common.Result;
import com.heikeji.mall.user.entity.DeliveryPerson;
import com.heikeji.mall.user.service.DeliveryPersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 配送员控制器
 * 处理配送员相关的API请求
 */
@RestController
@RequestMapping("/api/delivery/person")
@Tag(name = "配送员管理", description = "配送员管理相关接口")
public class DeliveryPersonController {

    @Autowired
    private DeliveryPersonService deliveryPersonService;

    /**
     * 获取所有配送员列表
     *
     * @return 配送员列表
     */
    @Operation(summary = "获取配送员列表", description = "获取所有配送员的列表")
    @GetMapping("/list")
    public Result<List<DeliveryPerson>> list() {
        List<DeliveryPerson> deliveryPersons = deliveryPersonService.list();
        return Result.success(deliveryPersons);
    }

    /**
     * 根据ID获取配送员信息
     *
     * @param id 配送员ID
     * @return 配送员信息
     */
    @Operation(summary = "获取配送员详情", description = "根据ID获取配送员的详细信息")
    @GetMapping("/{id}")
    public Result<DeliveryPerson> getById(@PathVariable Long id) {
        DeliveryPerson deliveryPerson = deliveryPersonService.getById(id);
        if (deliveryPerson == null) {
            return Result.error("配送员不存在");
        }
        return Result.success(deliveryPerson);
    }

    /**
     * 创建配送员
     *
     * @param deliveryPerson 配送员信息
     * @return 创建结果
     */
    @Operation(summary = "创建配送员", description = "创建新的配送员信息")
    @PostMapping
    public Result<Boolean> create(@RequestBody DeliveryPerson deliveryPerson) {
        boolean success = deliveryPersonService.registerDeliveryPerson(deliveryPerson);
        return success ? Result.success() : Result.error();
    }

    /**
     * 更新配送员信息
     *
     * @param deliveryPerson 更新后的配送员信息
     * @return 更新结果
     */
    @Operation(summary = "更新配送员", description = "更新现有配送员的信息")
    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody DeliveryPerson deliveryPerson) {
        deliveryPerson.setId(id);
        boolean success = deliveryPersonService.updateDeliveryPerson(deliveryPerson);
        return success ? Result.success() : Result.error();
    }

    /**
     * 删除配送员
     *
     * @param id 配送员ID
     * @return 删除结果
     */
    @Operation(summary = "删除配送员", description = "根据ID删除配送员")
    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        boolean success = deliveryPersonService.removeById(id);
        return success ? Result.success() : Result.error();
    }

    /**
     * 更新配送员状态
     *
     * @param id     配送员ID
     * @param status 状态 0:禁用 1:启用 2:离线 3:在线 4:配送中
     * @return 更新结果
     */
    @Operation(summary = "更新配送员状态", description = "更新配送员的工作状态")
    @PutMapping("/{id}/status")
    public Result<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        boolean success = deliveryPersonService.changeDeliveryPersonStatus(id, status);
        return success ? Result.success() : Result.error();
    }

    /**
     * 获取配送员统计信息
     *
     * @return 统计信息
     */
    @Operation(summary = "获取配送员统计", description = "获取配送员的统计信息")
    @GetMapping("/stats")
    public Result<DeliveryPersonStats> getStats() {
        // 由于DeliveryPersonService中没有getStats方法，暂时返回空的统计信息
        DeliveryPersonStats stats = new DeliveryPersonStats();
        stats.setTotalCount(0L);
        stats.setOnlineCount(0L);
        stats.setDeliveryCount(0L);
        stats.setAvailableCount(0L);
        return Result.success(stats);
    }

    /**
     * 内部类：配送员统计信息
     */
    public static class DeliveryPersonStats {
        private Long totalCount;
        private Long onlineCount;
        private Long deliveryCount;
        private Long availableCount;

        // 省略getter和setter方法
        public Long getTotalCount() {
            return totalCount;
        }

        public void setTotalCount(Long totalCount) {
            this.totalCount = totalCount;
        }

        public Long getOnlineCount() {
            return onlineCount;
        }

        public void setOnlineCount(Long onlineCount) {
            this.onlineCount = onlineCount;
        }

        public Long getDeliveryCount() {
            return deliveryCount;
        }

        public void setDeliveryCount(Long deliveryCount) {
            this.deliveryCount = deliveryCount;
        }

        public Long getAvailableCount() {
            return availableCount;
        }

        public void setAvailableCount(Long availableCount) {
            this.availableCount = availableCount;
        }
    }
}