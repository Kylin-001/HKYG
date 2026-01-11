package com.heikeji.admin.controller;

import com.heikeji.admin.common.R;
import com.heikeji.admin.entity.SystemConfig;
import com.heikeji.admin.service.SystemConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统配置控制器
 */
@Api(tags = "系统配置管理")
@RestController
@RequestMapping("/api/system/config")
public class SystemConfigController {

    @Autowired
    private SystemConfigService systemConfigService;

    /**
     * 分页查询系统配置列表
     */
    @ApiOperation("分页查询系统配置列表")
    @GetMapping("/list")
    public R systemConfigList(@ApiParam("查询参数，包括page和limit等") @RequestParam Map<String, Object> params) {
        Map<String, Object> result = systemConfigService.pageSystemConfig(params);
        return R.ok().data(result);
    }

    /**
     * 根据ID获取系统配置信息
     */
    @ApiOperation("根据ID获取系统配置信息")
    @GetMapping("/{id}")
    public R getSystemConfigById(@ApiParam("配置ID") @PathVariable("id") Long id) {
        SystemConfig systemConfig = systemConfigService.getSystemConfigById(id);
        if (systemConfig == null) {
            return R.error(404, "系统配置不存在");
        }
        return R.ok().data(systemConfig);
    }

    /**
     * 根据配置键获取系统配置信息
     */
    @ApiOperation("根据配置键获取系统配置信息")
    @GetMapping("/key/{configKey}")
    public R getSystemConfigByKey(@ApiParam("配置键") @PathVariable("configKey") String configKey) {
        SystemConfig systemConfig = systemConfigService.getSystemConfigByKey(configKey);
        if (systemConfig == null) {
            return R.error(404, "系统配置不存在");
        }
        return R.ok().data(systemConfig);
    }

    /**
     * 根据配置类型获取系统配置列表
     */
    @ApiOperation("根据配置类型获取系统配置列表")
    @GetMapping("/type/{configType}")
    public R getSystemConfigByType(@ApiParam("配置类型") @PathVariable("configType") String configType) {
        List<SystemConfig> systemConfigs = systemConfigService.getSystemConfigByType(configType);
        Map<String, Object> result = new HashMap<>();
        result.put("list", systemConfigs);
        return R.ok().data(result);
    }

    /**
     * 获取所有启用的系统配置
     */
    @ApiOperation("获取所有启用的系统配置")
    @GetMapping("/enabled")
    public R getAllEnabledSystemConfig() {
        List<SystemConfig> systemConfigs = systemConfigService.getAllEnabledSystemConfig();
        Map<String, Object> result = new HashMap<>();
        result.put("list", systemConfigs);
        return R.ok().data(result);
    }

    /**
     * 添加系统配置
     */
    @ApiOperation("添加系统配置")
    @PostMapping("/")
    public R addSystemConfig(@ApiParam("系统配置信息") @RequestBody SystemConfig systemConfig) {
        // 验证参数
        if (systemConfig.getConfigKey() == null || systemConfig.getConfigKey().isEmpty()) {
            return R.error(400, "配置键不能为空");
        }
        if (systemConfig.getConfigValue() == null) {
            return R.error(400, "配置值不能为空");
        }

        boolean success = systemConfigService.addSystemConfig(systemConfig);
        if (success) {
            return R.ok("添加系统配置成功");
        } else {
            return R.error(500, "添加系统配置失败");
        }
    }

    /**
     * 修改系统配置
     */
    @ApiOperation("修改系统配置")
    @PutMapping("/{id}")
    public R updateSystemConfig(@ApiParam("配置ID") @PathVariable("id") Long id, 
                               @ApiParam("系统配置信息") @RequestBody SystemConfig systemConfig) {
        // 设置配置ID
        systemConfig.setId(id);

        boolean success = systemConfigService.updateSystemConfig(systemConfig);
        if (success) {
            return R.ok("修改系统配置成功");
        } else {
            return R.error(500, "修改系统配置失败");
        }
    }

    /**
     * 删除系统配置
     */
    @ApiOperation("删除系统配置")
    @DeleteMapping("/{id}")
    public R deleteSystemConfig(@ApiParam("配置ID") @PathVariable("id") Long id) {
        try {
            boolean success = systemConfigService.deleteSystemConfig(id);
            if (success) {
                return R.ok("删除系统配置成功");
            } else {
                return R.error(500, "删除系统配置失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "删除系统配置失败");
        }
    }

    /**
     * 批量删除系统配置
     */
    @ApiOperation("批量删除系统配置")
    @DeleteMapping("/batch")
    public R batchDeleteSystemConfig(@ApiParam("配置ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要删除的系统配置");
            }

            boolean success = systemConfigService.batchDeleteSystemConfig(ids);
            if (success) {
                return R.ok("批量删除系统配置成功");
            } else {
                return R.error(500, "批量删除系统配置失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量删除系统配置失败");
        }
    }

    /**
     * 更新系统配置状态
     */
    @ApiOperation("更新系统配置状态")
    @PutMapping("/{id}/status")
    public R updateSystemConfigStatus(@ApiParam("配置ID") @PathVariable("id") Long id, 
                                     @ApiParam("状态码 0禁用 1启用") @RequestParam Integer status) {
        try {
            boolean success = systemConfigService.updateSystemConfigStatus(id, status);
            if (success) {
                return R.ok("修改系统配置状态成功");
            } else {
                return R.error(500, "修改系统配置状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "修改系统配置状态失败");
        }
    }

    /**
     * 批量更新系统配置状态
     */
    @ApiOperation("批量更新系统配置状态")
    @PutMapping("/batch/status")
    public R batchUpdateSystemConfigStatus(@ApiParam("状态码 0禁用 1启用") @RequestParam Integer status, 
                                          @ApiParam("配置ID列表") @RequestBody List<Long> ids) {
        try {
            if (ids == null || ids.isEmpty()) {
                return R.error(400, "请选择要更新状态的系统配置");
            }

            boolean success = systemConfigService.batchUpdateSystemConfigStatus(ids, status);
            if (success) {
                return R.ok("批量修改系统配置状态成功");
            } else {
                return R.error(500, "批量修改系统配置状态失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return R.error(500, "批量修改系统配置状态失败");
        }
    }
}
