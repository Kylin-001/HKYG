package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍报修实体
 */
@Data
@TableName("dormitory_repair")
public class DormitoryRepair implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 工单号
     */
    private String ticketNo;

    /**
     * 宿舍ID
     */
    private Long dormitoryId;

    /**
     * 学生ID
     */
    private Long studentId;

    /**
     * 报修标题
     */
    private String title;

    /**
     * 问题描述
     */
    private String description;

    /**
     * 报修类型：utility-水电，furniture-家具，network-网络，door-门窗，other-其他
     */
    private String type;

    /**
     * 状态：pending-待处理，processing-处理中，completed-已完成，rejected-已驳回
     */
    private String status;

    /**
     * 图片URL，逗号分隔
     */
    private String images;

    /**
     * 方便维修时间
     */
    private String preferredTime;

    /**
     * 处理人
     */
    private String handler;

    /**
     * 处理结果
     */
    private String result;

    /**
     * 提交时间
     */
    private Date submittedAt;

    /**
     * 完成时间
     */
    private Date completedAt;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
