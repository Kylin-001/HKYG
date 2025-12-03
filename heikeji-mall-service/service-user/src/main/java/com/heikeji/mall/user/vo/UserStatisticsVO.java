package com.heikeji.mall.user.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * 用户统计VO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "用户统计VO")
public class UserStatisticsVO {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "开始日期")
    private Date startDate;

    @Schema(description = "结束日期")
    private Date endDate;

    @Schema(description = "总浏览次数")
    private Integer totalBrowsingCount;

    @Schema(description = "总购买次数")
    private Integer totalPurchaseCount;

    @Schema(description = "总收藏次数")
    private Integer totalFavoritesCount;

    @Schema(description = "总评论次数")
    private Integer totalCommentsCount;

    @Schema(description = "总订单金额")
    private Double totalOrderAmount;

    @Schema(description = "总用户数")
    private Long totalUserCount;

    @Schema(description = "今日新增用户数")
    private Long todayNewUserCount;

    @Schema(description = "本周新增用户数")
    private Long weekNewUserCount;

    @Schema(description = "本月新增用户数")
    private Long monthNewUserCount;

    @Schema(description = "日活跃用户数")
    private Long dailyActiveCount;

    @Schema(description = "周活跃用户数")
    private Long weeklyActiveCount;

    @Schema(description = "月活跃用户数")
    private Long monthlyActiveCount;

    @Schema(description = "用户增长率(%)")
    private Double userGrowthRate;

    @Schema(description = "用户地域分布")
    private List<UserRegionVO> regionDistribution;

    @Schema(description = "用户设备分布")
    private List<DeviceDistributionVO> deviceDistribution;

    @Schema(description = "用户行为统计")
    private BehaviorStatisticsVO behaviorStatistics;

    @Schema(description = "用户增长趋势")
    private List<GrowthTrendVO> growthTrend;

    /**
     * 用户地域分布VO
     */
    @Data
    public static class UserRegionVO {
        @Schema(description = "地区")
        private String region;
        @Schema(description = "用户数量")
        private Long userCount;
        @Schema(description = "占比(%)")
        private Double proportion;
    }

    /**
     * 设备分布VO
     */
    @Data
    public static class DeviceDistributionVO {
        @Schema(description = "设备类型")
        private String deviceType;
        @Schema(description = "用户数量")
        private Long userCount;
        @Schema(description = "占比(%)")
        private Double proportion;
    }

    /**
     * 行为统计VO
     */
    @Data
    public static class BehaviorStatisticsVO {
        @Schema(description = "浏览次数")
        private Long viewCount;
        @Schema(description = "点击次数")
        private Long clickCount;
        @Schema(description = "收藏次数")
        private Long collectCount;
        @Schema(description = "分享次数")
        private Long shareCount;
        @Schema(description = "购买次数")
        private Long purchaseCount;
        @Schema(description = "评价次数")
        private Long commentCount;
    }

    /**
     * 增长趋势VO
     */
    @Data
    public static class GrowthTrendVO {
        @Schema(description = "日期")
        private LocalDate date;
        @Schema(description = "新增用户数")
        private Long newUserCount;
        @Schema(description = "活跃用户数")
        private Long activeUserCount;
    }
}
