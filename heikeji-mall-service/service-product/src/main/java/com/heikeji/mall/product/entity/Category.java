package com.heikeji.mall.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.util.List;

/**
 * 商品分类实体类
 */
@Data
@TableName("category")
public class Category implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    
    // 父分类ID，0表示顶级分类
    private Long parentId;
    
    private Integer sortOrder;
    
    // 子分类列表，非数据库字段
    @TableField(exist = false)
    private List<Category> children;
}