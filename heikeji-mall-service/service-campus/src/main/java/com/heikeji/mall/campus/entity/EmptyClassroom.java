package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 空教室实体类
 */
@Data
@TableName("empty_classroom")
public class EmptyClassroom implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 所属校区ID
     */
    private Long campusId;

    /**
     * 教学楼ID
     */
    private Long buildingId;

    /**
     * 教学楼名称
     */
    private String buildingName;

    /**
     * 教室编号
     */
    private String classroomNo;

    /**
     * 星期几：1-7表示周一到周日
     */
    private Integer weekday;

    /**
     * 第几节课：1-12表示一天的课程节次
     */
    private Integer classSection;

    /**
     * 教室类型：0-普通教室，1-多媒体教室，2-实验室，3-阶梯教室
     */
    private Integer classroomType;

    /**
     * 教室容量
     */
    private Integer capacity;

    /**
     * 状态：0-已被占用，1-空闲
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}
