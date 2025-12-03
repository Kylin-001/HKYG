package com.heikeji.mall.campus.domain.vo;

import lombok.Data;

import java.util.Date;

/**
 * 校区VO类
 */
@Data
public class CampusVO {
    /**
     * 主键ID
     */
    private Long id;

    /**
     * 校区名称
     */
    private String campusName;

    /**
     * 校区编码
     */
    private String campusCode;

    /**
     * 校区地址
     */
    private String address;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 负责人
     */
    private String principal;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}