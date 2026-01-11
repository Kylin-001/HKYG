package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.domain.vo.OrderDetailVO;
import com.heikeji.mall.order.domain.vo.OrderListVO;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderItem;
import java.math.BigDecimal;
import java.util.Date;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;

import java.util.List;
import java.util.Map;

/**
 * 璁㈠崟鏈嶅姟鎺ュ彛
 */
public interface OrderService extends IService<Order> {

    /**
     * 创建外卖订单
     * @param userId 用户ID
     * @param orderNo 订单号
     * @param dto 外卖订单DTO
     * @return 订单ID
     */
    Long createTakeoutOrder(Long userId, String orderNo, CreateTakeoutOrderDTO dto);

    /**
     * 鍒涘缓璁㈠崟鍟嗗搧鏄庣粏
     * @param orderId 璁㈠崟ID
     * @param orderNo 璁㈠崟鍙?     * @param items 璁㈠崟鍟嗗搧鍒楄〃
     * @return 鏄惁鎴愬姛
     */
    Boolean createOrderItems(Long orderId, String orderNo, List<?> items);

    /**
     * 鏍规嵁璁㈠崟鍙锋煡璇㈣鍗?     * @param orderNo 璁㈠崟鍙?     * @return 璁㈠崟淇℃伅
     */
    Order getByOrderNo(String orderNo);
    
    /**
     * 鏍规嵁璁㈠崟鍙峰拰鐢ㄦ埛ID鏌ヨ璁㈠崟
     * @param orderNo 璁㈠崟鍙?     * @param userId 鐢ㄦ埛ID
     * @return 璁㈠崟淇℃伅
     */
    Order getByOrderNoAndUserId(String orderNo, Long userId);

    /**
     * 鏇存柊璁㈠崟鐘舵€?     * @param orderNo 璁㈠崟鍙?     * @param status 璁㈠崟鐘舵€?     * @return 鏄惁鎴愬姛
     */
    Boolean updateOrderStatus(String orderNo, Integer status);

    /**
     * 鏀粯璁㈠崟
     * @param orderNo 璁㈠崟鍙?     * @param payType 鏀粯鏂瑰紡
     * @return 鏄惁鎴愬姛
     */
    Boolean payOrder(String orderNo, Integer payType);
    
    /**
     * 鏀粯璁㈠崟锛堝甫鐢ㄦ埛楠岃瘉锛?     * @param orderNo 璁㈠崟鍙?     * @param payType 鏀粯鏂瑰紡
     * @param userId 鐢ㄦ埛ID
     * @return 鏀粯缁撴灉淇℃伅
     */
    Map<String, Object> payOrder(String orderNo, Integer payType, Long userId);

    /**
     * 鍙栨秷璁㈠崟
     * @param orderNo 璁㈠崟鍙?     * @return 鏄惁鎴愬姛
     */
    Boolean cancelOrder(String orderNo);
    
    /**
     * 鍙栨秷璁㈠崟锛堝甫鐢ㄦ埛楠岃瘉锛?     * @param orderNo 璁㈠崟鍙?     * @param userId 鐢ㄦ埛ID
     * @return 鏄惁鎴愬姛
     */
    Boolean cancelOrder(String orderNo, Long userId);
    
    /**
     * 鍒涘缓鍟嗗搧璁㈠崟
     * @param userId 鐢ㄦ埛ID
     * @param addressId 鍦板潃ID
     * @return 璁㈠崟淇℃伅
     */
    Order createOrder(Long userId, Long addressId);
    
    /**
     * 鍒涘缓鍟嗗搧璁㈠崟锛堟墿灞曠増鏈紝鏀寔鏇村鍙傛暟锛?     * @param userId 鐢ㄦ埛ID
     * @param addressId 鍦板潃ID
     * @param payType 鏀粯鏂瑰紡
     * @param orderRemark 璁㈠崟澶囨敞
     * @param couponCode 浼樻儬鐮?     * @return 璁㈠崟淇℃伅
     */
    Order createOrder(Long userId, Long addressId, Integer payType, String orderRemark, String couponCode);
    
