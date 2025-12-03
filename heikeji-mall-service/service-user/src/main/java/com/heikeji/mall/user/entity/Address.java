package com.heikeji.mall.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 地址实体类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("address")
@Schema(description = "地址实体类")
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    /**
     * 用户ID
     */
    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 收件人姓名
     */
    @TableField("receiver_name")
    @Schema(description = "收件人姓名")
    private String receiverName;

    /**
     * 手机号码
     */
    @TableField("phone_number")
    @Schema(description = "手机号码")
    private String phoneNumber;

    /**
     * 省份
     */
    @TableField("province")
    @Schema(description = "省份")
    private String province;

    /**
     * 城市
     */
    @TableField("city")
    @Schema(description = "城市")
    private String city;

    /**
     * 区县
     */
    @TableField("district")
    @Schema(description = "区县")
    private String district;

    /**
     * 详细地址
     */
    @TableField("detail_address")
    @Schema(description = "详细地址")
    private String detailAddress;

    /**
     * 邮政编码
     */
    @TableField("postal_code")
    @Schema(description = "邮政编码")
    private String postalCode;

    /**
     * 是否默认地址：0-否，1-是
     */
    @TableField("is_default")
    @Schema(description = "是否默认地址：0-否，1-是")
    private Integer isDefault;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
