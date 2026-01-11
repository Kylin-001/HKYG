package com.heikeji.mall.user.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.user.service.UserBehaviorAnalysisService;
import com.heikeji.mall.user.vo.UserStatisticsVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 用户行为分析控制器
 */
@Api(tags = "用户行为分析")
@RestController
@RequestMapping("/api/analysis/user-behavior")
public class UserBehaviorAnalysisController {

    @Autowired
    private UserBehaviorAnalysisService userBehaviorAnalysisService;

    /**
     * 获取用户统计数据
     */
    @ApiOperation("获取用户统计数据")
    @GetMapping("/statistics")
    public R<UserStatisticsVO> getUserStatistics(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        UserStatisticsVO statistics = userBehaviorAnalysisService.getUserStatistics(userId, startDate, endDate);
        return R.success(statistics);
    }

    /**
     * 获取用户行为趋势
     */
    @ApiOperation("获取用户行为趋势")
    @GetMapping("/trend")
    public R<List<Map<String, Object>>> getUserBehaviorTrend(
            @RequestParam Long userId,
            @RequestParam(required = false) String behaviorType,
            @RequestParam(defaultValue = "30") int days) {
        List<Map<String, Object>> trend = userBehaviorAnalysisService.getUserBehaviorTrend(userId, behaviorType, days);
        return R.success(trend);
    }

    /**
     * 获取用户热门商品
     */
    @ApiOperation("获取用户热门商品")
    @GetMapping("/hot-products")
    public R<List<Map<String, Object>>> getUserHotProducts(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> hotProducts = userBehaviorAnalysisService.getUserHotProducts(userId, limit);
        return R.success(hotProducts);
    }

    /**
     * 获取用户活跃度
     */
    @ApiOperation("获取用户活跃度")
    @GetMapping("/activity")
    public R<Map<String, Object>> getUserActivity(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "30") int days) {
        double activity = userBehaviorAnalysisService.getUserActivity(userId, days);
        Map<String, Object> result = Map.of(
                "userId", userId,
                "activityScore", activity,
                "activityLevel", getActivityLevel(activity)
        );
        return R.success(result);
    }

    /**
     * 获取用户偏好
     */
    @ApiOperation("获取用户偏好")
    @GetMapping("/preferences")
    public R<Map<String, Object>> getUserPreferences(
            @RequestParam Long userId) {
        Map<String, Object> preferences = userBehaviorAnalysisService.getUserPreferences(userId);
        return R.success(preferences);
    }

    /**
     * 获取用户流失风险
     */
    @ApiOperation("获取用户流失风险")
    @GetMapping("/churn-risk")
    public R<Map<String, Object>> getUserChurnRisk(
            @RequestParam Long userId) {
        Map<String, Object> churnRisk = userBehaviorAnalysisService.getUserChurnRisk(userId);
        return R.success(churnRisk);
    }

    /**
     * 获取用户群体行为分析
     */
    @ApiOperation("获取用户群体行为分析")
    @GetMapping("/group-analysis")
    public R<Map<String, Object>> getUserGroupBehaviorAnalysis(
            @RequestParam String userGroup,
            @RequestParam(required = false) String behaviorType,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        Map<String, Object> groupAnalysis = userBehaviorAnalysisService.getUserGroupBehaviorAnalysis(userGroup, behaviorType, startDate, endDate);
        return R.success(groupAnalysis);
    }

    /**
     * 预测用户购买意向
     */
    @ApiOperation("预测用户购买意向")
    @GetMapping("/purchase-intent")
    public R<Map<String, Object>> predictPurchaseIntent(
            @RequestParam Long userId) {
        Map<String, Object> purchaseIntent = userBehaviorAnalysisService.predictPurchaseIntent(userId);
        return R.success(purchaseIntent);
    }

    /**
     * 根据活跃度分数获取活跃度等级
     */
    private String getActivityLevel(double activity) {
        if (activity >= 80) {
            return "高";
        } else if (activity >= 40) {
            return "中";
        } else {
            return "低";
        }
    }
}