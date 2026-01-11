package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.entity.RefundLog;
import com.heikeji.mall.order.mapper.RefundLogMapper;
import com.heikeji.mall.order.service.RefundLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * 退款日志Service实现类
 */
@Service
public class RefundLogServiceImpl extends ServiceImpl<RefundLogMapper, RefundLog> implements RefundLogService {
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addRefundLog(RefundLog refundLog) {
        refundLog.setCreateTime(new Date());
        return this.save(refundLog);
    }
    
    @Override
    public List<RefundLog> getRefundLogByOrderId(Long orderId) {
        QueryWrapper<RefundLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id", orderId)
                    .orderByDesc("create_time");
        return baseMapper.selectList(queryWrapper);
    }
    
    @Override
    public List<RefundLog> getRefundLogByOrderNo(String orderNo) {
        QueryWrapper<RefundLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo)
                    .orderByDesc("create_time");
        return baseMapper.selectList(queryWrapper);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addBatchRefundLog(List<RefundLog> refundLogs) {
        // 设置创建时间
        Date now = new Date();
        for (RefundLog refundLog : refundLogs) {
            refundLog.setCreateTime(now);
        }
        return this.saveBatch(refundLogs);
    }
}