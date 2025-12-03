package com.heikeji.mall.payment.controller;

import com.heikeji.common.core.web.ApiResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import com.heikeji.mall.payment.entity.Reconciliation;
import com.heikeji.mall.payment.entity.ReconciliationBatch;
import com.heikeji.mall.payment.service.ReconciliationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

/**
 * 支付对账控制器
 */
@Api(tags = "支付对账管理")
@RestController
@RequestMapping("/reconciliation")
public class ReconciliationController {

    @Autowired
    private ReconciliationService reconciliationService;

    /**
     * 启动对账任务
     */
    @ApiOperation("启动对账任务")
    @PreAuthorize("hasAuthority('payment:reconciliation:start')")
    @PostMapping("/start")
    public ApiResult<String> startReconciliation(@RequestParam String reconciliationDate,
                                         @RequestParam Integer paymentType) {
        try {
            String batchNo = reconciliationService.startReconciliation(reconciliationDate, paymentType);
            return ApiResult.success(batchNo, "启动对账任务成功");
        } catch (Exception e) {
            return ApiResult.error("启动对账任务失败: " + e.getMessage());
        }
    }

    /**
     * 执行对账
     */
    @ApiOperation("执行对账")
    @PreAuthorize("hasAuthority('payment:reconciliation:execute')")
    @PostMapping("/execute/{batchNo}")
    public ApiResult<Void> executeReconciliation(@PathVariable String batchNo) {
        try {
            reconciliationService.executeReconciliation(batchNo);
            return ApiResult.success();
        } catch (Exception e) {
            return ApiResult.error("执行对账失败: " + e.getMessage());
        }
    }

    /**
     * 查询对账批次详情
     */
    @ApiOperation("查询对账批次详情")
    @PreAuthorize("hasAuthority('payment:reconciliation:view')")
    @GetMapping("/batch/{batchNo}")
    public ApiResult<ReconciliationBatch> getBatchByNo(@PathVariable String batchNo) {
        ReconciliationBatch batch = reconciliationService.getBatchByNo(batchNo);
        if (batch == null) {
            return ApiResult.error("对账批次不存在");
        }
        return ApiResult.success(batch);
    }

    /**
     * 查询对账记录列表
     */
    @ApiOperation("查询对账记录列表")
    @PreAuthorize("hasAuthority('payment:reconciliation:list')")
    @GetMapping("/list")
    public ApiResult<List<Reconciliation>> getReconciliationList(@RequestParam String batchNo,
                                              @RequestParam(required = false) Integer status) {
        List<Reconciliation> list = reconciliationService.getReconciliationList(batchNo, status);
        return ApiResult.success(list);
    }

    /**
     * 生成对账报表
     */
    @ApiOperation("生成对账报表")
    @PreAuthorize("hasAuthority('payment:reconciliation:report')")
    @GetMapping("/report/{batchNo}")
    public ApiResult<Map<String, Object>> generateReport(@PathVariable String batchNo) {
        try {
            Map<String, Object> report = reconciliationService.generateReconciliationReport(batchNo);
            return ApiResult.success(report);
        } catch (Exception e) {
            return ApiResult.error("生成对账报表失败: " + e.getMessage());
        }
    }

    /**
     * 导出对账数据
     */
    @ApiOperation("导出对账数据")
    @PreAuthorize("hasAuthority('payment:reconciliation:export')")
    @GetMapping("/export/{batchNo}")
    public void exportData(@PathVariable String batchNo, HttpServletResponse response) {
        try {
            String filePath = reconciliationService.exportReconciliationData(batchNo);
            if (StringUtils.isNotEmpty(filePath)) {
                File file = new File(filePath);
                if (file.exists()) {
                    // 设置响应头
                    response.setContentType("text/csv;charset=utf-8");
                    response.setHeader("Content-Disposition", "attachment;filename=" + file.getName());
                    
                    // 输出文件
                    try (FileInputStream fis = new FileInputStream(file);
                         OutputStream os = response.getOutputStream()) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = fis.read(buffer)) > 0) {
                            os.write(buffer, 0, len);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException("导出文件失败", e);
                    }
                } else {
                    response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                    response.getWriter().write("文件不存在");
                }
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.getWriter().write("导出失败");
            }
        } catch (Exception e) {
            try {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.getWriter().write("导出失败: " + e.getMessage());
            } catch (IOException ignored) {
            }
        }
    }

    /**
     * 解决对账差异
     */
    @ApiOperation("解决对账差异")
    @PreAuthorize("hasAuthority('payment:reconciliation:solve')")
    @PostMapping("/solve")
    public ApiResult<Void> solveReconciliationDiff(@RequestParam Long id,
                                            @RequestParam String solution,
                                            @RequestParam String solver) {
        try {
            reconciliationService.solveReconciliationDiff(id, solution, solver);
            return ApiResult.success();
        } catch (Exception e) {
            return ApiResult.error("解决差异失败: " + e.getMessage());
        }
    }

    /**
     * 查询未解决的对账差异
     */
    @ApiOperation("查询未解决的对账差异")
    @PreAuthorize("hasAuthority('payment:reconciliation:diff')")
    @GetMapping("/unresolved")
    public ApiResult<List<Reconciliation>> getUnresolvedDiffs(@RequestParam(defaultValue = "100") Integer limit) {
        List<Reconciliation> list = reconciliationService.getUnresolvedDiffs(limit);
        return ApiResult.success(list);
    }

    /**
     * 手动触发对账
     */
    @ApiOperation("手动触发对账")
    @PreAuthorize("hasAuthority('payment:reconciliation:trigger')")
    @PostMapping("/trigger")
    public ApiResult<String> triggerManualReconciliation(@RequestParam String startDate,
                                                @RequestParam String endDate,
                                                @RequestParam Integer paymentType) {
        try {
            String taskId = reconciliationService.triggerManualReconciliation(startDate, endDate, paymentType);
            return ApiResult.success(taskId, "手动触发对账成功，请稍后查看结果");
        } catch (Exception e) {
            return ApiResult.error("手动触发对账失败: " + e.getMessage());
        }
    }

    /**
     * 查询对账统计信息
     */
    @ApiOperation("查询对账统计信息")
    @PreAuthorize("hasAuthority('payment:reconciliation:statistics')")
    @GetMapping("/statistics")
    public ApiResult<Map<String, Object>> getReconciliationStatistics(@RequestParam String startDate,
                                                @RequestParam String endDate) {
        try {
            Map<String, Object> statistics = reconciliationService.getReconciliationStatistics(startDate, endDate);
            return ApiResult.success(statistics);
        } catch (Exception e) {
            return ApiResult.error("查询统计信息失败: " + e.getMessage());
        }
    }

}