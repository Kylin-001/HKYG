package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍访客记录实体
 */
@Data
@TableName("dormitory_visitor")
public class DormitoryVisitor implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 学生ID
     */
    private Long studentId;

    /**
     * 宿舍ID
     */
    private Long dormitoryId;

    /**
     * 访客姓名
     */
    private String visitorName;

    /**
     * 访客电话
     */
    private String visitorPhone;

    /**
     * 来访日期
     */
    private String visitDate;

    /**
     * 来访时间
     */
    private String visitTime;

    /**
     * 来访事由
     */
    private String purpose;

    /**
     * 状态：pending-待审批，approved-已通过，rejected-已拒绝，completed-已完成
     */
    private String status;

    /**
     * 审批人
     */
    private String approvedBy;

    /**
     * 审批时间
     */
    private Date approvedAt;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date createTime;
}
