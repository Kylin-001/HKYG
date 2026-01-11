package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.order.entity.RefundReason;
import org.apache.ibatis.annotations.Mapper;

/**
 * 退款原因Mapper
 */
@Mapper
public interface RefundReasonMapper extends BaseMapper<RefundReason> {
}