    /**
     * 鐩存帴璐拱鍟嗗搧鍒涘缓璁㈠崟
     * @param userId 鐢ㄦ埛ID
     * @param addressId 鍦板潃ID
     * @param productId 鍟嗗搧ID
     * @param productNum 鍟嗗搧鏁伴噺
     * @param payType 鏀粯鏂瑰紡
     * @param orderRemark 璁㈠崟澶囨敞
     * @param couponCode 浼樻儬鐮?     * @return 璁㈠崟淇℃伅
     */
    Order createDirectBuyOrder(Long userId, Long addressId, Long productId, Integer productNum, Integer payType, String orderRemark, String couponCode);
    
    /**
     * 纭鏀惰揣
     * @param orderNo 璁㈠崟鍙?     * @return 鏄惁鎴愬姛
     */
    Boolean confirmReceipt(String orderNo);
    
    /**
     * 纭鏀惰揣锛堝甫鐢ㄦ埛楠岃瘉锛?     * @param orderNo 璁㈠崟鍙?     * @param userId 鐢ㄦ埛ID
     * @return 鏄惁鎴愬姛
     */
    Boolean confirmReceipt(String orderNo, Long userId);
    
    /**
     * 鏍规嵁鐢ㄦ埛ID鍜岀姸鎬佽幏鍙栬鍗曞垪琛?     * @param userId 鐢ㄦ埛ID
     * @param status 璁㈠崟鐘舵€?     * @return 璁㈠崟鍒楄〃
     */
    List<OrderListVO> getOrderListByUserIdAndStatus(Long userId, Integer status);
    
    /**
     * 鏍规嵁璁㈠崟鍙峰拰鐢ㄦ埛ID鑾峰彇璁㈠崟璇︽儏
     * @param orderNo 璁㈠崟鍙?     * @param userId 鐢ㄦ埛ID
     * @return 璁㈠崟璇︽儏
     */
    OrderDetailVO getOrderDetailByOrderNo(String orderNo, Long userId);
    
    /**
     * 鑾峰彇鐢ㄦ埛璁㈠崟鍒嗛〉鍒楄〃
     * @param userId 鐢ㄦ埛ID
     * @param status 璁㈠崟鐘舵€?     * @param page 椤电爜
     * @param limit 姣忛〉鏁伴噺
     * @return 鍒嗛〉璁㈠崟鏁版嵁
     */
    Map<String, Object> getUserOrderList(Long userId, Integer status, Integer page, Integer limit);
    
    /**
     * 鑾峰彇寰呭鐞嗚鍗曞垪琛?     * @return 寰呭鐞嗚鍗曞垪琛?     */
    List<Order> getPendingOrders();
    
    /**
     * 处理支付回调
     * @param orderNo 订单号
     * @param payStatus 支付状态
     * @param payTradeNo 支付交易号
     * @param payTime 支付时间
     * @return 是否处理成功
     */
    Boolean handlePaymentCallback(String orderNo, Integer payStatus, String payTradeNo, Date payTime);
    
    /**
     * 更新订单支付状态
     * @param orderNo 订单号
     * @param payStatus 支付状态
     * @return 是否更新成功
     */
    Boolean updatePayStatus(String orderNo, Integer payStatus);
    
    /**
     * 支付成功后的订单处理
     * @param orderNo 订单号
     * @param payTradeNo 支付交易号
     * @param payTime 支付时间
     * @return 是否处理成功
     */
    Boolean processPaySuccess(String orderNo, String payTradeNo, Date payTime);
    
    /**
     * 检查并取消超时未支付的订单
     * @return 取消成功的订单数量
     */
    int cancelTimeoutOrders();
    
    /**
     * 自动确认超时未收货的订单
     * @return 确认收货的订单数量
     */
    int autoConfirmReceivedOrders();
    
    /**
     * 申请退款
     * @param orderNo 订单号
     * @param userId 用户ID
     * @param refundReason 退款原因
     * @param refundAmount 退款金额
     * @return 是否申请成功
     */
    Boolean applyRefund(String orderNo, Long userId, String refundReason, BigDecimal refundAmount);
    
