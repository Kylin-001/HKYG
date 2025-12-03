package com.heikeji.mall.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 配送请求实体类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("delivery_request")
@Schema(description = "配送请求实体类")
public class DeliveryRequest implements Serializable {

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
     * 收货地址ID
     */
    @TableField("address_id")
    @Schema(description = "收货地址ID")
    private Long addressId;

    /**
     * 配送状态：0-待处理，1-已接受，2-配送中，3-已完成，4-已取消
     */
    @TableField("status")
    @Schema(description = "配送状态：0-待处理，1-已接受，2-配送中，3-已完成，4-已取消")
    private Integer status;

    /**
     * 配送时间
     */
    @TableField("delivery_time")
    @Schema(description = "配送时间")
    private LocalDateTime deliveryTime;

    /**
     * 备注信息
     */
    @TableField("remark")
    @Schema(description = "备注信息")
    private String remark;

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
