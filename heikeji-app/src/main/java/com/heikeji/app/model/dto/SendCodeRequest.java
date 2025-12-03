package com.heikeji.app.model.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

/**
 * 发送验证码请求DTO
 */
@Data
public class SendCodeRequest {

    @ApiModelProperty(value = "手机号", required = true, example = "13800138000")
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @ApiModelProperty(value = "类型：register(注册)、login(登录)、reset(重置密码)", required = true, example = "register")
    @NotBlank(message = "验证码类型不能为空")
    private String type;
}