package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍晚归记录实体
 */
@Data
@TableName("dormitory_late_return")
public class DormitoryLateReturn implements Serializable {

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
     * 日期
     */
    private String date;

    /**
     * 应归时间
     */
    private String expectedReturnTime;

    /**
     * 实际归时间
     */
    private String actualReturnTime;

    /**
     * 晚归分钟数
     */
    private Integer lateMinutes;

    /**
     * 晚归原因
     */
    private String reason;

    /**
     * 状态：unreported-未说明，reported-已说明，excused-已豁免，punished-已处理
     */
    private String status;

    /**
     * 记录人
     */
    private String reporter;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date createTime;
}
