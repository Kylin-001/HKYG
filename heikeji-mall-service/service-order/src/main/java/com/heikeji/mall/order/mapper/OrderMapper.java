package com.heikeji.mall.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.heikeji.mall.order.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 璁㈠崟Mapper鎺ュ彛
 */
@Mapper
public interface OrderMapper extends BaseMapper<Order> {
    
    /**
     * 鏍规嵁璁㈠崟鍙锋煡璇㈣鍗?     * @param orderNo 璁㈠崟鍙?     * @return 璁㈠崟淇℃伅
     */
    Order selectByOrderNo(String orderNo);
    
    /**
     * 鏍规嵁鐢ㄦ埛ID鏌ヨ璁㈠崟鍒楄〃
     * @param userId 鐢ㄦ埛ID
     * @return 璁㈠崟鍒楄〃
     */
    List<Order> selectByUserId(Long userId);
    
    /**
     * 鏍规嵁鍟嗗ID鏌ヨ璁㈠崟鍒楄〃
     * @param merchantId 鍟嗗ID
     * @return 璁㈠崟鍒楄〃
     */
    List<Order> selectByMerchantId(Long merchantId);
    
    /**
     * 鏇存柊璁㈠崟鐘舵€?     * @param params 鏇存柊鍙傛暟
     * @return 鏇存柊缁撴灉
     */
    int updateOrderStatus(Map<String, Object> params);
    
    /**
     * 鏌ヨ寰呭鐞嗚鍗?     * @param status 璁㈠崟鐘舵€?     * @return 璁㈠崟鍒楄〃
     */
    List<Order> selectPendingOrders(Integer status);
    
    /**
     * 分页查询用户订单列表
     * @param page 分页参数
     * @param userId 用户ID
     * @param status 订单状态（可选）
     * @return 分页订单列表
     */
    IPage<Order> selectUserOrderListPage(@Param("page") Page<Order> page, @Param("userId") Long userId, @Param("status") Integer status);
}
