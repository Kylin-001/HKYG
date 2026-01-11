package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import javax.validation.constraints.NotBlank;

/**
 * 重置密码请求DTO
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "重置密码请求DTO")
public class ResetPasswordDTO {

    @Schema(description = "手机号")
    @NotBlank(message = "手机号不能为空")
    private String phone;

    @Schema(description = "验证码")
    @NotBlank(message = "验证码不能为空")
    private String code;

    @Schema(description = "新密码")
    @NotBlank(message = "新密码不能为空")
    private String newPassword;

    @Schema(description = "确认新密码")
    @NotBlank(message = "确认新密码不能为空")
    private String confirmPassword;
}
