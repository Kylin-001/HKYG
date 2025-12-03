package com.heikeji.mall.lostfound.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * 失物招领信息实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("lost_found")
public class LostFound {

    /**
     * 失物招领ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 标题
     */
    @TableField("title")
    private String title;

    /**
     * 内容描述
     */
    @TableField("content")
    private String content;

    /**
     * 物品类型：0-失物，1-招领
     */
    @TableField("type")
    private Integer type;

    /**
     * 物品分类ID
     */
    @TableField("category_id")
    private Long categoryId;

    /**
     * 物品图片，多个图片用逗号分隔
     */
    @TableField("images")
    private String images;

    /**
     * 物品标签，多个标签用逗号分隔
     */
    @TableField("tags")
    private String tags;

    /**
     * 地点
     */
    @TableField("location")
    private String location;

    /**
     * 时间
     */
    @TableField("time")
    private Date time;

    /**
     * 联系人姓名
     */
    @TableField("contact_name")
    private String contactName;

    /**
     * 联系人电话
     */
    @TableField("contact_phone")
    private String contactPhone;

    /**
     * 状态：0-待审核，1-已发布，2-已解决，3-已删除，4-审核失败
     */
    @TableField("status")
    private Integer status;

    /**
     * 浏览量
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 留言数
     */
    @TableField("comment_count")
    private Integer commentCount;

    /**
     * 审核意见
     */
    @TableField("audit_remark")
    private String auditRemark;

    /**
     * 创建时间
     */
    @TableField("create_time")
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField("update_time")
    private Date updateTime;

    /**
     * 删除标记：0-正常，1-删除
     */
    @TableField("del_flag")
    private Integer delFlag;

}