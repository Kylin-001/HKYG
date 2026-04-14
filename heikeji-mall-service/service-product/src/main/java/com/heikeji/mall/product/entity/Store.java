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
 * 店铺/商家实体类
 */
@Data
@TableName("store")
public class Store implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String description;

    private String logo;

    private String address;

    private String phone;

    private String businessHours;

    private BigDecimal minPrice;

    private BigDecimal deliveryFee;

    private BigDecimal rating;

    private Integer sales;

    private Integer status;

    @TableField("created_at")
    private Date createTime;

    @TableField("updated_at")
    private Date updateTime;
}
