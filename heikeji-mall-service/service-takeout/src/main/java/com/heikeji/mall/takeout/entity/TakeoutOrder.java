package com.heikeji.mall.takeout.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 外卖订单实体类
 */
@Data
@TableName("takeout_order")
public class TakeoutOrder implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;
    
    /** 关联订单ID */
    private Long orderId;
    
    /** 订单号 */
    private String orderNo;
    
    /** 商家ID */
    private Long merchantId;
    
    /** 用户ID */
    private Long userId;
    
    /** 配送方式：1-外卖柜，2-特殊地点，3-送到宿舍 */
    private Integer deliveryType;
    
    /** 外卖柜编码（配送方式为外卖柜时使用） */
    private String deliveryLockerCode;
    
    /** 特殊配送地点描述（如：宿舍楼门口外卖区） */
    private String deliverySpecialPlace;
    
    /** 宿舍楼栋（送到宿舍时使用） */
    private String deliveryDormBuilding;
    
    /** 宿舍房间号（送到宿舍时使用） */
    private String deliveryDormRoom;
    
    /** 配送员ID */
    private Long deliveryPersonId;
    
    /** 配送员姓名 */
    private String deliveryPersonName;
    
    /** 配送员电话 */
    private String deliveryPersonPhone;
    
    /** 收货人姓名 */
    private String receiverName;
    
    /** 收货人电话 */
    private String receiverPhone;
    
    /** 收货地址 */
    private String receiverAddress;
    
    /** 预计送达时间 */
    private Date estimatedTime;
    
    /** 实际送达时间 */
    private Date actualTime;
    
    /** 配送状态：0-待接单，1-已接单，2-配送中，3-已送达，4-已取消 */
    private Integer status;
    
    /** 备注 */
    private String remark;
    
    /** 创建时间 */
    private Date createTime;
    
    /** 更新时间 */
    private Date updateTime;
    
    /** 订单总金额 */
    private BigDecimal totalAmount;
    
    /** 配送费 */
    private BigDecimal deliveryFee;
    
    /** 支付状态：0-未支付，1-已支付 */
    private Integer paymentStatus;
    
    /** 支付方式：1-微信支付，2-支付宝，3-校园卡支付 */
    private Integer paymentMethod;
    
    /** 支付时间 */
    private Date paymentTime;
    
    /** 支付流水号 */
    private String paymentNo;
    
    /** 第三方支付交易号 */
    private String transactionId;
    
    /**
     * 获取订单总金额
     * @return 订单总金额
     */
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
}