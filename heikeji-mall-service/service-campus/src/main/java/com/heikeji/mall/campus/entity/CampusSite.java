package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 校园站点实体类
 */
@Data
@TableName("campus_site")
public class CampusSite implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 站点ID
     */
    @TableId(type = IdType.AUTO)
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
}