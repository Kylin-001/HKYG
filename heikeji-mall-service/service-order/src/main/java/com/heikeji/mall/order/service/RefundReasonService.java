package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.entity.RefundReason;

import java.util.List;

/**
 * 退款原因Service
 */
public interface RefundReasonService extends IService<RefundReason> {
    /**
     * 获取所有启用的退款原因
     * @return 退款原因列表
     */
    List<RefundReason> getEnabledRefundReasons();
    
    /**
     * 新增退款原因
     * @param refundReason 退款原因
     * @return 是否成功
     */
    boolean saveRefundReason(RefundReason refundReason);
    
    /**
     * 更新退款原因
     * @param refundReason 退款原因
     * @return 是否成功
     */
    boolean updateRefundReason(RefundReason refundReason);
    
    /**
     * 删除退款原因
     * @param id 退款原因ID
     * @return 是否成功
     */
    boolean deleteRefundReason(Long id);
    
    /**
     * 批量删除退款原因
     * @param ids 退款原因ID列表
     * @return 是否成功
     */
    boolean deleteBatchRefundReason(List<Long> ids);
    
    /**
     * 启用/禁用退款原因
     * @param id 退款原因ID
     * @param status 状态 1:启用 0:禁用
     * @return 是否成功
     */
    boolean updateRefundReasonStatus(Long id, Integer status);
}