package com.heikeji.mall.user.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * 认证令牌VO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Builder
@Schema(description = "认证令牌VO")
public class AuthTokenVO {

    @Schema(description = "访问令牌")
    private String accessToken;

    @Schema(description = "刷新令牌")
    private String refreshToken;

    @Schema(description = "令牌过期时间（秒）")
    private Long expiresIn;

    @Schema(description = "令牌类型")
    private String tokenType;
}