package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍调换申请实体
 */
@Data
@TableName("dormitory_swap_request")
public class DormitorySwapRequest implements Serializable {

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
     * 学生姓名
     */
    private String studentName;

    /**
     * 当前宿舍ID
     */
    private Long currentDormitoryId;

    /**
     * 当前楼栋
     */
    private String currentDorm;

    /**
     * 当前房间
     */
    private String currentRoom;

    /**
     * 目标楼栋
     */
    private String targetDorm;

    /**
     * 目标房间
     */
    private String targetRoom;

    /**
     * 调换原因
     */
    private String reason;

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
