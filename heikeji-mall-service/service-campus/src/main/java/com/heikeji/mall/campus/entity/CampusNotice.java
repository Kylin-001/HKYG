package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 校园公告实体类
 */
@Data
@TableName("campus_notice")
public class CampusNotice implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 公告ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 所属校区ID
     */
    private Long campusId;

    /**
     * 公告标题
     */
    private String title;

    /**
     * 公告内容
     */
    private String content;

    /**
     * 公告类型：通知、活动、新闻等
     */
    private String type;

    /**
     * 发布人
     */
    private String publisher;

    /**
     * 发布时间
     */
    private Date publishTime;

    /**
     * 状态：0-未发布，1-已发布，2-已过期
     */
    private Integer status;

    /**
     * 是否置顶：0-否，1-是
     */
    private Integer isTop;

    /**
     * 过期时间
     */
    private Date expireTime;

    /**
     * 点击量
     */
    private Integer clickCount;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
