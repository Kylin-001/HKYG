package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍临时密码实体
 */
@Data
@TableName("dormitory_temp_password")
public class DormitoryTempPassword implements Serializable {

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
     * 密码
     */
    private String code;

    /**
     * 有效期开始
     */
    private Date validFrom;

    /**
     * 有效期结束
     */
    private Date validTo;

    /**
     * 使用次数限制
     */
    private Integer usageLimit;

    /**
     * 已使用次数
     */
    private Integer usageCount;

    /**
     * 状态：active-有效，expired-已过期，disabled-已禁用
     */
    private String status;

    /**
     * 用途说明
     */
    private String purpose;

    /**
     * 创建时间
     */
    private Date createTime;
}
