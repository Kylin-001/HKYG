package com.heikeji.mall.takeout.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

/**
 * 外卖配送轨迹实体类
 */
@Data
@TableName("takeout_delivery_track")
public class TakeoutDeliveryTrack implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 外卖订单ID */
    private Long takeoutOrderId;
    
    /** 订单号 */
    private String orderNo;
    
    /** 配送员ID */
    private Long deliveryPersonId;
    
    /** 配送员姓名 */
    private String deliveryPersonName;
    
    /** 配送状态：0-待接单，1-已接单，2-取餐中，3-配送中，4-已送达，5-已取消 */
    private Integer status;
    
    /** 状态描述 */
    private String statusDesc;
    
    /** 纬度 */
    private Double latitude;
    
    /** 经度 */
    private Double longitude;
    
    /** 位置描述 */
    private String locationDesc;
    
    /** 创建时间 */
    private Date createTime;
    
    /** 更新时间 */
    private Date updateTime;
}
