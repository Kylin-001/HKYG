package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.entity.DeliveryLocker;
import com.heikeji.mall.takeout.service.DeliveryLockerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 外卖柜控制器
 */
@RestController
@RequestMapping("/api/takeout/locker")
@Api(tags = "外卖柜管理")
public class DeliveryLockerController {

    @Autowired
    private DeliveryLockerService deliveryLockerService;

    /**
     * 获取所有可用的外卖柜
     */
    @GetMapping("/available")
    @ApiOperation("获取可用外卖柜列表")
    public R<List<DeliveryLocker>> getAvailableLockers() {
        List<DeliveryLocker> lockers = deliveryLockerService.getAvailableLockers();
        return R.success(lockers);
    }

    /**
     * 根据编码查询外卖柜
     */
    @GetMapping("/detail")
    @ApiOperation("查询外卖柜详情")
    public R<DeliveryLocker> getLockerByCode(@RequestParam String lockerCode) {
        DeliveryLocker locker = deliveryLockerService.getByCode(lockerCode);
        return R.success(locker);
    }

    /**
     * 分配柜口
     */
    @PostMapping("/allocate")
    @ApiOperation("分配外卖柜格口")
    public R<String> allocateCell(@RequestParam String lockerCode) {
        String cellNo = deliveryLockerService.allocateCell(lockerCode);
        if (cellNo == null) {
            return R.error("外卖柜已满或不存在");
        }
        return R.success(cellNo);
    }

    /**
     * 释放柜口
     */
    @PostMapping("/release")
    @ApiOperation("释放外卖柜格口")
    public R<Boolean> releaseCell(@RequestParam String lockerCode, @RequestParam String cellNo) {
        Boolean result = deliveryLockerService.releaseCell(lockerCode, cellNo);
        return R.success(result);
    }

    /**
     * 新增外卖柜（管理员功能）
     */
    @PostMapping("/create")
    @ApiOperation("新增外卖柜")
    public R<Boolean> createLocker(@RequestBody DeliveryLocker locker) {
        boolean result = deliveryLockerService.create(locker);
        return R.success(result);
    }

    /**
     * 编辑外卖柜（管理员功能）
     */
    @PostMapping("/update")
    @ApiOperation("编辑外卖柜")
    public R<Boolean> updateLocker(@RequestBody DeliveryLocker locker) {
        boolean result = deliveryLockerService.update(locker);
        return R.success(result);
    }

    /**
     * 删除外卖柜（管理员功能）
     */
    @DeleteMapping("/{id}")
    @ApiOperation("删除外卖柜")
    public R<Boolean> deleteLocker(@PathVariable Long id) {
        boolean result = deliveryLockerService.delete(id);
        return R.success(result);
    }

    /**
     * 批量删除外卖柜（管理员功能）
     */
    @DeleteMapping("/batch")
    @ApiOperation("批量删除外卖柜")
    public R<Boolean> batchDeleteLockers(@RequestBody List<Long> ids) {
        boolean result = deliveryLockerService.batchDelete(ids);
        return R.success(result);
    }

    /**
     * 更新外卖柜状态（管理员功能）
     */
    @PutMapping("/{id}/status")
    @ApiOperation("更新外卖柜状态")
    public R<Boolean> updateLockerStatus(@PathVariable Long id, @RequestParam Integer status) {
        boolean result = deliveryLockerService.updateStatus(id, status);
        return R.success(result);
    }

    /**
     * 根据ID获取外卖柜详情
     */
    @GetMapping("/{id}")
    @ApiOperation("根据ID获取外卖柜详情")
    public R<DeliveryLocker> getLockerById(@PathVariable Long id) {
        DeliveryLocker locker = deliveryLockerService.getById(id);
        return R.success(locker);
    }

    /**
     * 根据校区获取外卖柜
     */
    @GetMapping("/campus")
    @ApiOperation("根据校区获取外卖柜")
    public R<List<DeliveryLocker>> getLockersByCampus(@RequestParam String campusArea) {
        List<DeliveryLocker> lockers = deliveryLockerService.getByCampusArea(campusArea);
        return R.success(lockers);
    }

    /**
     * 获取外卖柜统计信息
     */
    @GetMapping("/stats")
    @ApiOperation("获取外卖柜统计信息")
    public R<Map<String, Object>> getLockerStats() {
        Map<String, Object> stats = deliveryLockerService.getLockerStats();
        return R.success(stats);
    }

    /**
     * 批量更新外卖柜状态（管理员功能）
     */
    @PutMapping("/batch/status")
    @ApiOperation("批量更新外卖柜状态")
    public R<Boolean> batchUpdateLockerStatus(@RequestParam List<Long> ids, @RequestParam Integer status) {
        boolean result = deliveryLockerService.batchUpdateStatus(ids, status);
        return R.success(result);
    }

}