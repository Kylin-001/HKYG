package com.heikeji.mall.takeout.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.common.constants.OrderStatusConstant;
import com.heikeji.mall.takeout.constants.TakeoutConstants;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import com.heikeji.mall.takeout.entity.DeliveryLocker;
import com.heikeji.mall.takeout.entity.Merchant;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.entity.TakeoutOrderItem;
import com.heikeji.mall.takeout.entity.TakeoutProduct;
import com.heikeji.mall.takeout.entity.TakeoutDeliveryTrack;
import com.heikeji.mall.takeout.exception.TakeoutException;
import com.heikeji.mall.takeout.mapper.DeliveryLockerMapper;
import com.heikeji.mall.takeout.mapper.MerchantMapper;
import com.heikeji.mall.takeout.mapper.TakeoutOrderItemMapper;
import com.heikeji.mall.takeout.mapper.TakeoutOrderMapper;
import com.heikeji.mall.takeout.mapper.TakeoutProductMapper;
import com.heikeji.mall.takeout.service.TakeoutService;
import com.heikeji.mall.takeout.service.PaymentService;
import com.heikeji.mall.takeout.service.TakeoutDeliveryTrackService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 外卖服务实现类
 */
@Slf4j
@Service
public class TakeoutServiceImpl extends ServiceImpl<TakeoutOrderMapper, TakeoutOrder> implements TakeoutService {

    @Autowired
    private TakeoutOrderMapper takeoutOrderMapper;
    
    @Autowired
    private TakeoutOrderItemMapper takeoutOrderItemMapper;
    
    @Autowired
    private TakeoutProductMapper takeoutProductMapper;
    
    @Autowired
    private MerchantMapper merchantMapper;
    
