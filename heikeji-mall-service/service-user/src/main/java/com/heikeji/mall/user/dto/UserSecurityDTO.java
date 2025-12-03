package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 用户安全设置DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "用户安全设置DTO")
public class UserSecurityDTO {

    @Schema(description = "是否开启手机验证")
    private Boolean enablePhoneVerification;

    @Schema(description = "是否开启邮箱验证")
    private Boolean enableEmailVerification;

    @Schema(description = "是否开启登录IP限制")
    private Boolean enableIpRestriction;

    @Schema(description = "是否开启双重验证")
    private Boolean enableTwoFactorAuth;

    @Schema(description = "是否开启风险提示")
    private Boolean enableRiskNotification;

    @Schema(description = "密码过期提醒天数")
    private Integer passwordExpireDays;

    @Schema(description = "登录失败锁定次数")
    private Integer loginFailLockCount;

    @Schema(description = "登录失败锁定时间（分钟）")
    private Integer loginFailLockTime;

    @Schema(description = "是否允许异地登录")
    private Boolean allowRemoteLogin;
}
