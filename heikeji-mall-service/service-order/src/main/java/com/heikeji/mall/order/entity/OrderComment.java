package com.heikeji.mall.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

/**
 * 订单评价实体类
 */
@Data
@TableName("order_comment")
public class OrderComment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private String orderNo;
    private Long userId;
    private Long productId;
    private String productName;
    private Integer rating;
    private String content;
    private String images;
    private Integer anonymous;
    private Integer status;
    private Long replyId;
    private String replyContent;
    private Date replyTime;
    private Date createTime;
    private Date updateTime;
}