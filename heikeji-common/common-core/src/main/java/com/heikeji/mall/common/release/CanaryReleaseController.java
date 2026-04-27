package com.heikeji.mall.common.release;

import com.heikeji.common.core.domain.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * 灰度发布管理控制器
 *
 * 提供RESTful API用于：
 * 1. 查看/修改发布规则
 * 2. 实时查看流量分布统计
 * 3. 手动触发回滚
 * 4. 配置渐进式发布计划
 */
@RestController
@RequestMapping("/api/admin/release")
@Tag(name = "灰度发布管理接口")
public class CanaryReleaseController {

    private static final Logger log = LoggerFactory.getLogger(CanaryReleaseController.class);

    @Autowired
    private CanaryReleaseService releaseService;

    @GetMapping("/rules")
    @Operation(summary = "获取所有发布规则")
    public R<Map<String, CanaryReleaseService.ReleaseRule>> getAllRules() {
        return R.success(releaseService.getAllActiveRules());
    }

    @GetMapping("/rules/{feature}")
    @Operation(summary = "获取指定功能的发布规则")
    public R<CanaryReleaseService.ReleaseRule> getRule(@PathVariable String feature) {
        CanaryReleaseService.ReleaseRule rule = releaseService.getActiveRule(feature);
        if (rule == null) {
            return R.error("未找到该功能的发布规则");
        }
        return R.success(rule);
    }

    @PostMapping("/rules/{feature}")
    @Operation(summary = "创建或更新发布规则")
    public R<String> createOrUpdateRule(
            @PathVariable String feature,
            @RequestBody CanaryReleaseService.ReleaseRule rule) {

        rule.setFeature(feature);
        if (rule.getCreatedTime() == null) {
            rule.setCreatedTime(java.time.LocalDateTime.now());
        }

        releaseService.updateReleaseRule(feature, rule);
        return R.success("发布规则已更新");
    }

    @DeleteMapping("/rules/{feature}")
    @Operation(summary = "删除规则并回滚到V1")
    public R<String> deleteRule(@PathVariable String feature) {
        releaseService.removeReleaseRule(feature);
        return R.success("规则已删除，流量已回滚到V1");
    }

    @PutMapping("/rules/{feature}/toggle")
    @Operation(summary = "启用/禁用功能")
    public R<String> toggleFeature(
            @PathVariable String feature,
            @RequestParam boolean enabled) {

        releaseService.setFeatureEnabled(feature, enabled);
        return R.success(String.format("功能%s: %s", feature, enabled ? "已启用" : "已禁用"));
    }

    @GetMapping("/statistics")
    @Operation(summary = "获取发布统计")
    public R<CanaryReleaseService.ReleaseStatistics> getStatistics() {
        return R.success(releaseService.getStatistics());
    }

    @PostMapping("/statistics/reset")
    @Operation(summary = "重置统计数据")
    public R<String> resetStatistics() {
        releaseService.resetMetrics();
        return R.success("统计已重置");
    }

    @PostMapping("/gradual-rollout/{feature}")
    @Operation(summary = "启动渐进式发布")
    public R<String> startGradualRollout(
            @PathVariable String feature,
            @RequestParam List<Integer> percentages,
            @RequestParam(defaultValue = "60") long intervalMinutes) {

        int[] array = percentages.stream().mapToInt(i -> i).toArray();
        releaseService.gradualRollout(feature, array, intervalMinutes);

        return R.success(String.format("渐进式发布已启动: %s, 步数=%d, 间隔=%d分钟",
                feature, percentages.size(), intervalMinutes));
    }

    @GetMapping("/resolve/{feature}")
    @Operation(summary = "测试版本解析（用于调试）")
    public R<Map<String, Object>> testResolution(
            @PathVariable String feature,
            @RequestParam(required = false) String userId) {

        String version = releaseService.resolveVersion(feature, userId);
        return R.success(Map.of(
                "feature", feature,
                "userId", userId != null ? userId : "anonymous",
                "resolvedVersion", version,
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    @PostMapping("/whitelist/{feature}")
    @Operation(summary = "设置白名单用户")
    public R<String> updateWhitelist(
            @PathVariable String feature,
            @RequestBody Set<String> userIds) {

        CanaryReleaseService.ReleaseRule rule = releaseService.getActiveRule(feature);
        if (rule == null) {
            rule = CanaryReleaseService.ReleaseRule.builder()
                    .strategy(CanaryReleaseService.ReleaseStrategy.WHITELIST)
                    .build();
        }

        rule.setWhitelistUsers(userIds);
        releaseService.updateReleaseRule(feature, rule);

        return R.success(String.format("白名单已更新: feature=%s, 用户数=%d", feature, userIds.size()));
    }
}
