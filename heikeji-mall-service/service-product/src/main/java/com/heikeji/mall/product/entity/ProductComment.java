package com.heikeji.mall.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

/**
 * 商品评价实体类
 */
@Data
@TableName("product_comment")
public class ProductComment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private Long userId;
    private String username;
    private Long orderId;
    private Integer score;
    private String content;
    private String images;
    private Integer status;
    private Integer replyStatus;
    private String replyContent;
    private Date replyTime;
    private Date createTime;
    private Date updateTime;
    private Integer delFlag;
}
