package com.heikeji.mall.order.domain.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 璁㈠崟鍒楄〃VO绫? * 鐢ㄤ簬璁㈠崟鍒楄〃椤甸潰鐨勬暟鎹睍绀? */
@Data
public class OrderListVO {
    /**
     * 璁㈠崟ID
     */
    private Long id;
    
    /**
     * 璁㈠崟鍙?     */
    private String orderNo;
    
    /**
     * 璁㈠崟鐘舵€?     */
    private Integer status;
    
    /**
     * 璁㈠崟鎬婚噾棰?     */
    private BigDecimal totalAmount;
    
    /**
     * 杩愯垂閲戦
     */
    private BigDecimal freightAmount;
    
    /**
     * 鍒涘缓鏃堕棿
     */
    private Date createTime;
    
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
    }
}
