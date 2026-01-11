package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.order.entity.OrderReviewLike;
import org.apache.ibatis.annotations.Mapper;

/**
 * 订单评价点赞Mapper接口
 */
@Mapper
public interface OrderReviewLikeMapper extends BaseMapper<OrderReviewLike> {
}
