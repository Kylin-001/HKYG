package com.heikeji.mall.campus.domain.vo;

import lombok.Data;

import java.util.Date;

/**
 * 校园站点VO类
 */
@Data
public class CampusSiteVO {
    /**
     * 站点ID
     */
    private Long id;

    /**
     * 所属校区ID
     */
    private Long campusId;

    /**
     * 站点名称
     */
    private String name;

    /**
     * 站点类型：超市、快递点、打印店等
     */
    private String type;

    /**
     * 站点描述
     */
    private String description;

    /**
     * 具体位置
     */
    private String location;

    /**
     * 联系电话
     */
    private String contactPhone;

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
    
    /**
     * 校区名称（扩展字段，用于前端展示）
     */
    private String campusName;
}