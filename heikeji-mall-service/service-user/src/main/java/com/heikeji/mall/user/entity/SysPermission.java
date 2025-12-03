package com.heikeji.mall.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统权限实体类
 *
 * @author heikeji
 * @date 2024-12-19
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("sys_permission")
@Schema(description = "系统权限实体类")
public class SysPermission implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 权限ID
     */
    @TableId(value = "permission_id", type = IdType.AUTO)
    @Schema(description = "权限ID")
    private Long permissionId;

    /**
     * 权限名称
     */
    @TableField("name")
    @Schema(description = "权限名称")
    private String name;

    /**
     * 权限标识
     */
    @TableField("permission")
    @Schema(description = "权限标识")
    private String permission;

    /**
     * 资源路径
     */
    @TableField("url")
    @Schema(description = "资源路径")
    private String url;

    /**
     * 权限类型（1：菜单，2：按钮，3：接口）
     */
    @TableField("type")
    @Schema(description = "权限类型（1：菜单，2：按钮，3：接口）")
    private Integer type;

    /**
     * 父权限ID
     */
    @TableField("parent_id")
    @Schema(description = "父权限ID")
    private Long parentId;

    /**
     * 排序
     */
    @TableField("sort")
    @Schema(description = "排序")
    private Integer sort;

    /**
     * 图标
     */
    @TableField("icon")
    @Schema(description = "图标")
    private String icon;

    /**
     * 是否可见（0：不可见，1：可见）
     */
    @TableField("visible")
    @Schema(description = "是否可见（0：不可见，1：可见）")
    private Integer visible;

    /**
     * 状态（0：禁用，1：启用）
     */
    @TableField("status")
    @Schema(description = "状态（0：禁用，1：启用）")
    private Integer status;

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

    /**
     * 逻辑删除（0：未删除，1：已删除）
     */
    @TableLogic
    @TableField("deleted")
    @Schema(description = "逻辑删除")
    private Integer deleted;
}
