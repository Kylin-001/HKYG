package com.heikeji.mall.order.dto;

import com.heikeji.mall.order.entity.OrderItem;
import lombok.Data;

import java.util.List;

/**
 * 璁㈠崟鍒涘缓璇锋眰DTO
 */
@Data
public class OrderDTO {
    
    /**
     * 鍟嗗ID
     */
    private Long merchantId;
    
    /**
     * 璁㈠崟绫诲瀷锛?-鏅€氳鍗曪紝2-澶栧崠璁㈠崟锛?-璺戣吙璁㈠崟
     */
    private Integer orderType;
    
    /**
     * 鏀惰揣浜哄鍚?     */
    private String receiverName;
    
    /**
     * 鏀惰揣浜虹數璇?     */
    private String receiverPhone;
    
    /**
     * 鏀惰揣鍦板潃
     */
    private String receiverAddress;
    
    /**
     * 璁㈠崟澶囨敞
     */
    private String remark;
    
    /**
     * 璁㈠崟鍟嗗搧鍒楄〃
     */
    private List<OrderItem> orderItems;
}
