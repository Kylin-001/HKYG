package com.heikeji.mall.order.domain.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * 订单评价视图对象
 */
@Data
public class OrderReviewVO {
    
    /**
     * 评价ID
     */
    private Long id;
    
    /**
     * 订单编号
     */
    private String orderNo;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名（脱敏显示）
     */
    private String userName;
    
    /**
     * 用户头像
     */
    private String userAvatar;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 商品名称
     */
    private String productName;
    
    /**
     * 商品图片
     */
    private String productImage;
    
    /**
     * 评分（1-5星）
     */
    private Integer rating;
    
    /**
     * 评分文字描述
     */
    private String ratingText;
    
    /**
     * 评价内容
     */
    private String content;
    
    /**
     * 评价图片列表
     */
    private List<String> images;
    
    /**
     * 评价时间
     */
    private Date createTime;
    
    /**
     * 格式化后的时间
     */
    private String formattedTime;
    
    /**
     * 生成评分文字描述
     */
    public String getRatingText() {
        switch (rating) {
            case 5: return "非常满意";
            case 4: return "满意";
            case 3: return "一般";
            case 2: return "不满意";
            case 1: return "非常不满意";
            default: return "未知";
        }
    }
}