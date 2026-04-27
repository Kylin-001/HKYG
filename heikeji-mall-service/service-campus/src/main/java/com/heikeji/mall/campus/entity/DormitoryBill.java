package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 宿舍费用账单实体
 */
@Data
@TableName("dormitory_bill")
public class DormitoryBill implements Serializable {

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
     * 类型：electricity-电费，water-水费，accommodation-住宿费，other-其他
     */
    private String type;

    /**
     * 标题
     */
    private String title;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 账期
     */
    private String period;

    /**
     * 截止日期
     */
    private String dueDate;

    /**
     * 支付时间
     */
    private Date paidAt;

    /**
     * 状态：pending-待支付，paid-已支付，overdue-已逾期
     */
    private String status;

    /**
     * 费用明细，JSON格式
     */
    private String details;

    /**
     * 创建时间
     */
    private Date createTime;
}
