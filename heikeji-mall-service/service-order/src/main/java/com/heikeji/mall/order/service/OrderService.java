package com.heikeji.mall.order.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.heikeji.mall.order.domain.vo.OrderDetailVO;
import com.heikeji.mall.order.domain.vo.OrderListVO;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderItem;
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
}
