package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.domain.vo.OrderDetailVO;
import com.heikeji.mall.order.domain.vo.OrderListVO;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderItem;
import com.heikeji.mall.order.mapper.OrderItemMapper;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.order.service.CouponService;
import com.heikeji.mall.order.service.OrderItemService;
import com.heikeji.mall.order.service.OrderService;
import com.heikeji.mall.payment.service.PaymentService;
import com.heikeji.mall.product.entity.Cart;
import com.heikeji.mall.product.service.CartService;
import com.heikeji.mall.product.service.ProductService;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO; // 导入外卖订单DTO
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.service.TakeoutOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 订单服务实现类
 */
@Service
@Slf4j
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Autowired
    private OrderMapper orderMapper;
    
    @Autowired
    private OrderItemMapper orderItemMapper;
    
    @Autowired
    private OrderItemService orderItemService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private TakeoutOrderService takeoutOrderService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CartService cartService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createTakeoutOrder(Long userId, String orderNo, CreateTakeoutOrderDTO dto) {
        try {
            // 创建订单对象
            Order order = new Order();
            
            // 使用传入的订单号或生成新的订单号
            if (orderNo == null || orderNo.isEmpty()) {
                orderNo = generateOrderNo();
            }
            
            order.setOrderNo(orderNo);
            order.setUserId(userId);
            order.setOrderType(OrderConstant.ORDER_TYPE_TAKEOUT); // 设置为外卖订单
            
            // 设置订单状态
            order.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
            order.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
            
            // 从dto中提取必要信息
            if (dto != null) {
                // 设置商家ID
                order.setShopId(dto.getMerchantId());
                
                // 根据配送类型设置不同的地址信息
                Integer deliveryType = dto.getDeliveryType();
                order.setDeliveryType(deliveryType);
                
                // 设置配送信息
                switch (dto.getDeliveryType()) {
                    case 1: // 外卖柜
                        order.setDeliveryLockerCode(dto.getDeliveryLockerCode());
                        order.setAddressId(1L); // 外卖柜地址ID
                        break;
                    case 2: // 特殊地点
                        order.setDeliverySpecialPlace(dto.getDeliverySpecialPlace());
                        order.setAddressId(2L); // 特殊地点地址ID
                        break;
                    case 3: // 送到寝室
                        order.setDeliveryDormBuilding(dto.getDeliveryDormBuilding());
                        order.setDeliveryDormRoom(dto.getDeliveryDormRoom());
                        order.setAddressId(3L); // 宿舍地址ID
                        break;
                }
                
                // 设置收货人信息
                order.setReceiverName(dto.getReceiverName());
                order.setReceiverPhone(dto.getReceiverPhone());
                order.setReceiverAddress(dto.getReceiverAddress());
                
                // 设置订单备注
                if (dto.getRemark() != null && !dto.getRemark().isEmpty()) {
                    order.setRemark(dto.getRemark());
                }
                
                // 计算订单总金额
                BigDecimal productTotal = BigDecimal.ZERO;
                if (dto.getOrderItems() != null && !dto.getOrderItems().isEmpty()) {
                    for (var item : dto.getOrderItems()) {
                        // 计算商品总金额
                        BigDecimal itemAmount = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                        productTotal = productTotal.add(itemAmount);
                    }
                }
                
                // 添加配送费（实际项目中应该根据距离、重量等因素计算）
                BigDecimal deliveryFee = getDeliveryFee(order.getAddressId(), dto.getMerchantId());
                
                // 计算总金额
                BigDecimal totalAmount = productTotal.add(deliveryFee);
                order.setDeliveryFee(deliveryFee);
                order.setTotalAmount(totalAmount);
            }
            
            order.setCreateTime(new Date());
            order.setUpdateTime(new Date());
            
            // 保存订单
            orderMapper.insert(order);
            
            // 创建订单商品项
            if (dto != null && dto.getOrderItems() != null && !dto.getOrderItems().isEmpty()) {
                createOrderItems(order.getId(), orderNo, dto.getOrderItems());
            }
            
            // 创建外卖订单
            TakeoutOrder takeoutOrder = new TakeoutOrder();
            takeoutOrder.setOrderId(order.getId());
            takeoutOrder.setOrderNo(orderNo);
            takeoutOrder.setMerchantId(dto.getMerchantId());
            takeoutOrder.setUserId(userId);
            takeoutOrder.setDeliveryType(dto.getDeliveryType());
            takeoutOrder.setDeliveryLockerCode(dto.getDeliveryLockerCode());
            takeoutOrder.setDeliverySpecialPlace(dto.getDeliverySpecialPlace());
            takeoutOrder.setDeliveryDormBuilding(dto.getDeliveryDormBuilding());
            takeoutOrder.setDeliveryDormRoom(dto.getDeliveryDormRoom());
            takeoutOrder.setReceiverName(dto.getReceiverName());
            takeoutOrder.setReceiverPhone(dto.getReceiverPhone());
            takeoutOrder.setReceiverAddress(dto.getReceiverAddress());
            takeoutOrder.setStatus(0); // 待接单
            takeoutOrder.setCreateTime(new Date());
            takeoutOrder.setUpdateTime(new Date());
            
            takeoutOrderService.save(takeoutOrder);
            
            log.info("创建外卖订单成功，订单号：{}，总金额：{}", orderNo, order.getTotalAmount());
            
            return order.getId();
        } catch (Exception e) {
            log.error("创建外卖订单失败, userId={}", userId, e);
            throw new RuntimeException("创建外卖订单失败", e);
        }
    }
    
    /**
     * 获取配送费
     * 实际项目中应该根据距离、时间等因素计算
     */
    private BigDecimal getDeliveryFee(Long addressId, Long shopId) {
        // 模拟获取配送费，实际应该根据地址和商店计算
        return new BigDecimal(5); // 示例配送费
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean createOrderItems(Long orderId, String orderNo, List<?> items) {
        try {
            if (items == null || items.isEmpty()) {
                return false;
            }
            
            // 为每个商品创建订单项
            for (Object item : items) {
                OrderItem orderItem = new OrderItem();
                
                if (item instanceof CreateTakeoutOrderDTO.OrderItemDTO) {
                    // 处理外卖订单商品
                    CreateTakeoutOrderDTO.OrderItemDTO orderItemDTO = (CreateTakeoutOrderDTO.OrderItemDTO) item;
                    orderItem.setOrderId(orderId);
                    orderItem.setOrderNo(orderNo);
                    orderItem.setProductId(orderItemDTO.getProductId());
                    orderItem.setProductNum(orderItemDTO.getQuantity());
                    orderItem.setQuantity(orderItemDTO.getQuantity());
                    orderItem.setProductPrice(orderItemDTO.getPrice());
                    orderItem.setTotalPrice(orderItemDTO.getPrice().multiply(BigDecimal.valueOf(orderItemDTO.getQuantity())));
                    orderItem.setCreateTime(new Date());
                    orderItem.setUpdateTime(new Date());
                } else {
                    // 处理普通商品订单商品（假设item是Map类型，包含必要的商品信息）
                    Map<?, ?> productMap = (Map<?, ?>) item;
                    Long productId = Long.valueOf(productMap.get("productId").toString());
                    Integer quantity = Integer.valueOf(productMap.get("quantity").toString());
                    String productName = productMap.get("productName").toString();
                    String productImage = productMap.get("productImage").toString();
                    BigDecimal productPrice = new BigDecimal(productMap.get("productPrice").toString());
                    
                    orderItem.setOrderId(orderId);
                    orderItem.setOrderNo(orderNo);
                    orderItem.setProductId(productId);
                    orderItem.setProductNum(quantity);
                    orderItem.setProductName(productName);
                    orderItem.setProductImage(productImage);
                    orderItem.setQuantity(quantity);
                    orderItem.setProductPrice(productPrice);
                    orderItem.setTotalPrice(productPrice.multiply(BigDecimal.valueOf(quantity)));
                    orderItem.setCreateTime(new Date());
                    orderItem.setUpdateTime(new Date());
                    
                    // 锁定商品库存
                    boolean stockLocked = productService.lockStock(productId, quantity);
                    if (!stockLocked) {
                        log.error("锁定商品库存失败，商品ID：{}，数量：{}", productId, quantity);
                        throw new RuntimeException("锁定商品库存失败");
                    }
                    log.info("锁定商品库存成功，商品ID：{}，数量：{}", productId, quantity);
                }
                
                // 保存订单项
                orderItemMapper.insert(orderItem);
            }
            
            log.info("为订单 {} 创建订单项成功，共 {} 个商品", orderNo, items.size());
            return true;
        } catch (Exception e) {
            log.error("创建订单项失败：", e);
            // 异常会触发事务回滚，库存锁定会自动回滚
            return false;
        }
    }

    @Override
    public Order getByOrderNo(String orderNo) {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo);
        return orderMapper.selectOne(queryWrapper);
    }

    @Override
    public Order getByOrderNoAndUserId(String orderNo, Long userId) {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo);
        queryWrapper.eq("user_id", userId);
        return orderMapper.selectOne(queryWrapper);
    }

    @Override
    public Boolean updateOrderStatus(String orderNo, Integer status) {
        Order order = new Order();
        order.setStatus(status);
        order.setUpdateTime(new Date());
        
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo);
        
        return orderMapper.update(order, queryWrapper) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean payOrder(String orderNo, Integer payType) {
        Order order = getByOrderNo(orderNo);
        if (order == null || !order.getStatus().equals(OrderConstant.ORDER_STATUS_PENDING_PAYMENT)) {
            log.warn("订单支付失败：订单不存在或状态不正确，订单号：{}", orderNo);
            return false;
        }
        
        try {
            // 创建支付订单
            paymentService.createPayment(order.getId(), orderNo, order.getTotalAmount(), payType);
            
            // 更新订单状态为已支付
            order.setStatus(OrderConstant.ORDER_STATUS_PAID);
            order.setPayStatus(OrderConstant.PAY_STATUS_PAID);
            order.setPayType(payType);
            order.setPayTime(new Date());
            order.setUpdateTime(new Date());
            
            log.info("订单 {} 支付成功，支付方式：{}", orderNo, payType);
            
            return orderMapper.updateById(order) > 0;
        } catch (Exception e) {
            log.error("订单支付异常，订单号：{}", orderNo, e);
            throw new RuntimeException("订单支付异常", e);
        }
    }

    @Override
    public Map<String, Object> payOrder(String orderNo, Integer payType, Long userId) {
        Map<String, Object> result = new HashMap<>();
        
        Order order = getByOrderNoAndUserId(orderNo, userId);
        if (order == null) {
            result.put("success", false);
            result.put("message", "订单不存在或无权限操作");
            return result;
        }
        
        try {
            // 检查订单状态
            if (!order.getStatus().equals(OrderConstant.ORDER_STATUS_PENDING_PAYMENT)) {
                result.put("success", false);
                result.put("message", "订单状态不正确，无法支付");
                return result;
            }
            
            // 创建支付订单
            com.heikeji.mall.payment.entity.Payment payment = paymentService.createPayment(
                    order.getId(), orderNo, order.getTotalAmount(), payType);
            
            // 根据支付方式处理支付
            Map<String, Object> payParams = new HashMap<>();
            if (payType.equals(OrderConstant.PAY_TYPE_WECHAT)) {
                // 生成微信支付参数
                payParams = paymentService.generateWechatPayParams(payment.getId());
            } else {
                // 处理其他支付方式
                result.put("success", false);
                result.put("message", "不支持的支付方式");
                return result;
            }
            
            // 更新订单状态为已支付
            order.setStatus(OrderConstant.ORDER_STATUS_PAID);
            order.setPayStatus(OrderConstant.PAY_STATUS_PAID);
            order.setPayType(payType);
            order.setPayTime(new Date());
            order.setUpdateTime(new Date());
            orderMapper.updateById(order);
            
            result.put("success", true);
            result.put("message", "支付成功");
            result.put("orderNo", orderNo);
            result.put("paymentParams", payParams);
            
            log.info("用户 {} 支付订单 {} 成功，支付方式：{}", userId, orderNo, payType);
            
        } catch (Exception e) {
            log.error("用户 {} 支付订单 {} 异常", userId, orderNo, e);
            result.put("success", false);
            result.put("message", "支付异常，请稍后重试");
        }
        
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean cancelOrder(String orderNo) {
        Order order = getByOrderNo(orderNo);
        if (order == null) {
            log.warn("订单取消失败：订单不存在，订单号：{}", orderNo);
            return false;
        }
        
        // 只有待支付的订单可以取消
        if (!order.getStatus().equals(OrderConstant.ORDER_STATUS_PENDING_PAYMENT)) {
            log.warn("订单取消失败：订单状态不允许取消，订单号：{}，当前状态：{}", orderNo, order.getStatus());
            return false;
        }
        
        try {
            // 查询是否存在支付记录
            com.heikeji.mall.payment.entity.Payment payment = paymentService.getByOrderNo(orderNo);
            if (payment != null && payment.getStatus().equals(1)) { // 如果已支付，需要退款
                boolean refundResult = paymentService.refund(orderNo, payment.getAmount());
                if (!refundResult) {
                    log.error("订单取消时退款失败，订单号：{}", orderNo);
                    return false;
                }
                order.setPayStatus(OrderConstant.PAY_STATUS_FAILED);
            }
            
            // 更新订单状态为已取消
            order.setStatus(OrderConstant.ORDER_STATUS_CANCELLED);
            order.setUpdateTime(new Date());
            
            // 释放锁定的商品库存
            // 根据订单号查询订单商品项
            List<OrderItem> orderItems = orderItemService.list(new QueryWrapper<OrderItem>().eq("order_no", orderNo));
            for (OrderItem item : orderItems) {
                boolean unlockResult = productService.unlockStock(item.getProductId(), item.getQuantity());
                if (!unlockResult) {
                    log.error("订单取消时释放锁定库存失败，订单号：{}，商品ID：{}，数量：{}", orderNo, item.getProductId(), item.getQuantity());
                    // 记录日志但不影响订单取消流程
                }
            }
            
            // TODO: 发送取消通知
            
            log.info("订单 {} 取消成功", orderNo);
            
            return orderMapper.updateById(order) > 0;
        } catch (Exception e) {
            log.error("订单取消异常，订单号：{}", orderNo, e);
            throw new RuntimeException("订单取消异常", e);
        }
    }

    @Override
    public Boolean cancelOrder(String orderNo, Long userId) {
        Order order = getByOrderNoAndUserId(orderNo, userId);
        if (order == null) {
            return false;
        }
        return cancelOrder(orderNo);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order createOrder(Long userId, Long addressId) {
        return createOrder(userId, addressId, OrderConstant.PAY_TYPE_WECHAT, null, null);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order createOrder(Long userId, Long addressId, Integer payType, String orderRemark, String couponCode) {
        try {
            // 创建订单对象
            Order order = new Order();
            
            // 生成订单号
            String orderNo = generateOrderNo();
            order.setOrderNo(orderNo);
            order.setUserId(userId);
            order.setAddressId(addressId);
            order.setPayType(payType != null ? payType : OrderConstant.PAY_TYPE_WECHAT);
            order.setOrderRemark(orderRemark);
            order.setCouponCode(couponCode);
            
            // 设置订单状态
            order.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
            order.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
            
            // 获取用户选中的购物车商品
            List<Cart> selectedCartItems = cartService.getSelectedCartItems(userId);
            if (selectedCartItems == null || selectedCartItems.isEmpty()) {
                throw new RuntimeException("购物车中没有选中的商品");
            }
            
            // 计算订单金额
            BigDecimal totalAmount = calculateOrderAmount(userId, selectedCartItems);
            
            // 应用优惠券（如果有）
            if (couponCode != null && !couponCode.isEmpty()) {
                totalAmount = applyCoupon(totalAmount, couponCode, userId);
            }
            
            order.setTotalAmount(totalAmount);
            order.setCreateTime(new Date());
            order.setUpdateTime(new Date());
            
            // 保存订单
            orderMapper.insert(order);
            log.info("创建订单成功，订单号：{}，总金额：{}", orderNo, totalAmount);
            
            // 为每个购物车商品创建订单项并锁定库存
            List<Map<String, Object>> orderItemsData = new ArrayList<>();
            for (Cart cartItem : selectedCartItems) {
                // 锁定商品库存
                boolean lockResult = productService.lockStock(cartItem.getProductId(), cartItem.getQuantity());
                if (!lockResult) {
                    log.error("创建订单时锁定库存失败，商品ID：{}，数量：{}", cartItem.getProductId(), cartItem.getQuantity());
                    throw new BaseException("商品库存不足或锁定失败");
                }
                
                // 获取商品信息
                // 实际项目中应该调用商品服务获取详细信息
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("productId", cartItem.getProductId());
                productMap.put("quantity", cartItem.getQuantity());
                productMap.put("productName", "商品" + cartItem.getProductId()); // 实际项目中应该从商品服务获取
                productMap.put("productImage", "/images/product/" + cartItem.getProductId() + ".jpg"); // 实际项目中应该从商品服务获取
                productMap.put("productPrice", getProductPrice(cartItem.getProductId()));
                
                orderItemsData.add(productMap);
            }
            
            // 创建订单项
            boolean createOrderItemsResult = createOrderItems(order.getId(), orderNo, orderItemsData);
            if (!createOrderItemsResult) {
                log.error("创建订单项失败，订单号：{}", orderNo);
                throw new RuntimeException("创建订单项失败");
            }
            
            // 清空购物车中已下单的商品
            // 实际项目中应该根据业务需求决定是否清空购物车
            // 这里简化处理，暂时不实现
            
            return order;
        } catch (BaseException e) {
            log.error("创建订单失败：", e);
            throw e;
        } catch (Exception e) {
            log.error("创建订单失败：", e);
            throw new RuntimeException("创建订单失败", e);
        }
    }
    
    /**
     * 计算订单金额
     * 从购物车获取用户选中的商品并计算总金额
     */
    private BigDecimal calculateOrderAmount(Long userId, List<Cart> selectedCartItems) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Cart cartItem : selectedCartItems) {
            // 获取商品价格
            BigDecimal productPrice = getProductPrice(cartItem.getProductId());
            BigDecimal itemTotal = productPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        return totalAmount;
    }
    
    @Autowired
    private CouponService couponService;
    
    /**
     * 应用优惠券
     */
    private BigDecimal applyCoupon(BigDecimal amount, String couponCode, Long userId) {
        // 调用优惠券服务计算优惠金额
        return couponService.applyCoupon(amount, couponCode, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order createDirectBuyOrder(Long userId, Long addressId, Long productId, Integer productNum, Integer payType, String orderRemark, String couponCode) {
        try {
            // 创建订单对象
            Order order = new Order();
            
            // 生成订单号
            String orderNo = generateOrderNo();
            order.setOrderNo(orderNo);
            order.setUserId(userId);
            order.setAddressId(addressId);
            order.setPayType(payType != null ? payType : OrderConstant.PAY_TYPE_WECHAT);
            order.setOrderRemark(orderRemark);
            order.setCouponCode(couponCode);
            
            // 设置订单状态
            order.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
            order.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
            
            // 计算订单金额
            // 实际项目中应该调用商品服务获取商品价格并计算
            BigDecimal productPrice = getProductPrice(productId);
            BigDecimal totalAmount = productPrice.multiply(new BigDecimal(productNum));
            
            // 应用优惠券（如果有）
            if (couponCode != null && !couponCode.isEmpty()) {
                totalAmount = applyCoupon(totalAmount, couponCode, userId);
            }
            
            order.setTotalAmount(totalAmount);
            order.setCreateTime(new Date());
            order.setUpdateTime(new Date());
            
            // 保存订单
            orderMapper.insert(order);
            
            // 创建订单项
            createOrderItemForDirectBuy(order.getId(), orderNo, productId, productNum, productPrice);
            
            // 锁定商品库存
            boolean lockResult = productService.lockStock(productId, productNum);
            if (!lockResult) {
                log.error("创建直接购买订单时锁定库存失败，商品ID：{}，数量：{}", productId, productNum);
                throw new BaseException("商品库存不足或锁定失败");
            }
            
            log.info("直接购买创建订单成功，订单号：{}，总金额：{}", orderNo, totalAmount);
            
            return order;
        } catch (Exception e) {
            log.error("直接购买创建订单失败：", e);
            throw new RuntimeException("创建订单失败", e);
        }
    }
    
    /**
     * 获取商品价格
     * 实际项目中应该调用商品服务
     */
    private BigDecimal getProductPrice(Long productId) {
        // 模拟获取商品价格，实际应该调用商品服务
        return new BigDecimal(59.99); // 示例价格
    }
    
    /**
     * 为直接购买创建订单项
     */
    private void createOrderItemForDirectBuy(Long orderId, String orderNo, Long productId, Integer productNum, BigDecimal productPrice) {
        OrderItem item = new OrderItem();
        item.setOrderId(orderId);
        item.setOrderNo(orderNo);
        item.setProductId(productId);
        item.setProductNum(productNum);
        item.setProductPrice(productPrice);
        item.setTotalPrice(productPrice.multiply(new BigDecimal(productNum)));
        item.setCreateTime(new Date());
        item.setUpdateTime(new Date());
        
        orderItemMapper.insert(item);
        log.info("为订单 {} 创建订单项成功，商品ID：{}", orderNo, productId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean confirmReceipt(String orderNo) {
        Order order = getByOrderNo(orderNo);
        if (order == null || !order.getStatus().equals(OrderConstant.ORDER_STATUS_PENDING_RECEIVE)) {
            return false;
        }
        
        // 更新订单状态为已完成
        order.setStatus(OrderConstant.ORDER_STATUS_COMPLETED);
        order.setEndTime(new Date());
        order.setUpdateTime(new Date());
        
        log.info("订单 {} 确认收货成功", orderNo);
        
        return orderMapper.updateById(order) > 0;
    }

    @Override
    public Boolean confirmReceipt(String orderNo, Long userId) {
        Order order = getByOrderNoAndUserId(orderNo, userId);
        if (order == null) {
            return false;
        }
        return confirmReceipt(orderNo);
    }

    @Override
    public List<OrderListVO> getOrderListByUserIdAndStatus(Long userId, Integer status) {
        try {
            // 构建订单查询条件
            QueryWrapper<Order> orderQueryWrapper = new QueryWrapper<>();
            orderQueryWrapper.eq("user_id", userId);
            if (status != null) {
                orderQueryWrapper.eq("status", status);
            }
            orderQueryWrapper.orderByDesc("create_time");
            
            // 查询订单列表
            List<Order> orders = orderMapper.selectList(orderQueryWrapper);
            if (orders.isEmpty()) {
                return new ArrayList<>();
            }
            
            // 构建订单项查询条件
            List<String> orderNos = orders.stream().map(Order::getOrderNo).collect(Collectors.toList());
            QueryWrapper<OrderItem> itemQueryWrapper = new QueryWrapper<>();
            itemQueryWrapper.in("order_no", orderNos);
            
            // 查询所有订单项
            List<OrderItem> orderItems = orderItemMapper.selectList(itemQueryWrapper);
            
            // 按订单号分组订单项
            Map<String, List<OrderItem>> orderItemMap = orderItems.stream()
                    .collect(Collectors.groupingBy(OrderItem::getOrderNo));
            
            // 组装OrderListVO
            List<OrderListVO> orderListVOs = new ArrayList<>();
            for (Order order : orders) {
                OrderListVO orderListVO = new OrderListVO();
                orderListVO.setId(order.getId());
                orderListVO.setOrderNo(order.getOrderNo());
                orderListVO.setStatus(order.getStatus());
                orderListVO.setTotalAmount(order.getTotalAmount());
                orderListVO.setFreightAmount(order.getFreightAmount());
                orderListVO.setCreateTime(order.getCreateTime());
                
                // 组装订单项
                List<OrderListVO.OrderItemVO> itemVOs = new ArrayList<>();
                List<OrderItem> items = orderItemMap.getOrDefault(order.getOrderNo(), new ArrayList<>());
                for (OrderItem item : items) {
                    OrderListVO.OrderItemVO itemVO = new OrderListVO.OrderItemVO();
                    itemVO.setProductId(item.getProductId());
                    itemVO.setProductName(item.getProductName());
                    itemVO.setProductImage(item.getProductImage());
                    itemVO.setPrice(item.getProductPrice());
                    itemVO.setQuantity(item.getQuantity());
                    itemVOs.add(itemVO);
                }
                orderListVO.setOrderItems(itemVOs);
                
                orderListVOs.add(orderListVO);
            }
            
            return orderListVOs;
        } catch (Exception e) {
            log.error("获取用户订单列表失败：", e);
            return new ArrayList<>();
        }
    }

    @Override
    public OrderDetailVO getOrderDetailByOrderNo(String orderNo, Long userId) {
        try {
            Order order = getByOrderNoAndUserId(orderNo, userId);
            if (order == null) {
                return null;
            }
            
            // 组装OrderDetailVO对象
            OrderDetailVO orderDetailVO = new OrderDetailVO();
            orderDetailVO.setId(order.getId());
            orderDetailVO.setOrderNo(order.getOrderNo());
            orderDetailVO.setUserId(order.getUserId());
            orderDetailVO.setMerchantId(order.getMerchantId());
            orderDetailVO.setOrderType(order.getOrderType());
            orderDetailVO.setTotalAmount(order.getTotalAmount());
            orderDetailVO.setPayAmount(order.getPayAmount());
            orderDetailVO.setFreightAmount(order.getFreightAmount());
            orderDetailVO.setReceiverName(order.getReceiverName());
            orderDetailVO.setReceiverPhone(order.getReceiverPhone());
            orderDetailVO.setReceiverAddress(order.getReceiverAddress());
            orderDetailVO.setDeliveryType(order.getDeliveryType());
            orderDetailVO.setStatus(order.getStatus());
            orderDetailVO.setPayStatus(order.getPayStatus());
            orderDetailVO.setPayTime(order.getPayTime());
            orderDetailVO.setShipTime(order.getDeliveryTime()); // 将deliveryTime映射到shipTime
            orderDetailVO.setCompleteTime(order.getCompleteTime());
            orderDetailVO.setRemark(order.getRemark());
            orderDetailVO.setCreateTime(order.getCreateTime());
            
            // 设置OrderDetailVO中Order没有的字段为默认值
            orderDetailVO.setPaymentMethod(null); // 暂时设置为null，实际项目中可能需要从其他表查询
            orderDetailVO.setPaymentNo(null); // 暂时设置为null，实际项目中可能需要从支付表查询
            orderDetailVO.setLogisticsCompany(null); // 暂时设置为null，实际项目中可能需要从物流表查询
            orderDetailVO.setTrackingNumber(null); // 暂时设置为null，实际项目中可能需要从物流表查询
            orderDetailVO.setReceiverProvince(null); // 暂时设置为null，实际项目中可能需要从地址表查询
            orderDetailVO.setReceiverCity(null); // 暂时设置为null，实际项目中可能需要从地址表查询
            orderDetailVO.setReceiverDistrict(null); // 暂时设置为null，实际项目中可能需要从地址表查询
            
            // 查询订单项信息
            List<OrderItem> orderItems = orderItemMapper.selectList(new QueryWrapper<OrderItem>()
                    .eq("order_no", orderNo));
            
            // 转换为订单项VO
            List<OrderDetailVO.OrderItemVO> orderItemVOs = new ArrayList<>();
            for (OrderItem orderItem : orderItems) {
                OrderDetailVO.OrderItemVO orderItemVO = new OrderDetailVO.OrderItemVO();
                orderItemVO.setProductId(orderItem.getProductId());
                orderItemVO.setProductName(orderItem.getProductName());
                orderItemVO.setProductImage(orderItem.getProductImage());
                orderItemVO.setPrice(orderItem.getProductPrice()); // 注意字段名映射
                orderItemVO.setQuantity(orderItem.getQuantity());
                orderItemVO.setTotalPrice(orderItem.getTotalPrice());
                orderItemVOs.add(orderItemVO);
            }
            
            orderDetailVO.setOrderItems(orderItemVOs);
            
            return orderDetailVO;
        } catch (Exception e) {
            log.error("获取订单详情失败：", e);
            return null;
        }
    }

    @Override
    public Map<String, Object> getUserOrderList(Long userId, Integer status, Integer page, Integer limit) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 创建分页对象
            Page<Order> pageParam = new Page<>(page, limit);
            
            // 构建分页查询条件
            QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId);
            if (status != null) {
                queryWrapper.eq("status", status);
            }
            queryWrapper.orderByDesc("create_time");
            
            // 使用MyBatis Plus的标准分页查询
            IPage<Order> orderPage = orderMapper.selectPage(pageParam, queryWrapper);
            
            // 转换为订单列表VO
            List<OrderListVO> orderListVOs = new ArrayList<>();
            for (Order order : orderPage.getRecords()) {
                OrderListVO orderListVO = new OrderListVO();
                orderListVO.setId(order.getId());
                orderListVO.setOrderNo(order.getOrderNo());
                orderListVO.setStatus(order.getStatus());
                orderListVO.setTotalAmount(order.getTotalAmount());
                orderListVO.setFreightAmount(order.getFreightAmount());
                orderListVO.setCreateTime(order.getCreateTime());
                
                // 查询订单项信息
                List<OrderItem> orderItems = orderItemMapper.selectList(new QueryWrapper<OrderItem>()
                        .eq("order_no", order.getOrderNo()));
                
                // 转换为订单项VO
                List<OrderListVO.OrderItemVO> orderItemVOs = new ArrayList<>();
                for (OrderItem orderItem : orderItems) {
                    OrderListVO.OrderItemVO orderItemVO = new OrderListVO.OrderItemVO();
                    orderItemVO.setProductId(orderItem.getProductId());
                    orderItemVO.setProductName(orderItem.getProductName());
                    orderItemVO.setProductImage(orderItem.getProductImage());
                    orderItemVO.setPrice(orderItem.getProductPrice());
                    orderItemVO.setQuantity(orderItem.getQuantity());
                    orderItemVOs.add(orderItemVO);
                }
                
                orderListVO.setOrderItems(orderItemVOs);
                orderListVOs.add(orderListVO);
            }
            
            // 设置返回结果
            result.put("total", orderPage.getTotal());
            result.put("list", orderListVOs);
        } catch (Exception e) {
            log.error("获取用户分页订单列表失败：", e);
            result.put("total", 0);
            result.put("list", new ArrayList<>());
        }
        return result;
    }

    @Override
    public List<Order> getPendingOrders() {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        // 使用硬编码的状态值替代不存在的常量
        queryWrapper.eq("status", OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
        return orderMapper.selectList(queryWrapper);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean handlePaymentCallback(String orderNo, Integer payStatus, String payTradeNo, Date payTime) {
        log.info("处理支付回调，订单号：{}，支付状态：{}，交易号：{}", orderNo, payStatus, payTradeNo);
        
        try {
            // 获取订单信息
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("处理支付回调失败：订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 检查订单当前状态，避免重复处理
            if (order.getPayStatus() == OrderConstant.PAY_STATUS_PAID) {
                log.info("订单已支付，无需重复处理，订单号：{}", orderNo);
                return true; // 已处理过，返回成功
            }
            
            // 根据支付状态处理
            if (payStatus == OrderConstant.PAY_STATUS_PAID) {
                // 支付成功，处理订单
                return processPaySuccess(orderNo, payTradeNo, payTime);
            } else if (payStatus == OrderConstant.PAY_STATUS_FAILED) {
                // 支付失败，更新订单状态
                order.setPayStatus(OrderConstant.PAY_STATUS_FAILED);
                order.setUpdateTime(new Date());
                boolean updateResult = orderMapper.updateById(order) > 0;
                if (updateResult) {
                    log.info("支付失败，已更新订单状态，订单号：{}", orderNo);
                } else {
                    log.error("更新订单支付失败状态失败，订单号：{}", orderNo);
                }
                return updateResult;
            }
            
            log.warn("不支持的支付状态：{}，订单号：{}", payStatus, orderNo);
            return false;
        } catch (Exception e) {
            log.error("处理支付回调异常，订单号：{}", orderNo, e);
            throw new RuntimeException("处理支付回调失败", e);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updatePayStatus(String orderNo, Integer payStatus) {
        log.info("更新订单支付状态，订单号：{}，支付状态：{}", orderNo, payStatus);
        
        try {
            // 获取订单信息
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("更新订单支付状态失败：订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 更新支付状态
            order.setPayStatus(payStatus);
            order.setUpdateTime(new Date());
            
            boolean updateResult = orderMapper.updateById(order) > 0;
            if (updateResult) {
                log.info("更新订单支付状态成功，订单号：{}", orderNo);
            } else {
                log.error("更新订单支付状态失败，订单号：{}", orderNo);
            }
            
            return updateResult;
        } catch (Exception e) {
            log.error("更新订单支付状态异常，订单号：{}", orderNo, e);
            throw new RuntimeException("更新订单支付状态失败", e);
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean processPaySuccess(String orderNo, String payTradeNo, Date payTime) {
        log.info("处理支付成功，订单号：{}，交易号：{}", orderNo, payTradeNo);
        
        try {
            // 获取订单信息
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("处理支付成功失败：订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 更新订单状态为已支付
            order.setPayStatus(OrderConstant.PAY_STATUS_PAID);
            order.setPayTime(payTime != null ? payTime : new Date());
            order.setPayTradeNo(payTradeNo);
            
            // 根据订单类型设置不同的后续状态
            if (order.getOrderType() == OrderConstant.ORDER_TYPE_TAKEOUT) {
                // 外卖订单：支付成功后，设置为待接单状态
                order.setStatus(OrderConstant.ORDER_STATUS_WAITING_ACCEPT);
            } else {
                // 普通订单：支付成功后，设置为待发货状态
                order.setStatus(OrderConstant.ORDER_STATUS_WAITING_DELIVERY);
            }
            
            order.setUpdateTime(new Date());
            
            // 更新订单
            boolean updateResult = orderMapper.updateById(order) > 0;
            if (!updateResult) {
                log.error("更新订单支付成功状态失败，订单号：{}", orderNo);
                return false;
            }
            
            // TODO: 发送订单支付成功通知
            sendOrderPaidNotification(order);
            
            // 扣除库存（将锁定的库存转换为实际扣除的库存）
            List<OrderItem> orderItems = orderItemMapper.selectList(new QueryWrapper<OrderItem>().eq("order_id", order.getId()));
            for (OrderItem item : orderItems) {
                // 先释放锁定的库存
                boolean unlockResult = productService.unlockStock(item.getProductId(), item.getQuantity());
                if (!unlockResult) {
                    log.error("支付成功后释放锁定库存失败，订单号：{}，商品ID：{}，数量：{}", orderNo, item.getProductId(), item.getQuantity());
                    throw new RuntimeException("支付成功后释放锁定库存失败");
                }
                
                // 再扣除实际库存
                boolean deductResult = productService.deductStock(item.getProductId(), item.getQuantity());
                if (!deductResult) {
                    log.error("支付成功后扣除实际库存失败，订单号：{}，商品ID：{}，数量：{}", orderNo, item.getProductId(), item.getQuantity());
                    throw new RuntimeException("支付成功后扣除实际库存失败");
                }
            }
            
            log.info("处理支付成功完成，订单号：{}，订单状态已更新为：{}", orderNo, order.getStatus());
            return true;
        } catch (Exception e) {
            log.error("处理支付成功异常，订单号：{}", orderNo, e);
            throw new RuntimeException("处理支付成功失败", e);
        }
    }
    
    /**
     * 发送订单支付成功通知
     */
    private void sendOrderPaidNotification(Order order) {
        // 模拟发送通知，实际项目中应该调用消息服务或通知服务
        log.info("发送订单支付成功通知，订单号：{}，用户ID：{}", order.getOrderNo(), order.getUserId());
        // TODO: 实现真实的通知发送逻辑
    }
    
    /**
     * 取消超时未支付的订单
     * @param minutes 超时分钟数
     * @return 取消的订单数量
     */
    @Transactional(rollbackFor = Exception.class)
    public Integer cancelTimeoutOrders(Integer minutes) {
        log.info("开始处理超时未支付订单，超时时间：{}分钟", minutes);
        
        // 计算超时时间
        Date timeoutTime = new Date(System.currentTimeMillis() - minutes * 60 * 1000);
        
        // 查询超时未支付的订单
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        // 使用常量替代硬编码值
        queryWrapper.eq("status", OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
        queryWrapper.lt("create_time", timeoutTime);
        
        List<Order> timeoutOrders = orderMapper.selectList(queryWrapper);
        
        // 更新超时订单状态为已取消
        int cancelCount = 0;
        for (Order order : timeoutOrders) {
            order.setStatus(OrderConstant.ORDER_STATUS_CANCELLED);
            order.setUpdateTime(new Date());
            if (orderMapper.updateById(order) > 0) {
                cancelCount++;
                // 释放锁定的商品库存
                List<OrderItem> orderItems = orderItemMapper.selectList(new QueryWrapper<OrderItem>().eq("order_id", order.getId()));
                for (OrderItem item : orderItems) {
                    boolean unlockResult = productService.unlockStock(item.getProductId(), item.getQuantity());
                    if (!unlockResult) {
                        log.error("取消超时订单时释放锁定库存失败，订单号：{}，商品ID：{}，数量：{}", order.getOrderNo(), item.getProductId(), item.getQuantity());
                    }
                }
                log.info("取消超时订单：{}", order.getOrderNo());
            }
        }
        
        log.info("超时订单处理完成，共取消 {} 个订单", cancelCount);
        return cancelCount;
    }
    
    /**
     * 取消超时未支付的订单
     */
    private void cancelOverdueOrders() {
        // TODO: 实现取消超时未支付订单的逻辑
    }
    
    /**
     * 检查并取消超时未支付的订单
     * @return 取消成功的订单数量
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int cancelTimeoutOrders() {
        log.info("开始检查并取消超时未支付的订单");
        
        try {
            // 计算超时时间点
            Date now = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(now);
            calendar.add(Calendar.MINUTE, -OrderConstant.ORDER_TIMEOUT);
            Date timeoutDate = calendar.getTime();
            
            // 查询超时未支付的订单
            QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("order_status", OrderConstant.ORDER_STATUS_PENDING_PAYMENT)
                       .eq("pay_status", OrderConstant.PAY_STATUS_UNPAID)
                       .lt("create_time", timeoutDate);
            
            List<Order> timeoutOrders = orderMapper.selectList(queryWrapper);
            log.info("发现 {} 个超时未支付的订单", timeoutOrders.size());
            
            int successCount = 0;
            
            // 逐个处理超时订单
            for (Order order : timeoutOrders) {
                try {
                    // 执行订单取消
                    boolean result = doCancelOrder(order, "订单超时未支付，自动取消");
                    if (result) {
                        successCount++;
                        log.info("订单 {} 已自动取消（超时未支付）", order.getOrderNo());
                    }
                } catch (Exception e) {
                    log.error("取消超时订单失败，订单号：{}", order.getOrderNo(), e);
                    // 继续处理下一个订单，不影响整体处理
                }
            }
            
            log.info("超时订单取消完成，成功取消 {} 个订单", successCount);
            return successCount;
        } catch (Exception e) {
            log.error("检查并取消超时订单过程中发生异常", e);
            throw new RuntimeException("取消超时订单失败", e);
        }
    }
    
    @Override
    public int autoConfirmReceivedOrders() {
        // 调用已有的确认收货方法，默认超时时间为7天
        return confirmTimeoutOrders(7);
    }
    
    /**
     * 执行订单取消的具体操作
     * @param order 订单对象
     * @param reason 取消原因
     * @return 是否取消成功
     */
    private boolean doCancelOrder(Order order, String reason) {
        // 更新订单状态为已取消
        order.setStatus(OrderConstant.ORDER_STATUS_CANCELLED);
        order.setUpdateTime(new Date());
        
        boolean updateResult = orderMapper.updateById(order) > 0;
        
        if (updateResult) {
            // 释放商品库存
            List<OrderItem> orderItems = orderItemMapper.selectList(new QueryWrapper<OrderItem>().eq("order_id", order.getId()));
            for (OrderItem item : orderItems) {
                boolean stockResult;
                if (order.getPayStatus() == OrderConstant.PAY_STATUS_PAID) {
                    // 已支付订单取消，恢复实际库存
                    stockResult = productService.restoreStock(item.getProductId(), item.getQuantity());
                } else {
                    // 未支付订单取消，释放锁定库存
                    stockResult = productService.unlockStock(item.getProductId(), item.getQuantity());
                }
                
                if (!stockResult) {
                    log.error("取消订单时库存操作失败，订单号：{}，商品ID：{}，数量：{}", order.getOrderNo(), item.getProductId(), item.getQuantity());
                }
            }
            
            // 发送订单取消通知
            sendOrderCancelledNotification(order, reason);
            
            // 如果订单已支付，需要处理退款逻辑
            if (order.getPayStatus() == OrderConstant.PAY_STATUS_PAID) {
                // TODO: 调用支付服务进行退款
                // processRefund(order);
                log.warn("订单 {} 已支付但被取消，需要处理退款", order.getOrderNo());
            }
        }
        
        return updateResult;
    }
    
    /**
     * 发送订单取消通知
     */
    private void sendOrderCancelledNotification(Order order, String reason) {
        // 模拟发送通知，实际项目中应该调用消息服务或通知服务
        log.info("发送订单取消通知，订单号：{}，用户ID：{}，原因：{}", 
                order.getOrderNo(), order.getUserId(), reason);
        // TODO: 实现真实的通知发送逻辑
    }
    
    /**
     * 生成订单号
     * @return 订单号
     */
    private String generateOrderNo() {
        StringBuilder orderNo = new StringBuilder();
        // 年月日时分秒 + 6位随机数
        orderNo.append(String.format("%tY%<tm%<td%<tH%<tM%<tS", new Date()));
        // 生成6位随机数
        Random random = new Random();
        orderNo.append(String.format("%06d", random.nextInt(1000000)));
        return orderNo.toString();
    }
    
    /**
     * 自动确认超时未收货的订单
     * @param days 超时天数
     * @return 确认收货的订单数量
     */
    @Transactional(rollbackFor = Exception.class)
    public Integer confirmTimeoutOrders(Integer days) {
        log.info("开始处理超时未收货订单，超时时间：{}天", days);
        
        // 计算超时时间
        Date timeoutTime = new Date(System.currentTimeMillis() - days * 24 * 60 * 60 * 1000);
        
        // 查询超时未收货的订单
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        // 使用常量代替硬编码的状态值
        queryWrapper.eq("status", OrderConstant.ORDER_STATUS_PENDING_RECEIVE);
        queryWrapper.lt("delivery_time", timeoutTime);
        
        List<Order> timeoutOrders = orderMapper.selectList(queryWrapper);
        int confirmCount = 0;
        
        // 逐个确认收货
        for (Order order : timeoutOrders) {
            try {
                // 使用常量代替硬编码的状态值
                order.setStatus(OrderConstant.ORDER_STATUS_COMPLETED);
                order.setCompleteTime(new Date());
                order.setUpdateTime(new Date());
                
                if (orderMapper.updateById(order) > 0) {
                    confirmCount++;
                    log.info("成功自动确认收货订单：{}，发货时间：{}", order.getOrderNo(), order.getDeliveryTime());
                }
            } catch (Exception e) {
                log.error("自动确认收货失败：{}", order.getOrderNo(), e);
            }
        }
        
        log.info("订单自动确认收货处理完成，共确认{}个订单", confirmCount);
        return confirmCount;
    }
}