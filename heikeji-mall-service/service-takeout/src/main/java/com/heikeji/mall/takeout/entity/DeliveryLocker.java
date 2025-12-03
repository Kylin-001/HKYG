package com.heikeji.mall.takeout.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

/**
 * 配送柜实体类
 */
@Data
@TableName("delivery_locker")
public class DeliveryLocker implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 配送柜编码 */
    private String lockerCode;
    
    /** 配送柜名称 */
    private String name;
    
    /** 位置描述 */
    private String location;
    
    /** 校区 */
    private String campusArea;
    
    /** 总格口数 */
    private Integer totalCells;
    
    /** 可用格口数 */
    private Integer availableCells;
    
    /** 状态：0-正常，-1-故障 */
    private Integer status;
    
    /** 创建时间 */
    private Date createTime;
    
    /** 更新时间 */
    private Date updateTime;
    
    /**
     * 获取可用格口数
     * @return 可用格口数
     */
    public Integer getAvailableCount() {
        return availableCells;
    }
    
    /**
     * 设置可用格口数
     * @param availableCount 可用格口数
     */
    public void setAvailableCount(Integer availableCount) {
        this.availableCells = availableCount;
    }
}