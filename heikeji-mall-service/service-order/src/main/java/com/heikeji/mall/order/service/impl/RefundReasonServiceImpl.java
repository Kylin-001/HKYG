package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.entity.RefundReason;
import com.heikeji.mall.order.mapper.RefundReasonMapper;
import com.heikeji.mall.order.service.RefundReasonService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Date;

/**
 * 退款原因Service实现类
 */
@Service
public class RefundReasonServiceImpl extends ServiceImpl<RefundReasonMapper, RefundReason> implements RefundReasonService {
    
    @Override
    public List<RefundReason> getEnabledRefundReasons() {
        QueryWrapper<RefundReason> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 1)
                    .orderByAsc("sort");
        return baseMapper.selectList(queryWrapper);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean saveRefundReason(RefundReason refundReason) {
        Date now = new Date();
        refundReason.setCreateTime(now);
        refundReason.setUpdateTime(now);
        return this.save(refundReason);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateRefundReason(RefundReason refundReason) {
        refundReason.setUpdateTime(new Date());
        return this.updateById(refundReason);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteRefundReason(Long id) {
        return this.removeById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteBatchRefundReason(List<Long> ids) {
        return this.removeByIds(ids);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateRefundReasonStatus(Long id, Integer status) {
        RefundReason refundReason = new RefundReason();
        refundReason.setId(id);
        refundReason.setStatus(status);
        refundReason.setUpdateTime(new Date());
        return this.updateById(refundReason);
    }
}