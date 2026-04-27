package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.LoginLog;
import com.heikeji.admin.entity.OperationLog;
import com.heikeji.admin.service.LoginLogService;
import com.heikeji.admin.service.OperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 日志管理控制器
 */
@Tag(name = "日志管理")
@RestController
@RequestMapping("/api/log")
public class LogController {

    @Autowired
    private LoginLogService loginLogService;

    @Autowired
    private OperationLogService operationLogService;

    // ========== 登录日志 ==========

    /**
     * 分页查询登录日志列表
     */
    @Operation(summary = "分页查询登录日志列表")
    @GetMapping("/login/list")
    public R loginLogList(@Parameter(description = "查询参数") @RequestParam Map<String, Object> params) {
        Map<String, Object> result = loginLogService.pageLoginLog(params);
        return R.ok().data(result);
    }

    /**
     * 根据ID获取登录日志详情
     */
    @Operation(summary = "根据ID获取登录日志详情")
    @GetMapping("/login/{id}")
    public R getLoginLogById(@Parameter(description = "日志ID") @PathVariable("id") Long id) {
        LoginLog loginLog = loginLogService.getLoginLogById(id);
        if (loginLog == null) {
            return R.error(404, "日志不存在");
        }
        return R.ok().data(loginLog);
    }

    /**
     * 删除登录日志
     */
    @Operation(summary = "删除登录日志")
    @DeleteMapping("/login/{id}")
    public R deleteLoginLog(@Parameter(description = "日志ID") @PathVariable("id") Long id) {
        try {
            boolean success = loginLogService.deleteLoginLog(id);
            if (success) {
                return R.ok("删除成功");
            } else {
                return R.error(500, "删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "删除失败");
        }
    }

    /**
     * 批量删除登录日志
     */
    @Operation(summary = "批量删除登录日志")
    @DeleteMapping("/login/batch")
    public R batchDeleteLoginLog(@Parameter(description = "日志ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要删除的日志");
            }
            boolean success = loginLogService.batchDeleteLoginLog(ids);
            if (success) {
                return R.ok("批量删除成功");
            } else {
                return R.error(500, "批量删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量删除失败");
        }
    }

    /**
     * 清空登录日志
     */
    @Operation(summary = "清空登录日志")
    @DeleteMapping("/login/clean")
    public R cleanLoginLog() {
        try {
            loginLogService.cleanLoginLog();
            return R.ok("清空成功");
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "清空失败");
        }
    }

    /**
     * 统计用户登录次数排行
     */
    @Operation(summary = "统计用户登录次数排行")
    @GetMapping("/login/statistics/user")
    public R countLoginByUser(@Parameter(description = "限制数量") @RequestParam(defaultValue = "10") Integer limit) {
        List<Map<String, Object>> result = loginLogService.countLoginByUser(limit);
        return R.ok().data(result);
    }

    // ========== 操作日志 ==========

    /**
     * 分页查询操作日志列表
     */
    @Operation(summary = "分页查询操作日志列表")
    @GetMapping("/operation/list")
    public R operationLogList(@Parameter(description = "查询参数") @RequestParam Map<String, Object> params) {
        Map<String, Object> result = operationLogService.pageOperationLog(params);
        return R.ok().data(result);
    }

    /**
     * 根据ID获取操作日志详情
     */
    @Operation(summary = "根据ID获取操作日志详情")
    @GetMapping("/operation/{id}")
    public R getOperationLogById(@Parameter(description = "日志ID") @PathVariable("id") Long id) {
        OperationLog operationLog = operationLogService.getOperationLogById(id);
        if (operationLog == null) {
            return R.error(404, "日志不存在");
        }
        return R.ok().data(operationLog);
    }

    /**
     * 删除操作日志
     */
    @Operation(summary = "删除操作日志")
    @DeleteMapping("/operation/{id}")
    public R deleteOperationLog(@Parameter(description = "日志ID") @PathVariable("id") Long id) {
        try {
            boolean success = operationLogService.deleteOperationLog(id);
            if (success) {
                return R.ok("删除成功");
            } else {
                return R.error(500, "删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "删除失败");
        }
    }

    /**
     * 批量删除操作日志
     */
    @Operation(summary = "批量删除操作日志")
    @DeleteMapping("/operation/batch")
    public R batchDeleteOperationLog(@Parameter(description = "日志ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要删除的日志");
            }
            boolean success = operationLogService.batchDeleteOperationLog(ids);
            if (success) {
                return R.ok("批量删除成功");
            } else {
                return R.error(500, "批量删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量删除失败");
        }
    }

    /**
     * 清空操作日志
     */
    @Operation(summary = "清空操作日志")
    @DeleteMapping("/operation/clean")
    public R cleanOperationLog() {
        try {
            operationLogService.cleanOperationLog();
            return R.ok("清空成功");
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "清空失败");
        }
    }

    /**
     * 统计操作类型分布
     */
    @Operation(summary = "统计操作类型分布")
    @GetMapping("/operation/statistics/type")
    public R countByBusinessType() {
        List<Map<String, Object>> result = operationLogService.countByBusinessType();
        return R.ok().data(result);
    }

    /**
     * 统计操作人员操作次数
     */
    @Operation(summary = "统计操作人员操作次数")
    @GetMapping("/operation/statistics/operator")
    public R countByOperator(@Parameter(description = "限制数量") @RequestParam(defaultValue = "10") Integer limit) {
        List<Map<String, Object>> result = operationLogService.countByOperator(limit);
        return R.ok().data(result);
    }
}
