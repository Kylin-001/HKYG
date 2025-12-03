package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * 用户登录请求DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "用户登录请求DTO")
public class LoginDTO {

    @Schema(description = "登录账号(用户名/手机号/邮箱)")
    @NotBlank(message = "登录账号不能为空")
    private String account;

    @Schema(description = "密码")
    @NotBlank(message = "密码不能为空")
    private String password;

    @Schema(description = "验证码")
    private String code;

    @Schema(description = "验证码ID")
    private String codeId;

    @Schema(description = "登录类型: 0-账号密码, 1-手机号验证码")
    private Integer loginType = 0;
}
