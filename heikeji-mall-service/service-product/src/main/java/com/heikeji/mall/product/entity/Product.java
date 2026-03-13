package com.heikeji.mall.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 商品实体类
 */
@Data
@Getter
@Setter
@TableName("product")
public class Product implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    @TableField("category_id")
    private Long categoryId;
    
    @TableField("store_id")
    private Long merchantId;
    
    private BigDecimal price;
    
    @TableField("original_price")
    private BigDecimal originalPrice;
    
    private Integer stock;
    
    @TableField("sales_count")
    private Integer sales;
    
    private String images;
    
    private String description;
    
    private String specifications;
    
    private Integer status;
    
    @TableField("is_featured")
    private Integer isRecommend;
    
    @TableField("created_at")
    private Date createTime;
    
    @TableField("updated_at")
    private Date updateTime;
    
    @TableField(exist = false)
    private String subtitle;
    
    @TableField(exist = false)
    private Integer lockedStock;
    
    @TableField(exist = false)
    private Integer alertStock;
    
    @TableField(exist = false)
    private String mainImage;
    
    @TableField(exist = false)
    private String detail;
    
    @TableField(exist = false)
    private Integer sortOrder;
    
    @TableField(exist = false)
    private Integer delFlag;
    
    @TableField(exist = false)
    private Integer version;
    
    @TableField(exist = false)
    private Integer isNew;
}
