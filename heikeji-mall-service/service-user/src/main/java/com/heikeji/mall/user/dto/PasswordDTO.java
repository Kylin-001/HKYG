package com.heikeji.mall.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 密码DTO
 * 用于密码修改等操作
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@Schema(description = "密码DTO")
public class PasswordDTO {

    @Schema(description = "旧密码")
    @NotBlank(message = "旧密码不能为空")
    private String oldPassword;

    @Schema(description = "新密码")
    @NotBlank(message = "新密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20个字符之间")
    private String newPassword;

    @Schema(description = "确认新密码")
    @NotBlank(message = "确认新密码不能为空")
    private String confirmPassword;
}