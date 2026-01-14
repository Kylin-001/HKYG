package com.heikeji.mall.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.domain.vo.OrderDetailVO;
import com.heikeji.mall.order.domain.vo.OrderListVO;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderItem;
import com.heikeji.mall.order.mapper.OrderItemMapper;
import com.heikeji.mall.order.mapper.OrderMapper;
import com.heikeji.mall.order.service.OrderService;
import com.heikeji.mall.payment.service.PaymentService;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Arrays;

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

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
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
            
            order.setCreateTime(new Date());
            order.setUpdateTime(new Date());
            
            // 保存订单
            orderMapper.insert(order);
            
            log.info("创建外卖订单成功，订单号：{}", orderNo);
            
            return order.getId();
        } catch (Exception e) {
            log.error("创建外卖订单失败, userId={}", userId, e);
            throw new RuntimeException("创建外卖订单失败", e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean createOrderItems(Long orderId, String orderNo, List<?> items) {
        log.info("创建订单项，订单号：{}", orderNo);
        // 简化实现
        return true;
    }

    @Override
    @Cacheable(value = "orderCache", key = "'order_' + #orderNo", unless = "#result == null")
    public Order getByOrderNo(String orderNo) {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo);
        return orderMapper.selectOne(queryWrapper);
    }
    
    @Override
    @Cacheable(value = "orderCache", key = "'order_' + #orderNo + '_' + #userId", unless = "#result == null")
    public Order getByOrderNoAndUserId(String orderNo, Long userId) {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_no", orderNo);
        queryWrapper.eq("user_id", userId);
        return orderMapper.selectOne(queryWrapper);
    }

    @Override
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
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
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean payOrder(String orderNo, Integer payType) {
        log.info("支付订单，订单号：{}", orderNo);
        try {
            // 1. 根据订单号查询订单
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("支付订单失败，订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 2. 检查订单状态
            if (!OrderConstant.ORDER_STATUS_PENDING_PAYMENT.equals(order.getStatus())) {
                log.error("支付订单失败，订单状态不正确，订单号：{}，当前状态：{}", orderNo, order.getStatus());
                return false;
            }
            
            // 3. 更新订单支付状态
            order.setPayStatus(OrderConstant.PAY_STATUS_PAID);
            order.setPayType(payType);
            order.setPayTime(new Date());
            order.setStatus(OrderConstant.ORDER_STATUS_PAID);
            order.setUpdateTime(new Date());
            
            // 4. 保存更新
            orderMapper.updateById(order);
            
            log.info("订单支付成功，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("支付订单失败, orderNo={}", orderNo, e);
            return false;
        }
    }
    
    @Override
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Map<String, Object> payOrder(String orderNo, Integer payType, Long userId) {
        log.info("用户支付订单，订单号：{}", orderNo);
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. 检查订单是否属于该用户
            Order order = getByOrderNoAndUserId(orderNo, userId);
            if (order == null) {
                result.put("success", false);
                result.put("message", "订单不存在或不属于当前用户");
                return result;
            }
            
            // 2. 调用支付方法
            boolean payResult = payOrder(orderNo, payType);
            if (payResult) {
                result.put("success", true);
                result.put("message", "支付成功");
                result.put("orderNo", orderNo);
                result.put("payTime", new Date());
            } else {
                result.put("success", false);
                result.put("message", "支付失败");
            }
            return result;
        } catch (Exception e) {
            log.error("用户支付订单失败, orderNo={}, userId={}", orderNo, userId, e);
            result.put("success", false);
            result.put("message", "支付过程中发生错误");
            return result;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean cancelOrder(String orderNo) {
        log.info("取消订单，订单号：{}", orderNo);
        try {
            // 1. 根据订单号查询订单
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("取消订单失败，订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 2. 检查订单状态
            if (!OrderConstant.ORDER_STATUS_PENDING_PAYMENT.equals(order.getStatus()) && 
                !OrderConstant.ORDER_STATUS_PENDING_DELIVERY.equals(order.getStatus())) {
                log.error("取消订单失败，订单状态不正确，订单号：{}，当前状态：{}", orderNo, order.getStatus());
                return false;
            }
            
            // 3. 更新订单状态
            order.setStatus(OrderConstant.ORDER_STATUS_CANCELLED);
            order.setUpdateTime(new Date());
            
            // 4. 如果订单已支付，需要处理退款逻辑
            if (OrderConstant.PAY_STATUS_PAID.equals(order.getPayStatus())) {
                order.setRefundStatus(OrderConstant.ORDER_STATUS_REFUNDING);
                order.setRefundAmount(order.getPayAmount());
            }
            
            // 5. 保存更新
            orderMapper.updateById(order);
            
            log.info("订单取消成功，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("取消订单失败, orderNo={}", orderNo, e);
            return false;
        }
    }
    
    @Override
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean cancelOrder(String orderNo, Long userId) {
        // 1. 检查订单是否属于该用户
        Order order = getByOrderNoAndUserId(orderNo, userId);
        if (order == null) {
            log.error("取消订单失败，订单不存在或不属于当前用户，订单号：{}，用户ID：{}", orderNo, userId);
            return false;
        }
        
        // 2. 调用取消订单方法
        return cancelOrder(orderNo);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Order createOrder(Long userId, Long addressId) {
        return createOrder(userId, addressId, null, null, null);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Order createOrder(Long userId, Long addressId, Integer payType, String orderRemark, String couponCode) {
        log.info("从购物车创建订单，用户ID：{}", userId);
        try {
            // 1. 生成订单号
            String orderNo = generateOrderNo();
            
            // 2. 创建订单对象
            Order order = new Order();
            order.setOrderNo(orderNo);
            order.setUserId(userId);
            order.setMerchantId(1L); // 默认商家ID，实际项目中需要从购物车商品获取
            order.setAddressId(addressId);
            order.setOrderType(OrderConstant.ORDER_TYPE_NORMAL);
            order.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
            order.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
            order.setPayType(payType != null ? payType : OrderConstant.PAY_TYPE_WECHAT);
            order.setOrderRemark(orderRemark);
            order.setCouponCode(couponCode);
            order.setReceiverName("测试用户"); // 默认收件人姓名，实际项目中需要从地址获取
            order.setReceiverPhone("13800138000"); // 默认收件人电话，实际项目中需要从地址获取
            order.setReceiverAddress("测试地址"); // 默认收件人地址，实际项目中需要从地址获取
            order.setCreateTime(new Date());
            order.setUpdateTime(new Date());
            
            // 3. 默认总金额为0，后续需要根据购物车商品计算
            order.setTotalAmount(BigDecimal.ZERO);
            order.setPayAmount(BigDecimal.ZERO);
            
            // 4. 保存订单
            orderMapper.insert(order);
            
            log.info("从购物车创建订单成功，订单号：{}", orderNo);
            
            return order;
        } catch (Exception e) {
            log.error("从购物车创建订单失败, userId={}", userId, e);
            throw new RuntimeException("从购物车创建订单失败", e);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Order createDirectBuyOrder(Long userId, Long addressId, Long productId, Integer productNum, Integer payType, String orderRemark, String couponCode) {
        log.info("直接购买创建订单，用户ID：{}，商品ID：{}，数量：{}", userId, productId, productNum);
        try {
            // 1. 生成订单号
            String orderNo = generateOrderNo();
            
            // 2. 创建订单对象
            Order order = new Order();
            order.setOrderNo(orderNo);
            order.setUserId(userId);
            order.setMerchantId(1L); // 默认商家ID，实际项目中需要从商品信息获取
            order.setAddressId(addressId);
            order.setOrderType(OrderConstant.ORDER_TYPE_NORMAL);
            order.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
            order.setPayStatus(OrderConstant.PAY_STATUS_UNPAID);
            order.setPayType(payType != null ? payType : OrderConstant.PAY_TYPE_WECHAT);
            order.setOrderRemark(orderRemark);
            order.setCouponCode(couponCode);
            order.setReceiverName("测试用户"); // 默认收件人姓名，实际项目中需要从地址获取
            order.setReceiverPhone("13800138000"); // 默认收件人电话，实际项目中需要从地址获取
            order.setReceiverAddress("测试地址"); // 默认收件人地址，实际项目中需要从地址获取
            order.setCreateTime(new Date());
            order.setUpdateTime(new Date());
            
            // 3. 默认总金额为0，后续需要根据商品信息计算
            order.setTotalAmount(BigDecimal.ZERO);
            order.setPayAmount(BigDecimal.ZERO);
            
            // 4. 保存订单
            orderMapper.insert(order);
            
            log.info("直接购买创建订单成功，订单号：{}", orderNo);
            
            return order;
        } catch (Exception e) {
            log.error("直接购买创建订单失败, userId={}, productId={}", userId, productId, e);
            throw new RuntimeException("直接购买创建订单失败", e);
        }
    }

    @Override
    @CacheEvict(value = "salesAnalysis", allEntries = true)
    public Boolean confirmReceipt(String orderNo) {
        log.info("确认收货，订单号：{}", orderNo);
        try {
            // 1. 根据订单号查询订单
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("确认收货失败，订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 2. 检查订单状态
            if (!OrderConstant.ORDER_STATUS_PENDING_RECEIVE.equals(order.getStatus())) {
                log.error("确认收货失败，订单状态不正确，订单号：{}，当前状态：{}", orderNo, order.getStatus());
                return false;
            }
            
            // 3. 更新订单状态
            order.setStatus(OrderConstant.ORDER_STATUS_COMPLETED);
            order.setCompleteTime(new Date());
            order.setUpdateTime(new Date());
            
            // 4. 保存更新
            orderMapper.updateById(order);
            
            log.info("订单确认收货成功，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("确认收货失败, orderNo={}", orderNo, e);
            return false;
        }
    }
    
    @Override
    @CacheEvict(value = "salesAnalysis", allEntries = true)
    public Boolean confirmReceipt(String orderNo, Long userId) {
        // 1. 检查订单是否属于该用户
        Order order = getByOrderNoAndUserId(orderNo, userId);
        if (order == null) {
            log.error("确认收货失败，订单不存在或不属于当前用户，订单号：{}，用户ID：{}", orderNo, userId);
            return false;
        }
        
        // 2. 调用确认收货方法
        return confirmReceipt(orderNo);
    }

    @Override
    @Cacheable(value = "orderCache", key = "'user_order_list_' + #userId + '_' + #status")
    public List<OrderListVO> getOrderListByUserIdAndStatus(Long userId, Integer status) {
        log.info("获取用户订单列表，用户ID：{}，状态：{}", userId, status);
        try {
            // 1. 创建查询条件
            QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId);
            
            // 2. 如果状态不为空，添加状态条件
            if (status != null) {
                queryWrapper.eq("status", status);
            }
            
            // 3. 按创建时间倒序排序
            queryWrapper.orderByDesc("create_time");
            
            // 4. 查询订单列表
            List<Order> orders = orderMapper.selectList(queryWrapper);
            
            // 5. 转换为OrderListVO列表
            List<OrderListVO> orderListVOs = new ArrayList<>();
            for (Order order : orders) {
                OrderListVO vo = new OrderListVO();
                // 这里需要根据OrderListVO的实际字段进行赋值
                // 简化实现，只设置基本信息
                vo.setOrderNo(order.getOrderNo());
                vo.setStatus(order.getStatus());
                vo.setTotalAmount(order.getTotalAmount());
                vo.setCreateTime(order.getCreateTime());
                orderListVOs.add(vo);
            }
            
            log.info("获取用户订单列表成功，用户ID：{}，订单数量：{}", userId, orderListVOs.size());
            return orderListVOs;
        } catch (Exception e) {
            log.error("获取用户订单列表失败, userId={}, status={}", userId, status, e);
            return new ArrayList<>();
        }
    }

    @Override
    @Cacheable(value = "orderCache", key = "'order_detail_' + #orderNo + '_' + #userId", unless = "#result == null")
    public OrderDetailVO getOrderDetailByOrderNo(String orderNo, Long userId) {
        log.info("获取订单详情，订单号：{}，用户ID：{}", orderNo, userId);
        try {
            // 1. 查询订单信息
            Order order = getByOrderNoAndUserId(orderNo, userId);
            if (order == null) {
                log.error("获取订单详情失败，订单不存在或不属于当前用户，订单号：{}，用户ID：{}", orderNo, userId);
                return null;
            }
            
            // 2. 创建订单详情VO
            OrderDetailVO detailVO = new OrderDetailVO();
            // 简化实现，只设置基本信息
            detailVO.setOrderNo(order.getOrderNo());
            detailVO.setStatus(order.getStatus());
            detailVO.setPayStatus(order.getPayStatus());
            detailVO.setPaymentMethod(order.getPayType());
            detailVO.setTotalAmount(order.getTotalAmount());
            detailVO.setPayAmount(order.getPayAmount());
            detailVO.setCreateTime(order.getCreateTime());
            detailVO.setPayTime(order.getPayTime());
            detailVO.setCompleteTime(order.getCompleteTime());
            detailVO.setRemark(order.getOrderRemark());
            
            // 3. 查询订单项信息
            // 这里需要查询订单项列表，简化实现，暂时为空
            detailVO.setOrderItems(new ArrayList<>());
            
            log.info("获取订单详情成功，订单号：{}", orderNo);
            return detailVO;
        } catch (Exception e) {
            log.error("获取订单详情失败, orderNo={}, userId={}", orderNo, userId, e);
            return null;
        }
    }

    @Override
    @Cacheable(value = "orderCache", key = "'user_orders_' + #userId + '_' + #status + '_' + #page + '_' + #limit")
    public Map<String, Object> getUserOrderList(Long userId, Integer status, Integer page, Integer limit) {
        log.info("获取用户分页订单列表，用户ID：{}，状态：{}，页码：{}，每页数量：{}", userId, status, page, limit);
        try {
            // 1. 参数校验
            if (page == null || page < 1) {
                page = 1;
            }
            if (limit == null || limit < 1) {
                limit = 10;
            }
            
            // 2. 计算偏移量
            int offset = (page - 1) * limit;
            
            // 3. 创建查询条件
            QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId);
            
            // 4. 如果状态不为空，添加状态条件
            if (status != null) {
                queryWrapper.eq("status", status);
            }
            
            // 5. 按创建时间倒序排序
            queryWrapper.orderByDesc("create_time");
            
            // 6. 查询总记录数
            long total = orderMapper.selectCount(queryWrapper);
            
            // 7. 查询当前页的订单列表
            queryWrapper.last("LIMIT " + offset + ", " + limit);
            List<Order> orders = orderMapper.selectList(queryWrapper);
            
            // 8. 转换为OrderListVO列表
            List<OrderListVO> orderListVOs = new ArrayList<>();
            for (Order order : orders) {
                OrderListVO vo = new OrderListVO();
                // 简化实现，只设置基本信息
                vo.setOrderNo(order.getOrderNo());
                vo.setStatus(order.getStatus());
                vo.setTotalAmount(order.getTotalAmount());
                vo.setCreateTime(order.getCreateTime());
                orderListVOs.add(vo);
            }
            
            // 9. 构建返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("total", total);
            result.put("list", orderListVOs);
            result.put("page", page);
            result.put("limit", limit);
            result.put("pages", (total + limit - 1) / limit);
            
            log.info("获取用户分页订单列表成功，用户ID：{}，总记录数：{}，当前页数量：{}", userId, total, orderListVOs.size());
            return result;
        } catch (Exception e) {
            log.error("获取用户分页订单列表失败, userId={}", userId, e);
            Map<String, Object> result = new HashMap<>();
            result.put("total", 0);
            result.put("list", new ArrayList<>());
            result.put("page", page);
            result.put("limit", limit);
            result.put("pages", 0);
            return result;
        }
    }

    @Override
    @Cacheable(value = "orderCache", key = "'pending_orders'")
    public List<Order> getPendingOrders() {
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
        return orderMapper.selectList(queryWrapper);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean handlePaymentCallback(String orderNo, Integer payStatus, String payTradeNo, Date payTime) {
        log.info("处理支付回调，订单号：{}", orderNo);
        // 简化实现
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean updatePayStatus(String orderNo, Integer payStatus) {
        log.info("更新订单支付状态，订单号：{}", orderNo);
        // 简化实现
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean processPaySuccess(String orderNo, String payTradeNo, Date payTime) {
        log.info("处理支付成功，订单号：{}", orderNo);
        // 简化实现
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public int cancelTimeoutOrders() {
        log.info("取消超时未支付订单");
        // 简化实现
        return 0;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public int autoConfirmReceivedOrders() {
        log.info("自动确认超时未收货订单");
        // 简化实现
        return 0;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean applyRefund(String orderNo, Long userId, String refundReason, BigDecimal refundAmount) {
        log.info("申请退款，订单号：{}，用户ID：{}", orderNo, userId);
        try {
            // 1. 检查订单是否属于该用户
            Order order = getByOrderNoAndUserId(orderNo, userId);
            if (order == null) {
                log.error("申请退款失败，订单不存在或不属于当前用户，订单号：{}，用户ID：{}", orderNo, userId);
                return false;
            }
            
            // 2. 检查订单状态
            if (!OrderConstant.ORDER_STATUS_PAID.equals(order.getStatus()) && 
                !OrderConstant.ORDER_STATUS_PENDING_RECEIVE.equals(order.getStatus()) &&
                !OrderConstant.ORDER_STATUS_COMPLETED.equals(order.getStatus())) {
                log.error("申请退款失败，订单状态不正确，订单号：{}，当前状态：{}", orderNo, order.getStatus());
                return false;
            }
            
            // 3. 检查退款金额
            if (refundAmount == null || refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
                log.error("申请退款失败，退款金额无效，订单号：{}，退款金额：{}", orderNo, refundAmount);
                return false;
            }
            
            if (refundAmount.compareTo(order.getPayAmount()) > 0) {
                log.error("申请退款失败，退款金额超过支付金额，订单号：{}，退款金额：{}，支付金额：{}", 
                        orderNo, refundAmount, order.getPayAmount());
                return false;
            }
            
            // 4. 更新订单退款信息
            order.setRefundStatus(OrderConstant.ORDER_STATUS_REFUNDING);
            order.setRefundAmount(refundAmount);
            order.setRefundReason(refundReason);
            order.setRefundApplyTime(new Date());
            order.setUpdateTime(new Date());
            
            // 5. 保存更新
            orderMapper.updateById(order);
            
            log.info("申请退款成功，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("申请退款失败, orderNo={}, userId={}", orderNo, userId, e);
            return false;
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean processRefund(String orderNo, Integer status, String handler) {
        log.info("处理退款申请，订单号：{}", orderNo);
        try {
            // 1. 查询订单信息
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("处理退款申请失败，订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 2. 检查订单状态
            if (!OrderConstant.ORDER_STATUS_REFUNDING.equals(order.getRefundStatus())) {
                log.error("处理退款申请失败，订单退款状态不正确，订单号：{}，当前退款状态：{}", orderNo, order.getRefundStatus());
                return false;
            }
            
            // 3. 更新退款状态
            order.setRefundStatus(status);
            order.setRefundReviewTime(new Date());
            order.setRefundOperatorName(handler);
            order.setUpdateTime(new Date());
            
            // 4. 保存更新
            orderMapper.updateById(order);
            
            log.info("处理退款申请成功，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("处理退款申请失败, orderNo={}", orderNo, e);
            return false;
        }
    }
    
    @Override
    @Cacheable(value = "orderCache", key = "'refunding_orders'")
    public List<Order> getRefundingOrders() {
        log.info("获取退款中的订单");
        try {
            // 创建查询条件
            QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("refund_status", OrderConstant.ORDER_STATUS_REFUNDING);
            queryWrapper.orderByDesc("refund_apply_time");
            
            // 查询退款中的订单
            List<Order> orders = orderMapper.selectList(queryWrapper);
            
            log.info("获取退款中的订单成功，数量：{}", orders.size());
            return orders;
        } catch (Exception e) {
            log.error("获取退款中的订单失败", e);
            return new ArrayList<>();
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean intelligentAssignOrder(Order order) {
        log.info("智能分配订单，订单号：{}", order.getOrderNo());
        try {
            // 1. 获取推荐的商家列表
            List<Map<String, Object>> recommendedMerchants = getRecommendedMerchants(order, 10);
            
            if (recommendedMerchants.isEmpty()) {
                log.error("智能分配订单失败，没有找到合适的商家，订单号：{}", order.getOrderNo());
                return false;
            }
            
            // 2. 选择最优商家（这里简化实现，选择第一个推荐商家）
            Map<String, Object> bestMerchant = recommendedMerchants.get(0);
            Long merchantId = Long.valueOf(bestMerchant.get("id").toString());
            
            // 3. 更新订单的商家ID
            order.setMerchantId(merchantId);
            order.setUpdateTime(new Date());
            
            // 4. 保存订单
            orderMapper.updateById(order);
            
            log.info("智能分配订单成功，订单号：{}，分配给商家：{}", order.getOrderNo(), merchantId);
            return true;
        } catch (Exception e) {
            log.error("智能分配订单失败，订单号：{}", order.getOrderNo(), e);
            return false;
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean assignOrderById(Long orderId) {
        log.info("根据订单ID分配订单，订单ID：{}", orderId);
        try {
            // 1. 根据订单ID查询订单
            Order order = orderMapper.selectById(orderId);
            if (order == null) {
                log.error("根据订单ID分配订单失败，订单不存在，订单ID：{}", orderId);
                return false;
            }
            
            // 2. 调用智能分配方法
            return intelligentAssignOrder(order);
        } catch (Exception e) {
            log.error("根据订单ID分配订单失败，订单ID：{}", orderId, e);
            return false;
        }
    }
    
    @Override
    public Integer getMerchantOrderLoad(Long merchantId) {
        // 简化实现：查询商家当前处理中的订单数量
        QueryWrapper<Order> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("merchant_id", merchantId)
                   .in("status", Arrays.asList(
                           OrderConstant.ORDER_STATUS_PENDING_DELIVERY,
                           OrderConstant.ORDER_STATUS_PENDING_RECEIVE
                   ));
        return Math.toIntExact(orderMapper.selectCount(queryWrapper));
    }
    
    @Override
    public List<Map<String, Object>> getRecommendedMerchants(Order order, Integer limit) {
        log.info("获取推荐商家列表，订单号：{}", order.getOrderNo());
        try {
            // 简化实现：返回模拟的商家列表
            // 实际项目中，应该根据订单的商品分类、商家评分、距离、负载等因素进行智能推荐
            List<Map<String, Object>> merchants = new ArrayList<>();
            
            // 模拟推荐5个商家
            for (int i = 1; i <= Math.min(limit, 5); i++) {
                Map<String, Object> merchant = new HashMap<>();
                merchant.put("id", i);
                merchant.put("name", "商家" + i);
                merchant.put("score", 4.5 + (i * 0.1)); // 评分从4.6到5.0
                merchant.put("distance", 1.0 + (i * 0.5)); // 距离从1.5到3.5公里
                merchant.put("load", i * 2); // 负载从2到10
                merchants.add(merchant);
            }
            
            // 根据评分降序、距离升序、负载升序排序
            merchants.sort((m1, m2) -> {
                // 先比较评分（降序）
                double score1 = (double) m1.get("score");
                double score2 = (double) m2.get("score");
                if (score1 != score2) {
                    return Double.compare(score2, score1);
                }
                
                // 再比较距离（升序）
                double distance1 = (double) m1.get("distance");
                double distance2 = (double) m2.get("distance");
                if (distance1 != distance2) {
                    return Double.compare(distance1, distance2);
                }
                
                // 最后比较负载（升序）
                int load1 = (int) m1.get("load");
                int load2 = (int) m2.get("load");
                return Integer.compare(load1, load2);
            });
            
            log.info("获取推荐商家列表成功，订单号：{}，推荐商家数量：{}", order.getOrderNo(), merchants.size());
            return merchants;
        } catch (Exception e) {
            log.error("获取推荐商家列表失败，订单号：{}", order.getOrderNo(), e);
            return Collections.emptyList();
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean processRefundSuccess(String orderNo, String refundTradeNo, Date refundTime) {
        log.info("处理退款成功，订单号：{}", orderNo);
        try {
            // 1. 查询订单信息
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("处理退款成功失败，订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 2. 更新订单退款状态
            order.setRefundStatus(OrderConstant.ORDER_STATUS_REFUNDED);
            order.setRefundSuccessTime(refundTime);
            order.setUpdateTime(new Date());
            
            // 3. 如果订单状态是已取消，更新订单状态
            if (OrderConstant.ORDER_STATUS_CANCELLED.equals(order.getStatus())) {
                order.setStatus(OrderConstant.ORDER_STATUS_REFUNDED);
            }
            
            // 4. 保存更新
            orderMapper.updateById(order);
            
            log.info("处理退款成功完成，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("处理退款成功失败, orderNo={}", orderNo, e);
            return false;
        }
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"orderCache", "salesAnalysis"}, allEntries = true)
    public Boolean processRefundFail(String orderNo, String failReason) {
        log.info("处理退款失败，订单号：{}", orderNo);
        try {
            // 1. 查询订单信息
            Order order = getByOrderNo(orderNo);
            if (order == null) {
                log.error("处理退款失败，订单不存在，订单号：{}", orderNo);
                return false;
            }
            
            // 2. 更新订单退款状态
            order.setRefundStatus(OrderConstant.ORDER_STATUS_CANCELLED);
            order.setUpdateTime(new Date());
            
            // 3. 保存更新
            orderMapper.updateById(order);
            
            log.info("处理退款失败完成，订单号：{}", orderNo);
            return true;
        } catch (Exception e) {
            log.error("处理退款失败, orderNo={}", orderNo, e);
            return false;
        }
    }
    
    // --- 以下是订单统计和退款相关方法的简化实现 ---
    
    @Override
    public List<Map<String, Object>> getOrderRefundLogs(Long orderId) {
        return new ArrayList<>();
    }
    
    @Override
    public List<Map<String, Object>> getOrderRefundLogsByOrderNo(String orderNo) {
        return new ArrayList<>();
    }
    
    @Override
    public Map<String, Object> getRefundStatistics() {
        return new HashMap<>();
    }
    
    @Override
    public List<Map<String, Object>> getRefundReasonDistribution() {
        return new ArrayList<>();
    }
    
    @Override
    public List<Map<String, Object>> getRefundStatusDistribution() {
        return new ArrayList<>();
    }
    
    @Override
    public List<Map<String, Object>> getRefundAmountRangeDistribution() {
        return new ArrayList<>();
    }
    
    @Override
    public Map<String, Object> getRefundStatisticsByTimeRange(Date startTime, Date endTime) {
        return new HashMap<>();
    }
    
    @Override
    public Map<String, Object> getOrderStatistics() {
        return new HashMap<>();
    }
    
    @Override
    public Map<String, Object> getOrderStatisticsByTimeRange(Date startTime, Date endTime) {
        return new HashMap<>();
    }
    
    @Override
    public List<Map<String, Object>> getOrderStatusDistribution() {
        return new ArrayList<>();
    }
    
    @Override
    public List<Map<String, Object>> getOrderAmountRangeDistribution() {
        return new ArrayList<>();
    }
    
    @Override
    public List<Map<String, Object>> getOrderTrend(String type, Integer count) {
        return new ArrayList<>();
    }
    
    @Override
    public List<Map<String, Object>> getHotProductsOrderStatistics(Integer limit) {
        return new ArrayList<>();
    }
    
    @Override
    public Map<String, Object> getUserOrderStatistics(Long userId) {
        return new HashMap<>();
    }
    

    
    /**
     * 生成订单号
     */
    private String generateOrderNo() {
        // 生成唯一订单号，格式：时间戳+6位随机数
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String timeStr = sdf.format(new Date());
        String randomStr = String.format("%06d", new Random().nextInt(1000000));
        return timeStr + randomStr;
    }
}