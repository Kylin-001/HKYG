package com.heikeji.mall.order.domain.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 璁㈠崟璇︽儏VO绫? * 鐢ㄤ簬璁㈠崟璇︽儏椤甸潰鐨勬暟鎹睍绀? */
@Data
public class OrderDetailVO {
    /**
     * 璁㈠崟ID
     */
    private Long id;
    
    /**
     * 璁㈠崟鍙?     */
    private String orderNo;
    
    /**
     * 璁㈠崟绫诲瀷
     */
    private Integer orderType;
    
    /**
     * 璁㈠崟鐘舵€?     */
    private Integer status;
    
    /**
     * 订单状态名称
     */
    private String statusName;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 商家ID
     */
    private Long merchantId;
    
    /**
     * 鏀粯鐘舵€?     */
    private Integer payStatus;
    
    /**
     * 鏀粯鏂瑰紡
     */
    private Integer paymentMethod;
    
    /**
     * 鏀粯娴佹按鍙?     */
    private String paymentNo;
    
    /**
     * 鍟嗗搧鎬婚噾棰?     */
    private BigDecimal totalAmount;
    
    /**
     * 瀹為檯鏀粯閲戦
     */
    private BigDecimal payAmount;
    
    /**
     * 杩愯垂閲戦
     */
    private BigDecimal freightAmount;
    
    /**
     * 鏀惰揣浜哄鍚?     */
    private String receiverName;
    
    /**
     * 鏀惰揣浜虹數璇?     */
    private String receiverPhone;
    
    /**
     * 鏀惰揣浜虹渷浠?     */
    private String receiverProvince;
    
    /**
     * 鏀惰揣浜哄煄甯?     */
    private String receiverCity;
    
    /**
     * 鏀惰揣浜哄尯鍘?     */
    private String receiverDistrict;
    
    /**
     * 璇︾粏鍦板潃
     */
    private String receiverAddress;
    
    /**
     * 閰嶉€佹柟寮?     */
    private Integer deliveryType;
    
    /**
     * 鐗╂祦鍏徃
     */
    private String logisticsCompany;
    
    /**
     * 鐗╂祦鍗曞彿
     */
    private String trackingNumber;
    
    /**
     * 璁㈠崟澶囨敞
     */
    private String remark;
    
    /**
     * 鍒涘缓鏃堕棿
     */
    private Date createTime;
    
    /**
     * 鏀粯鏃堕棿
     */
    private Date payTime;
    
    /**
     * 鍙戣揣鏃堕棿
     */
    private Date shipTime;
    
    /**
     * 瀹屾垚鏃堕棿
     */
    private Date completeTime;
    
    /**
     * 璁㈠崟鍟嗗搧鍒楄〃
     */
    private List<OrderItemVO> orderItems;
    
    /**
     * 璁㈠崟鍟嗗搧鏄庣粏VO绫?     */
    @Data
    public static class OrderItemVO {
        /**
         * 鍟嗗搧ID
         */
        private Long productId;
        
        /**
         * 鍟嗗搧鍚嶇О
         */
        private String productName;
        
        /**
         * 鍟嗗搧鍥剧墖
         */
        private String productImage;
        
        /**
         * 鍟嗗搧浠锋牸
         */
        private BigDecimal price;
        
        /**
         * 璐拱鏁伴噺
         */
        private Integer quantity;
        
        /**
         * 鍟嗗搧鎬婚噾棰?         */
        private BigDecimal totalPrice;
    }
}
