package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.RefundLog;

import java.util.List;

/**
 * 退款日志Service
 */
public interface RefundLogService extends IService<RefundLog> {
    /**
     * 添加退款日志
     * @param refundLog 退款日志
     * @return 是否成功
     */
    boolean addRefundLog(RefundLog refundLog);
    
    /**
     * 根据订单ID获取退款日志
     * @param orderId 订单ID
     * @return 退款日志列表
     */
    List<RefundLog> getRefundLogByOrderId(Long orderId);
    
    /**
     * 根据订单号获取退款日志
     * @param orderNo 订单号
     * @return 退款日志列表
     */
    List<RefundLog> getRefundLogByOrderNo(String orderNo);
    
    /**
     * 批量添加退款日志
     * @param refundLogs 退款日志列表
     * @return 是否成功
     */
    boolean addBatchRefundLog(List<RefundLog> refundLogs);
}