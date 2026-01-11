package com.heikeji.mall.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.util.Date;

/**
 * 退款日志实体类
 */
@Data
@TableName("refund_log")
public class RefundLog {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private Long orderId;
    private Integer refundStatus;
    private String refundReason;
    private String operator;
    private String operatorId;
    private String remark;
    private Date createTime;
}