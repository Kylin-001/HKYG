package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.order.entity.RefundLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 退款日志Mapper
 */
@Mapper
public interface RefundLogMapper extends BaseMapper<RefundLog> {
}