    @Autowired
    private DeliveryLockerMapper deliveryLockerMapper;

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private TakeoutDeliveryTrackService deliveryTrackService;
    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"takeoutCache"}, allEntries = true)
    @Override
    public TakeoutOrder createTakeoutOrder(CreateTakeoutOrderDTO dto) {
        // 验证参数
        if (dto == null) {
            throw new TakeoutException("参数不能为空");
        }

        // 验证商家是否存在
        Merchant merchant = merchantMapper.selectById(dto.getMerchantId());
        if (merchant == null) {
            throw new TakeoutException("商家不存在");
        }

        // 验证配送方式
        Integer deliveryType = dto.getDeliveryType();
        if (deliveryType == null || (deliveryType < 1 || deliveryType > 3)) {
            throw new TakeoutException("配送方式不合法");
        }

        // 验证配送信息
        if (1 == deliveryType) { // 外卖柜配送
            if (StringUtils.isBlank(dto.getDeliveryLockerCode())) {
                throw new TakeoutException("外卖柜编码不能为空");
            }
            // 占用外卖柜
            boolean occupied = occupyLockerCell(dto.getDeliveryLockerCode());
            if (!occupied) {
                throw new TakeoutException("外卖柜已满或不可用");
            }
        } else if (2 == deliveryType) { // 特殊地点配送
            if (StringUtils.isBlank(dto.getDeliverySpecialPlace())) {
                throw new TakeoutException("特殊地点描述不能为空");
            }
        } else if (3 == deliveryType) { // 宿舍配送
            if (StringUtils.isBlank(dto.getDeliveryDormBuilding()) || StringUtils.isBlank(dto.getDeliveryDormRoom())) {
                throw new TakeoutException("宿舍楼栋和房间号不能为空");
            }
        }

        // 验证收货信息
        if (StringUtils.isBlank(dto.getReceiverName()) || StringUtils.isBlank(dto.getReceiverPhone())) {
            throw new TakeoutException("收货人姓名和电话不能为空");
        }

        // 验证订单商品列表
        if (dto.getOrderItems() == null || dto.getOrderItems().isEmpty()) {
            throw new TakeoutException("订单商品不能为空");
        }

        // 计算订单总金额并验证商品信息
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<TakeoutOrderItem> orderItems = new ArrayList<>();
        List<TakeoutProduct> productsToUpdate = new ArrayList<>();
        
        for (CreateTakeoutOrderDTO.OrderItemDTO itemDTO : dto.getOrderItems()) {
            // 验证商品是否存在
            TakeoutProduct product = takeoutProductMapper.selectById(itemDTO.getProductId());
            if (product == null) {
                throw new TakeoutException("商品不存在: " + itemDTO.getProductId());
            }

            // 验证商品状态
            if (product.getStatus() != 1) { // 1表示上架状态
                throw new TakeoutException("商品已下架: " + product.getName());
            }

            // 验证库存
            if (product.getStock() < itemDTO.getQuantity()) {
                throw new TakeoutException("商品库存不足: " + product.getName());
            }

            // 验证价格
            if (itemDTO.getPrice().compareTo(product.getPrice()) != 0) {
                throw new TakeoutException("商品价格已更新，请重新下单: " + product.getName());
            }

            // 计算商品总金额
            BigDecimal itemTotal = product.getPrice().multiply(new BigDecimal(itemDTO.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            // 创建订单商品项
            TakeoutOrderItem orderItem = new TakeoutOrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setProductImage(product.getImage());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setTotalAmount(itemTotal);
            orderItem.setSpecifications("");
            orderItem.setCreateTime(new Date());
            orderItem.setUpdateTime(new Date());
            orderItems.add(orderItem);

            // 更新商品库存和销量
            product.setStock(product.getStock() - itemDTO.getQuantity());
            product.setSales(product.getSales() + itemDTO.getQuantity());
            productsToUpdate.add(product);
        }

        // 创建订单
        TakeoutOrder order = new TakeoutOrder();
        order.setMerchantId(dto.getMerchantId());
        order.setDeliveryType(dto.getDeliveryType());
        order.setDeliveryLockerCode(dto.getDeliveryLockerCode());
        order.setDeliverySpecialPlace(dto.getDeliverySpecialPlace());
        order.setDeliveryDormBuilding(dto.getDeliveryDormBuilding());
        order.setDeliveryDormRoom(dto.getDeliveryDormRoom());
        order.setReceiverName(dto.getReceiverName());
        order.setReceiverPhone(dto.getReceiverPhone());
        order.setReceiverAddress(dto.getReceiverAddress());
        order.setRemark(dto.getRemark());
        
        // 设置订单总金额
        order.setTotalAmount(totalAmount);
        
        // 生成订单号
        order.setOrderNo(generateOrderNo());
        
        // 设置订单状态为待接单
        order.setStatus(OrderStatusConstant.TAKEOUT_STATUS_PENDING_ACCEPT);
        
        // 设置创建时间和更新时间
        Date now = new Date();
        order.setCreateTime(now);
        order.setUpdateTime(now);
        
        // 保存订单
        takeoutOrderMapper.insert(order);
        
        // 保存订单商品项
        for (TakeoutOrderItem item : orderItems) {
            item.setOrderId(order.getId());
            takeoutOrderItemMapper.insert(item);
        }
        
        // 更新商品库存和销量
        for (TakeoutProduct product : productsToUpdate) {
            takeoutProductMapper.updateById(product);
        }
        
        // 创建初始配送轨迹
        TakeoutDeliveryTrack track = new TakeoutDeliveryTrack();
        track.setTakeoutOrderId(order.getId());
        track.setOrderNo(order.getOrderNo());
        track.setStatus(order.getStatus());
        track.setStatusDesc("订单已创建，等待配送员接单");
        deliveryTrackService.createTrack(track);
        
        return order;
    }

    @Override
    @Cacheable(value = "takeoutCache", key = "'order_' + #id", unless = "#result == null")
    public TakeoutOrder getTakeoutOrderById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        TakeoutOrder order = takeoutOrderMapper.selectById(id);
        if (order == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "订单不存在");
        }
        return order;
    }

    @Override
    @Cacheable(value = "takeoutCache", key = "'user_orders_' + #userId + '_' + (#status == null ? 'all' : #status)")
    public List<TakeoutOrder> getUserTakeoutOrders(Long userId, Integer status) {
        LambdaQueryWrapper<TakeoutOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TakeoutOrder::getUserId, userId);
        if (status != null) {
            queryWrapper.eq(TakeoutOrder::getStatus, status);
        }
        queryWrapper.orderByDesc(TakeoutOrder::getCreateTime);
        return takeoutOrderMapper.selectList(queryWrapper);
    }

    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"takeoutCache"}, allEntries = true)
    @Override
    public boolean updateOrderStatus(Long orderId, Integer status) {
        if (orderId == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        if (!isValidStatus(status)) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "无效的订单状态");
        }
        
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "订单不存在");
        }
        
        // 验证状态转换是否合法
        validateStatusTransition(order.getStatus(), status);
        
        order.setStatus(status);
        order.setUpdateTime(new Date());
        
        // 如果是已送达，记录实际送达时间
        if (status == OrderStatusConstant.TAKEOUT_STATUS_DELIVERED) {
            order.setActualTime(new Date());
        }
        
        // 如果是取消订单且使用了外卖柜，释放柜子
        if (status == OrderStatusConstant.TAKEOUT_STATUS_CANCELLED && order.getDeliveryType() == 1 && order.getDeliveryLockerCode() != null) {
            releaseLockerCell(order.getDeliveryLockerCode());
        }
        
        boolean updated = takeoutOrderMapper.updateById(order) > 0;
        if (updated) {
            // 添加配送轨迹记录
            String statusDesc = getStatusDescription(status);
            deliveryTrackService.updateTrackStatus(order.getId(), status, statusDesc);
        }
        return updated;
    }

    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"takeoutCache"}, allEntries = true)
    @Override
    public boolean cancelOrder(Long orderId, Long userId) {
        if (orderId == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        
        TakeoutOrder order;
        if (userId != null) {
            LambdaQueryWrapper<TakeoutOrder> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(TakeoutOrder::getId, orderId);
            queryWrapper.eq(TakeoutOrder::getUserId, userId);
            order = takeoutOrderMapper.selectOne(queryWrapper);
        } else {
            order = takeoutOrderMapper.selectById(orderId);
        }
        
        if (order == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "订单不存在");
        }
        
        // 只有待接单和已接单状态可以取消
        if (!order.getStatus().equals(OrderStatusConstant.TAKEOUT_STATUS_PENDING_ACCEPT) && 
            !order.getStatus().equals(OrderStatusConstant.TAKEOUT_STATUS_ACCEPTED)) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_CANNOT_CANCEL, "当前订单状态不允许取消");
        }
        
        // 取消订单
        order.setStatus(OrderStatusConstant.TAKEOUT_STATUS_CANCELLED);
        order.setUpdateTime(new Date());
        
        // 如果使用了外卖柜，释放柜子
        if (order.getDeliveryType() == 1 && order.getDeliveryLockerCode() != null) {
            releaseLockerCell(order.getDeliveryLockerCode());
        }
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"takeoutCache"}, allEntries = true)
    @Override
    public boolean acceptOrder(Long orderId, Long deliveryPersonId) {
        if (orderId == null || deliveryPersonId == null) {
            throw new IllegalArgumentException("订单ID和配送员ID不能为空");
        }
        
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "订单不存在");
        }
        
        // 只有待接单状态可以接单
        if (!order.getStatus().equals(OrderStatusConstant.TAKEOUT_STATUS_PENDING_ACCEPT)) {
            throw new TakeoutException("订单已被接单或取消");
        }
        
        order.setStatus(OrderStatusConstant.TAKEOUT_STATUS_ACCEPTED); // 已接单
        order.setDeliveryPersonId(deliveryPersonId);
        order.setUpdateTime(new Date());
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"takeoutCache"}, allEntries = true)
    @Override
    public boolean updateDeliveryInfo(Long orderId, Long deliveryPersonId, String deliveryPersonName, String deliveryPersonPhone) {
        if (orderId == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "订单不存在");
        }
        
        order.setDeliveryPersonId(deliveryPersonId);
        order.setDeliveryPersonName(deliveryPersonName);
        order.setDeliveryPersonPhone(deliveryPersonPhone);
        order.setUpdateTime(new Date());
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"takeoutCache"}, allEntries = true)
    @Override
    public boolean markAsDelivered(Long orderId) {
        if (orderId == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException(TakeoutConstants.ERROR_CODE_ORDER_NOT_FOUND, "订单不存在");
        }
        
        if (!order.getStatus().equals(OrderStatusConstant.TAKEOUT_STATUS_DELIVERING)) {
            throw new TakeoutException("只有配送中的订单才能标记为已送达");
        }
        
        order.setStatus(OrderStatusConstant.TAKEOUT_STATUS_DELIVERED); // 已送达
        order.setActualTime(new Date());
        order.setUpdateTime(new Date());
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Override
    @Cacheable(value = "takeoutCache", key = "'available_lockers'")
    public List<DeliveryLocker> getAvailableLockers() {
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getStatus, TakeoutConstants.LOCKER_STATUS_NORMAL);
        queryWrapper.gt(DeliveryLocker::getAvailableCells, 0);
        queryWrapper.orderByAsc(DeliveryLocker::getCampusArea);
        return deliveryLockerMapper.selectList(queryWrapper);
    }

    @Override
    @Cacheable(value = "takeoutCache", key = "'locker_' + #lockerCode", unless = "#result == null")
    public DeliveryLocker getLockerByCode(String lockerCode) {
        if (lockerCode == null || lockerCode.trim().isEmpty()) {
            throw new IllegalArgumentException("外卖柜编码不能为空");
        }
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, lockerCode.trim());
        return deliveryLockerMapper.selectOne(queryWrapper);
    }

    // 辅助方法
    private void validateOrderInfo(TakeoutOrder order) {
        if (order.getUserId() == null) {
            throw new IllegalArgumentException("用户ID不能为空");
        }
        if (order.getMerchantId() == null) {
            throw new IllegalArgumentException("商家ID不能为空");
        }
        if (order.getTotalAmount() == null || order.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("订单金额必须大于0");
        }
    }

    private String generateOrderNo() {
        return "TO" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private boolean isValidStatus(Integer status) {
        return OrderStatusConstant.isValidTakeoutStatus(status);
    }

    private void validateStatusTransition(Integer currentStatus, Integer newStatus) {
        // 定义合法的状态转换规则
        switch (currentStatus) {
            case OrderStatusConstant.TAKEOUT_STATUS_PENDING_ACCEPT: // 待接单
                if (!(newStatus.equals(OrderStatusConstant.TAKEOUT_STATUS_ACCEPTED) || newStatus.equals(OrderStatusConstant.TAKEOUT_STATUS_CANCELLED))) {
                    throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "待接单状态只能转为已接单或已取消");
                }
                break;
            case OrderStatusConstant.TAKEOUT_STATUS_ACCEPTED: // 已接单
                if (!(newStatus.equals(OrderStatusConstant.TAKEOUT_STATUS_DELIVERING) || newStatus.equals(OrderStatusConstant.TAKEOUT_STATUS_CANCELLED))) {
                    throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "已接单状态只能转为配送中或已取消");
                }
                break;
            case OrderStatusConstant.TAKEOUT_STATUS_DELIVERING: // 配送中
                if (!newStatus.equals(OrderStatusConstant.TAKEOUT_STATUS_DELIVERED)) {
                    throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "配送中状态只能转为已送达");
                }
                break;
            case OrderStatusConstant.TAKEOUT_STATUS_DELIVERED: // 已送达
                if (!OrderStatusConstant.canChangeTakeoutStatus(newStatus)) {
                    throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "已送达状态只能转为用户已取货或超时未取货");
                }
                break;
            case OrderStatusConstant.TAKEOUT_STATUS_USER_PICKED: // 用户已取货
                throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "用户已取货状态不能转换");
            case OrderStatusConstant.TAKEOUT_STATUS_TIMEOUT_NOT_PICKED: // 超时未取货
                throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "超时未取货状态不能转换");
            case OrderStatusConstant.TAKEOUT_STATUS_CANCELLED: // 已取消
                throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "已取消状态不能转换");
            default:
                throw new TakeoutException(TakeoutConstants.ERROR_CODE_INVALID_STATUS, "无效的当前状态");
        }
    }
    
    /**
     * 获取订单状态描述
     */
    private String getStatusDescription(Integer status) {
        switch (status) {
            case OrderStatusConstant.TAKEOUT_STATUS_PENDING_ACCEPT: return "订单已创建，等待配送员接单";
            case OrderStatusConstant.TAKEOUT_STATUS_ACCEPTED: return "配送员已接单";
            case OrderStatusConstant.TAKEOUT_STATUS_DELIVERING: return "订单正在配送中";
            case OrderStatusConstant.TAKEOUT_STATUS_DELIVERED: return "订单已送达";
            case OrderStatusConstant.TAKEOUT_STATUS_USER_PICKED: return "用户已取货";
            case OrderStatusConstant.TAKEOUT_STATUS_TIMEOUT_NOT_PICKED: return "订单超时未取货";
            case OrderStatusConstant.TAKEOUT_STATUS_CANCELLED: return "订单已取消";
            default: return "未知状态";
        }
    }

    @Override
    public boolean occupyLockerCell(String lockerCode) {
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, lockerCode);
        queryWrapper.eq(DeliveryLocker::getStatus, TakeoutConstants.LOCKER_STATUS_NORMAL);
        
        DeliveryLocker locker = deliveryLockerMapper.selectOne(queryWrapper);
        if (locker == null || locker.getAvailableCells() <= 0) {
            return false;
        }
        
        locker.setAvailableCells(locker.getAvailableCells() - 1);
        locker.setUpdateTime(new Date());
        
        return deliveryLockerMapper.updateById(locker) > 0;
    }

    @Override
    public boolean releaseLockerCell(String lockerCode) {
        LambdaQueryWrapper<DeliveryLocker> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DeliveryLocker::getLockerCode, lockerCode);
        
        DeliveryLocker locker = deliveryLockerMapper.selectOne(queryWrapper);
        if (locker == null) {
            return false;
        }
        
        locker.setAvailableCells(locker.getAvailableCells() + 1);
        locker.setUpdateTime(new Date());
        
        return deliveryLockerMapper.updateById(locker) > 0;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> createPayment(Long orderId, Integer paymentMethod) {
        // 验证订单是否存在
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException("订单不存在");
        }
        
        // 验证订单状态
        if (order.getStatus() != 0) { // 0表示待接单
            throw new TakeoutException("当前订单状态不支持支付");
        }
        
        // 验证支付方式
        if (paymentMethod == null || (paymentMethod < 1 || paymentMethod > 3)) {
            throw new TakeoutException("支付方式不合法");
        }
        
        // 调用支付服务创建支付
        Map<String, Object> paymentParams = paymentService.createPayment(order, paymentMethod);
        
        // 更新订单的支付方式和支付流水号
        String paymentNo = (String) paymentParams.get("paymentNo");
        order.setPaymentMethod(paymentMethod);
        order.setPaymentNo(paymentNo);
        order.setPaymentStatus(0); // 0表示未支付
        order.setUpdateTime(new Date());
        takeoutOrderMapper.updateById(order);
        
        return paymentParams;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean handlePaymentCallback(Map<String, String> callbackParams) {
        // 调用支付服务处理回调
        Map<String, Object> callbackResult = paymentService.handleCallback(callbackParams);
        
        // 获取支付流水号和支付状态
        String paymentNo = (String) callbackResult.get("paymentNo");
        Integer paymentStatus = (Integer) callbackResult.get("paymentStatus");
        String transactionId = (String) callbackResult.get("transactionId");
        
        // 根据支付流水号查询订单
        LambdaQueryWrapper<TakeoutOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TakeoutOrder::getPaymentNo, paymentNo);
        TakeoutOrder order = takeoutOrderMapper.selectOne(queryWrapper);
        
        if (order == null) {
            throw new TakeoutException("订单不存在");
        }
        
        // 检查订单是否已经处理过支付
        if (order.getPaymentStatus() == 1) {
            return true; // 订单已经支付过，直接返回成功
        }
        
        // 更新订单支付状态
        order.setPaymentStatus(paymentStatus);
        order.setTransactionId(transactionId);
        order.setPaymentTime(new Date());
        order.setUpdateTime(new Date());
        
        // 如果支付成功，更新订单状态为已接单
        if (paymentStatus == 1) {
            order.setStatus(1); // 1表示已接单
        }
        
        return takeoutOrderMapper.updateById(order) > 0;
    }
    
    @Override
    public Integer queryPaymentStatus(Long orderId) {
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException("订单不存在");
        }
        
        // 如果订单已经支付过，直接返回订单状态
        if (order.getPaymentStatus() == 1) {
            return order.getPaymentStatus();
        }
        
        // 否则查询支付服务获取最新状态
        if (StringUtils.isNotBlank(order.getPaymentNo())) {
            return paymentService.queryPaymentStatus(order.getPaymentNo());
        }
        
        return order.getPaymentStatus();
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updatePaymentStatus(Long orderId, Integer paymentStatus, String paymentNo, String transactionId) {
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException("订单不存在");
        }
        
        // 验证支付状态
        if (paymentStatus == null || (paymentStatus != 0 && paymentStatus != 1)) {
            throw new TakeoutException("支付状态不合法");
        }
        
        // 更新支付状态
        order.setPaymentStatus(paymentStatus);
        if (StringUtils.isNotBlank(paymentNo)) {
            order.setPaymentNo(paymentNo);
        }
        if (StringUtils.isNotBlank(transactionId)) {
            order.setTransactionId(transactionId);
        }
        if (paymentStatus == 1) {
            order.setPaymentTime(new Date());
        }
        order.setUpdateTime(new Date());
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Override
    public List<TakeoutOrder> getMerchantOrders(Long merchantId) {
        if (merchantId == null) {
            throw new IllegalArgumentException("商家ID不能为空");
        }
        LambdaQueryWrapper<TakeoutOrder> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(TakeoutOrder::getMerchantId, merchantId);
        queryWrapper.orderByDesc(TakeoutOrder::getCreateTime);
        return takeoutOrderMapper.selectList(queryWrapper);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean completeOrder(Long orderId) {
        if (orderId == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException("订单不存在");
        }
        
        if (!order.getStatus().equals(OrderStatusConstant.TAKEOUT_STATUS_DELIVERED)) {
            throw new TakeoutException("只有已送达的订单才能完成");
        }
        
        order.setStatus(OrderStatusConstant.TAKEOUT_STATUS_USER_PICKED); // 用户已取货
        order.setUpdateTime(new Date());
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean applyRefund(Long orderId, String reason) {
        if (orderId == null) {
            throw new IllegalArgumentException("订单ID不能为空");
        }
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("退款原因不能为空");
        }
        
        TakeoutOrder order = takeoutOrderMapper.selectById(orderId);
        if (order == null) {
            throw new TakeoutException("订单不存在");
        }
        
        // 只有已送达和已完成的订单才能申请退款
        if (order.getStatus() != 3 && order.getStatus() != 5) {
            throw new TakeoutException("当前订单状态不允许申请退款");
        }
        
        order.setStatus(6); // 退款中
        order.setUpdateTime(new Date());
        
        return takeoutOrderMapper.updateById(order) > 0;
    }

    @Override
    public Map<String, Object> getOrderStatistics(Long merchantId) {
        if (merchantId == null) {
            throw new IllegalArgumentException("商家ID不能为空");
        }
        
        // 查询各类状态的订单数量
        Map<String, Object> statistics = new HashMap<>();
        
        // 待接单数量
        LambdaQueryWrapper<TakeoutOrder> pendingWrapper = new LambdaQueryWrapper<>();
        pendingWrapper.eq(TakeoutOrder::getMerchantId, merchantId).eq(TakeoutOrder::getStatus, OrderStatusConstant.TAKEOUT_STATUS_PENDING_ACCEPT);
        statistics.put("pendingCount", takeoutOrderMapper.selectCount(pendingWrapper));
        
        // 已接单数量
        LambdaQueryWrapper<TakeoutOrder> acceptedWrapper = new LambdaQueryWrapper<>();
        acceptedWrapper.eq(TakeoutOrder::getMerchantId, merchantId).eq(TakeoutOrder::getStatus, OrderStatusConstant.TAKEOUT_STATUS_ACCEPTED);
        statistics.put("acceptedCount", takeoutOrderMapper.selectCount(acceptedWrapper));
        
        // 配送中数量
        LambdaQueryWrapper<TakeoutOrder> deliveringWrapper = new LambdaQueryWrapper<>();
        deliveringWrapper.eq(TakeoutOrder::getMerchantId, merchantId).eq(TakeoutOrder::getStatus, OrderStatusConstant.TAKEOUT_STATUS_DELIVERING);
        statistics.put("deliveringCount", takeoutOrderMapper.selectCount(deliveringWrapper));
        
        // 今日订单总数
        LambdaQueryWrapper<TakeoutOrder> todayWrapper = new LambdaQueryWrapper<>();
        todayWrapper.eq(TakeoutOrder::getMerchantId, merchantId)
                .ge(TakeoutOrder::getCreateTime, new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000));
        statistics.put("todayTotal", takeoutOrderMapper.selectCount(todayWrapper));
        
        return statistics;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Integer releaseTimeoutLockers(Integer hours) {
        if (hours == null || hours <= 0) {
            throw new IllegalArgumentException("超时小时数必须大于0");
        }
        
        // 查询超时未取货的外卖柜配送订单
        List<TakeoutOrder> overdueOrders = takeoutOrderMapper.selectOverdueDeliveredOrders(3, hours);
        if (overdueOrders == null || overdueOrders.isEmpty()) {
            return 0;
        }
        
        int releasedCount = 0;
        for (TakeoutOrder order : overdueOrders) {
            try {
                // 释放外卖柜格子
                if (order.getDeliveryLockerCode() != null) {
                    releaseLockerCell(order.getDeliveryLockerCode());
                }
                
                // 更新订单状态为超时未取货
                order.setStatus(OrderStatusConstant.TAKEOUT_STATUS_TIMEOUT_NOT_PICKED);
                order.setUpdateTime(new Date());
                
                takeoutOrderMapper.updateById(order);
                releasedCount++;
            } catch (Exception e) {
                log.error("释放外卖柜失败，订单ID: " + order.getId(), e);
            }
        }
        
        return releasedCount;
    }
    

}