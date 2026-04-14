package com.heikeji.mall.user.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 用户批量插入DTO
 * 支持单条和批量数据插入，包含完整的数据验证
 */
@Data
public class UserBatchInsertDTO {

    /**
     * 用户名 (唯一)
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_\\u4e00-\\u9fa5]+$", message = "用户名只能包含字母、数字、下划线和中文")
    private String username;

    /**
     * 密码（加密存储）
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度必须在6-100个字符之间")
    private String password;

    /**
     * 学号 (唯一)
     */
    @NotBlank(message = "学号不能为空")
    @Size(max = 20, message = "学号长度不能超过20个字符")
    @Pattern(regexp = "^\\d{8,20}$", message = "学号格式不正确，应为8-20位数字")
    private String studentNo;

    /**
     * 昵称
     */
    @NotBlank(message = "昵称不能为空")
    @Size(max = 50, message = "昵称长度不能超过50个字符")
    private String nickname;

    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    /**
     * 性别：1-男，2-女
     */
    @Min(value = 0, message = "性别值不合法")
    @Max(value = 2, message = "性别值不合法")
    private Integer sex;

    /**
     * 头像URL
     */
    @Size(max = 255, message = "头像URL长度不能超过255个字符")
    private String avatar;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    private String email;

    /**
     * 状态：0-正常，1-禁用
     */
    @Min(value = 0, message = "状态值不合法")
    @Max(value = 1, message = "状态值不合法")
    private Integer status = 0;

    /**
     * 认证状态：0-未认证，1-已认证
     */
    private Integer isVerified = 0;

    /**
     * 账户余额
     */
    @DecimalMin(value = "0.00", message = "余额不能为负数")
    @Digits(integer = 10, fraction = 2, message = "余额格式不正确")
    private BigDecimal balance = BigDecimal.ZERO;

    /**
     * 用户积分
     */
    @Min(value = 0, message = "积分不能为负数")
    private Integer score = 0;

    /**
     * 学院
     */
    @Size(max = 100, message = "学院名称长度不能超过100个字符")
    private String college;

    /**
     * 专业
     */
    @Size(max = 100, message = "专业名称长度不能超过100个字符")
    private String major;

    /**
     * 年级
     */
    @Size(max = 20, message = "年级长度不能超过20个字符")
    private String grade;
}
