package com.heikeji.system.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 权限查询参数
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Data
public class PermissionQueryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 页码
     */
    private Integer pageNum = 1;

    /**
     * 每页数量
     */
    private Integer pageSize = 10;

    /**
     * 权限名称
     */
    private String permissionName;

    /**
     * 权限编码
     */
    private String permissionCode;

    /**
     * 类型：1目录 2菜单 3按钮
     */
    private Integer type;

    /**
     * 状态：0禁用 1启用
     */
    private Integer status;

    /**
     * 父级权限ID
     */
    private Long parentId;

    /**
     * 所属角色ID
     */
    private Long roleId;

    /**
     * 创建时间开始
     */
    private String createTimeStart;

    /**
     * 创建时间结束
     */
    private String createTimeEnd;
}
