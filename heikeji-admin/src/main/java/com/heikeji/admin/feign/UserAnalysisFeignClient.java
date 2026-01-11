package com.heikeji.admin.feign;

import com.heikeji.admin.common.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 用户数据分析Feign客户端
 * 用于后台管理系统调用用户服务的数据分析接口
 */
@FeignClient(name = "heikeji-user")
public interface UserAnalysisFeignClient {
    
    /**
     * 获取用户概览数据
     */
    @GetMapping("/api/analysis/user/overview")
    R getUserOverview(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取用户增长趋势
     */
    @GetMapping("/api/analysis/user/growth")
    R getUserGrowth(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval);
    
    /**
     * 获取用户活跃趋势
     */
    @GetMapping("/api/analysis/user/active")
    R getUserActiveTrend(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "day") String interval);
    
    /**
     * 获取用户地域分布
     */
    @GetMapping("/api/analysis/user/region")
    R getUserRegionDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取用户设备分布
     */
    @GetMapping("/api/analysis/user/device")
    R getUserDeviceDistribution(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
    
    /**
     * 获取用户行为分析
     */
    @GetMapping("/api/analysis/user/behavior")
    R getUserBehaviorAnalysis(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate);
}