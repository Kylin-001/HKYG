package com.heikeji.mall.takeout.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

/**
 * 外卖柜实体类
 */
@Data
@TableName("takeout_locker")
public class TakeoutLocker implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 外卖柜编码
     */
    private String lockerCode;

    /**
     * 外卖柜名称
     */
    private String name;

    /**
     * 位置描述
     */
    private String location;

    /**
     * 总格槽数
     */
    private Integer totalSlots;

    /**
     * 空闲槽子数
     */
    private Integer availableSlots;

    /**
     * 状态：0-离线 1-在线
     */
    private Integer status;

    /**
     * 最后在线时间
     */
    private Date lastOnlineTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

}