package com.heikeji.mall.takeout.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 外卖订单DTO
 */
@Data
public class TakeoutOrderDTO {
    
    /** 商家ID */
    @NotNull(message = "商家ID不能为空")
    private Long merchantId;
    
    /** 配送方式：1-外卖柜，2-特殊地点，3-送到宿舍 */
    @NotNull(message = "配送方式不能为空")
    private Integer deliveryType;
    
    /** 外卖柜编码（配送方式为外卖柜时使用） */
    private String deliveryLockerCode;
    
    /** 特殊配送地点描述 */
    private String deliverySpecialPlace;
    
    /** 宿舍楼栋（送到宿舍时使用） */
    private String deliveryDormBuilding;
    
    /** 宿舍房间号（送到宿舍时使用） */
    private String deliveryDormRoom;
    
    /** 收货人姓名 */
    @NotNull(message = "收货人姓名不能为空")
    private String receiverName;
    
    /** 收货人电话 */
    @NotNull(message = "收货人电话不能为空")
    private String receiverPhone;
    
    /** 收货地址 */
    @NotNull(message = "收货地址不能为空")
    private String receiverAddress;
    
    /** 订单商品列表 */
    @NotNull(message = "订单商品不能为空")
    private List<OrderItemDTO> orderItems;
    
    /** 订单备注 */
    private String remark;
    
    /**
     * 订单商品DTO
     */
    @Data
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
        private BigDecimal price;
    }
}