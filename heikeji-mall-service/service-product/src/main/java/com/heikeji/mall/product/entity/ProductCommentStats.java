package com.heikeji.mall.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

/**
 * 商品评价统计实体类
 */
@Data
@TableName("product_comment_stats")
public class ProductCommentStats {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private Integer totalCount;
    private Integer fiveStarCount;
    private Integer fourStarCount;
    private Integer threeStarCount;
    private Integer twoStarCount;
    private Integer oneStarCount;
    private Double averageScore;
    private Integer hasImageCount;
    private Date updateTime;
}
