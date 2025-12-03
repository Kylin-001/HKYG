package com.heikeji.mall.order.domain.dto;

import lombok.Data;

import java.util.List;

/**
 * 订单评价数据传输对象
 */
@Data
public class OrderReviewDTO {
    
    /**
     * 订单编号
     */
    private String orderNo;
    
    /**
     * 评价列表
     */
    private List<ProductReviewDTO> reviews;
    
    /**
     * 商品评价DTO
     */
    @Data
    public static class ProductReviewDTO {
        
        /**
         * 商品ID
         */
        private Long productId;
        
        /**
         * 评分（1-5星）
         */
        private Integer rating;
        
        /**
         * 评价内容
         */
        private String content;
        
        /**
         * 评价图片列表
         */
        private List<String> images;
    }
}