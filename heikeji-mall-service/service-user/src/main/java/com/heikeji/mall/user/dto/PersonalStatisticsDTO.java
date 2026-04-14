package com.heikeji.mall.user.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 个人统计数据传输对象
 */
@Data
public class PersonalStatisticsDTO {

    /**
     * 订单数量
     */
    private Integer orderCount;

    /**
     * 评价数量
     */
    private Integer reviewCount;

    /**
     * 收藏数量
     */
    private Integer favoriteCount;

    /**
     * 粉丝数量
     */
    private Integer followerCount;

    /**
     * 关注数量
     */
    private Integer followingCount;

    /**
     * 积分
     */
    private Integer points;

    /**
     * 等级
     */
    private Integer level;

    /**
     * 加入天数
     */
    private Integer joinDays;

    /**
     * 总消费金额
     */
    private BigDecimal totalSpent;

    /**
     * 平均订单金额
     */
    private BigDecimal averageOrderValue;

    /**
     * 喜欢的商品分类
     */
    private List<CategoryCount> favoriteCategories;

    /**
     * 最近动态
     */
    private List<ActivityRecord> recentActivity;

    /**
     * 发布帖子数
     */
    private Integer postCount;

    /**
     * 收到点赞数
     */
    private Integer likeCount;

    /**
     * 收到评论数
     */
    private Integer commentCount;

    /**
     * 信用评分（0-5）
     */
    private BigDecimal creditScore;

    @Data
    public static class CategoryCount {
        private String category;
        private Integer count;
    }

    @Data
    public static class ActivityRecord {
        private Long id;
        private String type;
        private String description;
        private Long targetId;
        private String targetType;
        private String createdAt;
    }
}
