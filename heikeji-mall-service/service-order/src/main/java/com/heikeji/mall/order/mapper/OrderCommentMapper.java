package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.order.entity.OrderComment;
import org.apache.ibatis.annotations.Mapper;

/**
 * 订单评价Mapper
 */
@Mapper
public interface OrderCommentMapper extends BaseMapper<OrderComment> {
}