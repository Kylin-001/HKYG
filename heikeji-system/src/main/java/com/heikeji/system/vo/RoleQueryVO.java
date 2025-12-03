package com.heikeji.system.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 角色查询参数
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Data
public class RoleQueryVO implements Serializable {

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
     * 角色名称
     */
    private String roleName;

    /**
     * 角色编码
     */
    private String roleCode;

    /**
     * 状态：0禁用 1启用
     */
    private Integer status;

    /**
     * 角色描述
     */
    private String description;

    /**
     * 创建时间开始
     */
    private String createTimeStart;

    /**
     * 创建时间结束
     */
    private String createTimeEnd;
}
