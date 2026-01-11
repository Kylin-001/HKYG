package com.heikeji.mall.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 商品实体类
 */
@Data
@TableName("product")
public class Product implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("store_id")
    private Long merchantId;
    
    @TableField("category_id")
    private Long categoryId;
    
    private String name;
    
    @TableField("description")
    private String subtitle;
    
    @TableField("images")
    private String mainImage;
    
    @TableField(exist = false)
    private String images;
    
    private BigDecimal price;
    
    @TableField("original_price")
    private BigDecimal originalPrice;
    
    private Integer stock;
    
    @TableField(exist = false)
    private Integer lockedStock;
    
    @TableField("sales_count")
    private Integer sales;
    
    @TableField("description")
    private String detail;
    
    private Integer status;
    
    @TableField(exist = false)
    private Integer sortOrder;
    
    @TableField("created_at")
    private Date createTime;
    
    @TableField("updated_at")
    private Date updateTime;
    
    @TableField(exist = false)
    private Integer delFlag;
    
    @TableField(exist = false)
    private Integer version;
    
    /**
     * 是否新品
     */
    @TableField(exist = false)
    private Integer isNew;
    
    /**
     * 是否推荐
     */
    @TableField("is_featured")
    private Integer isRecommend;
    
    /**
     * 库存预警阈值
     */
    @TableField(exist = false)
    private Integer alertStock;
}