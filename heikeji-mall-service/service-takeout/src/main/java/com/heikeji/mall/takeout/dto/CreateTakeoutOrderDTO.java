package com.heikeji.mall.takeout.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 创建外卖订单请求DTO
 */
@Data
public class CreateTakeoutOrderDTO {
    
    /** 商家ID */
    private Long merchantId;
    
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
    
    /** 收货人姓名 */
    private String receiverName;
    
    /** 收货人电话 */
    private String receiverPhone;
    
    /** 收货地址 */
    private String receiverAddress;
    
    /** 订单商品列表 */
    private List<OrderItemDTO> orderItems;
    
    /** 备注 */
    private String remark;
    
    /** 订单商品项 */
    @Data
    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
        private BigDecimal price;
    }
}