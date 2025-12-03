package com.heikeji.mall.order.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 优惠券实体类
 */
@Data
@TableName("coupon")
public class Coupon {
    @TableId
    private Long id;
    
    /**
     * 优惠券名称
     */
    private String name;
    
    /**
     * 优惠券类型：1-满减券，2-折扣券
     */
    private Integer type;
    
    /**
     * 优惠金额（满减券使用）
     */
    private BigDecimal value;
    
    /**
     * 折扣率（折扣券使用）
     */
    private BigDecimal discount;
    
    /**
     * 最低使用金额
     */
    private BigDecimal minAmount;
    
    /**
     * 开始时间
     */
    private Date startTime;
    
    /**
     * 结束时间
     */
    private Date endTime;
    
    /**
     * 总数量
     */
    private Integer totalCount;
    
    /**
     * 已使用数量
     */
    private Integer usedCount;
    
    /**
     * 状态：0-正常，1-已失效
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