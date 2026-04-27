package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍卫生评分记录实体
 */
@Data
@TableName("dormitory_hygiene_record")
public class DormitoryHygieneRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 宿舍ID
     */
    private Long dormitoryId;

    /**
     * 检查日期
     */
    private String date;

    /**
     * 周次
     */
    private String week;

    /**
     * 得分
     */
    private Integer score;

    /**
     * 总分
     */
    private Integer totalScore;

    /**
     * 评分项详情，JSON格式
     */
    private String items;

    /**
     * 检查人
     */
    private String inspector;

    /**
     * 排名
     */
    private Integer rank;

    /**
     * 总房间数
     */
    private Integer totalRooms;

    /**
     * 评语
     */
    private String comment;

    /**
     * 创建时间
     */
    private Date createTime;
}
