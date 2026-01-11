package com.heikeji.mall.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

/**
 * 退款原因实体类
 */
@Data
@TableName("refund_reason")
public class RefundReason {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String reasonName;
    private Integer sort;
    private Integer status;
    private String remark;
    private Date createTime;
    private Date updateTime;
}