package com.heikeji.mall.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;
import java.util.List;

/**
 * 商品分类实体类
 */
@Data
@TableName("category")
public class Category {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String icon;
    private Integer sortOrder;
    private Integer status;
    private Date createTime;
    private Date updateTime;
    private Integer delFlag;
    
    // 父分类ID，0表示顶级分类
    private Long parentId;
    
    // 分类层级，从1开始
    private Integer level;
    
    // 子分类列表，非数据库字段
    @TableField(exist = false)
    private List<Category> children;
}