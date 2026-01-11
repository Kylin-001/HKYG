package com.heikeji.mall.order.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.common.core.domain.R;
import com.heikeji.mall.order.entity.RefundReason;
import com.heikeji.mall.order.service.RefundReasonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 退款原因控制器
 */
@RestController
@RequestMapping("/refund/reason")
@Tag(name = "退款原因管理", description = "退款原因相关接口")
public class RefundReasonController {
    
    @Autowired
    private RefundReasonService refundReasonService;
    
    /**
     * 获取所有启用的退款原因
     * @return 退款原因列表
     */
    @GetMapping("/enabled")
    @Operation(summary = "获取启用的退款原因", description = "获取所有状态为启用的退款原因")
    public R getEnabledRefundReasons() {
        List<RefundReason> refundReasons = refundReasonService.getEnabledRefundReasons();
        return R.success(refundReasons);
    }
    
    /**
     * 分页查询退款原因
     * @param page 页码
     * @param limit 每页条数
     * @param refundReason 查询条件
     * @return 分页结果
     */
    @GetMapping("/list")
    @Operation(summary = "分页查询退款原因", description = "分页查询退款原因列表")
    public R list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                           @RequestParam(value = "limit", defaultValue = "10") Integer limit,
                           RefundReason refundReason) {
        Page<RefundReason> pageParam = new Page<>(page, limit);
        IPage<RefundReason> pageResult = refundReasonService.page(pageParam, null);
        return R.success(pageResult);
    }
    
    /**
     * 根据ID查询退款原因
     * @param id 退款原因ID
     * @return 退款原因
     */
    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询退款原因", description = "根据ID查询退款原因详情")
    public R getById(@PathVariable Long id) {
        RefundReason refundReason = refundReasonService.getById(id);
        return R.success(refundReason);
    }
    
    /**
     * 新增退款原因
     * @param refundReason 退款原因
     * @return 结果
     */
    @PostMapping
    @Operation(summary = "新增退款原因", description = "新增退款原因")
    public R save(@RequestBody RefundReason refundReason) {
        boolean result = refundReasonService.saveRefundReason(refundReason);
        return result ? R.success() : R.error();
    }
    
    /**
     * 更新退款原因
     * @param refundReason 退款原因
     * @return 结果
     */
    @PutMapping
    @Operation(summary = "更新退款原因", description = "更新退款原因")
    public R update(@RequestBody RefundReason refundReason) {
        boolean result = refundReasonService.updateRefundReason(refundReason);
        return result ? R.success() : R.error();
    }
    
    /**
     * 删除退款原因
     * @param id 退款原因ID
     * @return 结果
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除退款原因", description = "删除退款原因")
    public R delete(@PathVariable Long id) {
        boolean result = refundReasonService.deleteRefundReason(id);
        return result ? R.success() : R.error();
    }
    
    /**
     * 批量删除退款原因
     * @param ids 退款原因ID列表
     * @return 结果
     */
    @DeleteMapping("/batch")
    @Operation(summary = "批量删除退款原因", description = "批量删除退款原因")
    public R deleteBatch(@RequestBody List<Long> ids) {
        boolean result = refundReasonService.deleteBatchRefundReason(ids);
        return result ? R.success() : R.error();
    }
    
    /**
     * 启用/禁用退款原因
     * @param id 退款原因ID
     * @param status 状态 1:启用 0:禁用
     * @return 结果
     */
    @PutMapping("/status")
    @Operation(summary = "启用/禁用退款原因", description = "启用或禁用退款原因")
    public R updateStatus(@RequestParam Long id, @RequestParam Integer status) {
        boolean result = refundReasonService.updateRefundReasonStatus(id, status);
        return result ? R.success() : R.error();
    }
}