package com.heikeji.mall.delivery.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.delivery.entity.DeliveryEvent;
import com.heikeji.mall.delivery.vo.DeliveryEventVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 配送事件Mapper
 */
@Mapper
public interface DeliveryEventMapper extends BaseMapper<DeliveryEvent> {

    /**
     * 根据订单ID查询配送事件列表
     * @param orderId 订单ID
     * @return 配送事件列表
     */
    @Select("SELECT * FROM delivery_event WHERE order_id = #{orderId} AND deleted = 0 ORDER BY event_time ASC")
    List<DeliveryEvent> selectByOrderId(Long orderId);

    /**
     * 根据订单ID查询配送事件列表（VO格式）
     * @param orderId 订单ID
     * @return 配送事件列表（VO格式）
     */
    List<DeliveryEventVO> selectEventVOByOrderId(Long orderId);
}
