package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 宿舍门禁记录实体
 */
@Data
@TableName("dormitory_access_record")
public class DormitoryAccessRecord implements Serializable {

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
     * 类型：in-进入，out-离开
     */
    private String type;

    /**
     * 时间
     */
    private Date time;

    /**
     * 位置
     */
    private String location;

    /**
     * 方式：card-门禁卡，face-人脸识别，password-密码，temporary-临时密码
     */
    private String method;

    /**
     * 状态：success-成功，failed-失败
     */
    private String status;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 创建时间
     */
    private Date createTime;
}