    /**
     * 处理退款申请
     * @param orderNo 订单号
     * @param status 处理状态
     * @param handler 处理人
     * @return 是否处理成功
     */
    Boolean processRefund(String orderNo, Integer status, String handler);
    
    /**
     * 获取退款中的订单
     * @return 退款中订单列表
     */
    List<Order> getRefundingOrders();
    
    /**
     * 退款成功后的订单处理
     * @param orderNo 订单号
     * @param refundTradeNo 退款交易号
     * @param refundTime 退款时间
     * @return 是否处理成功
     */
    Boolean processRefundSuccess(String orderNo, String refundTradeNo, Date refundTime);
    
    /**
     * 退款失败后的订单处理
     * @param orderNo 订单号
     * @param failReason 失败原因
     * @return 是否处理成功
     */
    Boolean processRefundFail(String orderNo, String failReason);
    
    /**
     * 获取订单的退款日志
     * @param orderId 订单ID
     * @return 退款日志列表
     */
    List<Map<String, Object>> getOrderRefundLogs(Long orderId);
    
    /**
     * 获取订单的退款日志
     * @param orderNo 订单号
     * @return 退款日志列表
     */
    List<Map<String, Object>> getOrderRefundLogsByOrderNo(String orderNo);
    
    /**
     * 获取退款统计数据
     * @return 退款统计数据
     */
    Map<String, Object> getRefundStatistics();
    
    /**
     * 获取退款原因分布
     * @return 退款原因分布列表
     */
    List<Map<String, Object>> getRefundReasonDistribution();
    
    /**
     * 获取退款状态分布
     * @return 退款状态分布列表
     */
    List<Map<String, Object>> getRefundStatusDistribution();
    
    /**
     * 获取退款金额区间分布
     * @return 退款金额区间分布列表
     */
    List<Map<String, Object>> getRefundAmountRangeDistribution();
    
    /**
     * 按时间范围获取退款统计数据
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 退款统计数据
     */
    Map<String, Object> getRefundStatisticsByTimeRange(Date startTime, Date endTime);
    
    /**
     * 获取订单统计数据
     * @return 订单统计数据
     */
    Map<String, Object> getOrderStatistics();
    
    /**
     * 按时间范围获取订单统计数据
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 订单统计数据
     */
    Map<String, Object> getOrderStatisticsByTimeRange(Date startTime, Date endTime);
    
    /**
     * 获取订单状态分布
     * @return 订单状态分布列表
     */
    List<Map<String, Object>> getOrderStatusDistribution();
    
    /**
     * 获取订单金额区间分布
     * @return 订单金额区间分布列表
     */
    List<Map<String, Object>> getOrderAmountRangeDistribution();
    
    /**
     * 获取订单趋势数据
     * @param type 时间类型：day, week, month
     * @param count 数量
     * @return 订单趋势数据列表
     */
    List<Map<String, Object>> getOrderTrend(String type, Integer count);
    
    /**
     * 获取热门商品订单统计
     * @param limit 数量限制
     * @return 热门商品订单统计列表
     */
    List<Map<String, Object>> getHotProductsOrderStatistics(Integer limit);
    
    /**
     * 获取用户订单统计
     * @param userId 用户ID
     * @return 用户订单统计数据
     */
    Map<String, Object> getUserOrderStatistics(Long userId);
    
    /**
     * 智能分配订单给商家
     * @param order 订单对象
     * @return 是否分配成功
     */
    Boolean intelligentAssignOrder(Order order);
    
    /**
     * 根据订单ID分配订单
     * @param orderId 订单ID
     * @return 是否分配成功
     */
    Boolean assignOrderById(Long orderId);
    
    /**
     * 获取商家当前订单负载
     * @param merchantId 商家ID
     * @return 商家当前订单负载
     */
    Integer getMerchantOrderLoad(Long merchantId);
    
    /**
     * 获取推荐的商家列表
     * @param order 订单对象
     * @param limit 数量限制
     * @return 推荐商家列表
     */
    List<Map<String, Object>> getRecommendedMerchants(Order order, Integer limit);
}
