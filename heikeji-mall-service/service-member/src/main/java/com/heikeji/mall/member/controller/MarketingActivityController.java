package com.heikeji.mall.member.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.member.dto.MarketingActivityDTO;
import com.heikeji.mall.member.service.MarketingActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/member/activity")
@Tag(name = "营销活动管理", description = "营销活动相关接口")
public class MarketingActivityController {

    @Autowired
    private MarketingActivityService marketingActivityService;

    @GetMapping("/list")
    @Operation(summary = "获取可用营销活动列表")
    public R<List<MarketingActivityDTO>> getAvailableActivities(
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        List<MarketingActivityDTO> activities = marketingActivityService.getAvailableActivities(userId);
        return R.ok(activities);
    }

    @GetMapping("/detail/{activityId}")
    @Operation(summary = "获取营销活动详情")
    public R<MarketingActivityDTO> getActivityDetail(
            @Parameter(description = "活动ID") @PathVariable Long activityId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        MarketingActivityDTO activity = marketingActivityService.getActivityDetail(activityId, userId);
        return R.ok(activity);
    }

    @PostMapping("/participate/{activityId}")
    @Operation(summary = "参与营销活动")
    public R<Boolean> participateActivity(
            @Parameter(description = "活动ID") @PathVariable Long activityId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = marketingActivityService.participateActivity(activityId, userId);
        return R.ok(success);
    }

    @PostMapping("/complete/{activityId}")
    @Operation(summary = "完成营销活动")
    public R<Boolean> completeActivity(
            @Parameter(description = "活动ID") @PathVariable Long activityId,
            @Parameter(description = "用户ID") @RequestParam Long userId) {
        boolean success = marketingActivityService.completeActivity(activityId, userId);
        return R.ok(success);
    }
}
