package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户行为DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "用户行为DTO")
public class UserBehaviorDTO {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "行为类型 1:浏览 2:点击 3:收藏 4:分享 5:购买 6:评价")
    private Integer behaviorType;

    @Schema(description = "商品ID")
    private Long productId;

    @Schema(description = "商品名称")
    private String productName;

    @Schema(description = "商品分类ID")
    private Long categoryId;

    @Schema(description = "商品分类名称")
    private String categoryName;

    @Schema(description = "浏览时长(秒)")
    private Integer viewDuration;

    @Schema(description = "行为时间")
    private LocalDateTime behaviorTime;

    @Schema(description = "IP地址")
    private String ipAddress;

    @Schema(description = "设备类型")
    private String deviceType;

    @Schema(description = "浏览器类型")
    private String browserType;

    @Schema(description = "操作系统")
    private String osType;

    @Schema(description = "行为描述")
    private String behaviorDesc;
}
