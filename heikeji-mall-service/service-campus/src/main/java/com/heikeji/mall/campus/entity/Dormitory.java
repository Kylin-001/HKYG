package com.heikeji.mall.campus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 宿舍信息实体
 */
@Data
@TableName("dormitory")
public class Dormitory implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 楼栋
     */
    private String building;

    /**
     * 房间号
     */
    private String room;

    /**
     * 地址
     */
    private String address;

    /**
     * 楼层
     */
    private Integer floor;

    /**
     * 宿舍类型：四人间/六人间/八人间
     */
    private String type;

    /**
     * 容量
     */
    private Integer capacity;

    /**
     * 当前入住人数
     */
    private Integer currentOccupancy;

    /**
     * 性别：male-男，female-女
     */
    private String gender;

    /**
     * 设施配置，JSON格式
     */
    private String facilities;

    /**
     * 电费余额
     */
    private BigDecimal electricBalance;

    /**
     * 本月用电量
     */
    private BigDecimal electricUsed;

    /**
     * 水费余额
     */
    private BigDecimal waterBalance;

    /**
     * 本月用水量
     */
    private BigDecimal waterUsed;

    /**
     * 状态：0-禁用，1-启用
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
