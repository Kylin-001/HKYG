package com.heikeji.mall.takeout.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.takeout.dto.CreateTakeoutOrderDTO;
import com.heikeji.mall.takeout.dto.TakeoutOrderResponseDTO;
import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.entity.DeliveryLocker;
import com.heikeji.mall.takeout.enums.OrderStatusEnum;
import com.heikeji.mall.takeout.service.TakeoutService;
import com.heikeji.mall.takeout.utils.ResultUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.time.ZoneId;
import java.util.stream.Collectors;

/**
 * 外卖订单Controller
 */
@RestController
@RequestMapping("/api/takeout")
@Tag(name = "外卖订单", description = "外卖订单管理接口")
public class TakeoutController {

    @Autowired
    @Qualifier("takeoutServiceImpl")
    private TakeoutService takeoutService;

    /**
     * 创建外卖订单
     */
    @PostMapping("/order")
    @Operation(summary = "创建外卖订单", description = "根据请求参数创建外卖订单")
    @ApiResponse(responseCode = "200", description = "创建成功", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TakeoutOrderResponseDTO.class)))
    @ApiResponse(responseCode = "400", description = "请求参数错误")
    @ApiResponse(responseCode = "500", description = "服务器内部错误")
    public R createOrder(@Parameter(description = "创建外卖订单请求参数", required = true) @RequestBody CreateTakeoutOrderDTO dto) {
        try {
            // 验证配送信息
            validateDTO(dto);
            
            // 创建订单
              TakeoutOrder createdOrder = takeoutService.createTakeoutOrder(dto);
              return ResultUtil.success(convertToResponseDTO(createdOrder));
          } catch (IllegalArgumentException e) {
              return ResultUtil.error(e.getMessage());
          } catch (Exception e) {
              return ResultUtil.error("创建订单失败");
          }
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/order/{id}")
    @Operation(summary = "获取订单详情", description = "根据订单ID获取订单详情")
    @ApiResponse(responseCode = "200", description = "获取成功", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TakeoutOrderResponseDTO.class)))
    @ApiResponse(responseCode = "400", description = "请求参数错误")
    @ApiResponse(responseCode = "404", description = "订单不存在")
    @ApiResponse(responseCode = "500", description = "服务器内部错误")
    public R getOrderDetail(@Parameter(description = "订单ID", required = true) @PathVariable Long id) {
        TakeoutOrder order = takeoutService.getTakeoutOrderById(id);
        if (order == null) {
              return ResultUtil.error("订单不存在");
          }
        return ResultUtil.success(convertToResponseDTO(order));
    }

    /**
     * 获取用户订单列表
     */
    @GetMapping("/user/orders")
    @Operation(summary = "获取用户订单列表", description = "根据用户ID和订单状态获取用户订单列表")
    @ApiResponse(responseCode = "200", description = "获取成功", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TakeoutOrderResponseDTO.class, type = "array")))
    @ApiResponse(responseCode = "400", description = "请求参数错误")
    @ApiResponse(responseCode = "500", description = "服务器内部错误")
    public R getUserOrders(
            @Parameter(description = "用户ID", required = true) @RequestParam Long userId,
            @Parameter(description = "订单状态，可选参数") @RequestParam(required = false) Integer status) {
        List<TakeoutOrder> orders = takeoutService.getUserTakeoutOrders(userId, status);
        List<TakeoutOrderResponseDTO> responseDTOs = orders.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return ResultUtil.success(responseDTOs);
    }

    /**
     * 取消订单
     */
    @PostMapping("/order/{id}/cancel")
    public R cancelOrder(@PathVariable Long id, @RequestParam Long userId) {
        boolean result = takeoutService.cancelOrder(id, userId);
          return result ? ResultUtil.success(true) : ResultUtil.error("取消失败，请检查订单状态");
    }

    /**
     * 获取可用外卖柜列表
     */
    @GetMapping("/lockers/available")
    public R getAvailableLockers() {
        List<DeliveryLocker> lockers = takeoutService.getAvailableLockers();
        return ResultUtil.success(lockers);
    }

    /**
     * 配送员接单
     */
    @PostMapping("/order/{id}/accept")
    public R acceptOrder(@PathVariable Long id, @RequestParam Long deliveryPersonId) {
        boolean result = takeoutService.acceptOrder(id, deliveryPersonId);
          return result ? ResultUtil.success(true) : ResultUtil.error("接单失败");
    }

    /**
     * 更新订单状态
     */
    @PutMapping("/order/{id}/status")
    public R updateOrderStatus(@PathVariable Long id, @RequestParam Integer status) {
        boolean result = takeoutService.updateOrderStatus(id, status);
          return result ? ResultUtil.success(true) : ResultUtil.error("更新失败");
    }

    /**
     * 更新配送信息
     */
    @PutMapping("/order/{id}/delivery")
    public R updateDeliveryInfo(@PathVariable Long id,
                               @RequestParam Long deliveryPersonId,
                               @RequestParam String deliveryPersonName,
                               @RequestParam String deliveryPersonPhone) {
        boolean result = takeoutService.updateDeliveryInfo(id, deliveryPersonId, deliveryPersonName, deliveryPersonPhone);
          return result ? ResultUtil.success(true) : ResultUtil.error("更新配送信息失败");
    }

    /**
     * 标记订单为已送达
     */
    @PutMapping("/order/{id}/delivered")
    public R markAsDelivered(@PathVariable Long id) {
        boolean result = takeoutService.markAsDelivered(id);
          return result ? ResultUtil.success(true) : ResultUtil.error("标记失败");
    }

    /**
     * 验证DTO
     */
    private void validateDTO(CreateTakeoutOrderDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("订单信息不能为空");
        }
        if (dto.getMerchantId() == null) {
            throw new IllegalArgumentException("商家ID不能为空");
        }
        if (dto.getDeliveryType() == null) {
            throw new IllegalArgumentException("配送方式不能为空");
        }
        // 验证配送方式
        switch (dto.getDeliveryType()) {
            case 1: // 外卖柜
                if (dto.getDeliveryLockerCode() == null || dto.getDeliveryLockerCode().isEmpty()) {
                    throw new IllegalArgumentException("外卖柜配送必须选择外卖柜");
                }
                // 验证外卖柜是否存在且可用
                DeliveryLocker locker = takeoutService.getLockerByCode(dto.getDeliveryLockerCode());
                if (locker == null || locker.getStatus() != 0 || locker.getAvailableCells() <= 0) {
                    throw new IllegalArgumentException("所选外卖柜不可用");
                }
                break;
            case 2: // 特殊地点
                if (dto.getDeliverySpecialPlace() == null || dto.getDeliverySpecialPlace().isEmpty()) {
                    throw new IllegalArgumentException("请填写特殊配送地点");
                }
                break;
            case 3: // 送到宿舍
                if (dto.getDeliveryDormBuilding() == null || dto.getDeliveryDormBuilding().isEmpty()) {
                    throw new IllegalArgumentException("请填写宿舍楼栋");
                }
                if (dto.getDeliveryDormRoom() == null || dto.getDeliveryDormRoom().isEmpty()) {
                    throw new IllegalArgumentException("请填写宿舍房间号");
                }
                break;
            default:
                throw new IllegalArgumentException("不支持的配送方式");
        }
        if (dto.getReceiverName() == null || dto.getReceiverName().isEmpty()) {
            throw new IllegalArgumentException("收货人姓名不能为空");
        }
        if (dto.getReceiverPhone() == null || dto.getReceiverPhone().isEmpty()) {
            throw new IllegalArgumentException("收货人电话不能为空");
        }
        // 验证订单商品
        if (dto.getOrderItems() == null || dto.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("请添加商品");
        }
        for (CreateTakeoutOrderDTO.OrderItemDTO item : dto.getOrderItems()) {
            if (item.getProductId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new IllegalArgumentException("商品信息无效");
            }
        }
    }

    /**
     * 转换DTO为实体类
     */
    private TakeoutOrder convertToEntity(CreateTakeoutOrderDTO dto) {
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
        
        // 这里应该从用户会话中获取用户ID，暂时硬编码
        order.setUserId(1L);
        
        // 设置创建和更新时间为当前时间
        Date now = new Date();
        order.setCreateTime(now);
        order.setUpdateTime(now);
        
        return order;
    }

    /**
     * 转换实体类为响应DTO
     */
    private TakeoutOrderResponseDTO convertToResponseDTO(TakeoutOrder order) {
        if (order == null) {
            return null;
        }
        
        TakeoutOrderResponseDTO dto = new TakeoutOrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderSn(order.getOrderNo());
        dto.setMerchantId(order.getMerchantId());
        dto.setUserId(order.getUserId());
        dto.setDeliveryStatus(String.valueOf(order.getStatus()));
        dto.setDeliveryStatusText(getStatusText(order.getStatus()));
        dto.setCourierId(order.getDeliveryPersonId());
        dto.setCourierName(order.getDeliveryPersonName());
        dto.setReceiverName(order.getReceiverName());
        dto.setReceiverPhone(order.getReceiverPhone());
        // 将Date转换为LocalDateTime
        if (order.getCreateTime() != null) {
            dto.setCreateTime(order.getCreateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        if (order.getUpdateTime() != null) {
            dto.setUpdateTime(order.getUpdateTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        // 设置配送方式文本
        if (order.getDeliveryType() != null) {
            switch (order.getDeliveryType()) {
                case 1: dto.setDeliveryMethod("locker"); break;
                case 2: dto.setDeliveryMethod("special_place"); break;
                case 3: dto.setDeliveryMethod("dormitory"); break;
            }
        }
        
        return dto;
    }

    /**
     * 获取状态文本
     */
    private String getStatusText(Integer status) {
        switch (status) {
            case 0: return "待接单";
            case 1: return "已接单";
            case 2: return "配送中";
            case 3: return "已送达";
            case 4: return "已取消";
            default: return "未知状态";
        }
    }
    
    /**
     * 创建支付
     */
    @PostMapping("/payment/create")
    public R createPayment(@RequestBody PaymentRequestDTO dto) {
        if (dto == null || dto.getOrderId() == null || dto.getPaymentMethod() == null) {
            return ResultUtil.error("参数不能为空");
        }
        try {
            Map<String, Object> paymentParams = takeoutService.createPayment(dto.getOrderId(), dto.getPaymentMethod());
            return ResultUtil.success(paymentParams);
        } catch (Exception e) {
            return ResultUtil.error(e.getMessage());
        }
    }
    
    /**
     * 查询支付状态
     */
    @GetMapping("/payment/status/{orderId}")
    public R queryPaymentStatus(@PathVariable Long orderId) {
        if (orderId == null) {
            return ResultUtil.error("订单ID不能为空");
        }
        try {
            Integer paymentStatus = takeoutService.queryPaymentStatus(orderId);
            return ResultUtil.success(paymentStatus);
        } catch (Exception e) {
            return ResultUtil.error(e.getMessage());
        }
    }
    
    /**
     * 处理支付回调
     */
    @PostMapping("/payment/callback")
    public R handlePaymentCallback(@RequestBody Map<String, String> callbackParams) {
        try {
            boolean success = takeoutService.handlePaymentCallback(callbackParams);
            if (success) {
                return ResultUtil.success("支付成功");
            } else {
                return ResultUtil.error("支付失败");
            }
        } catch (Exception e) {
            return ResultUtil.error(e.getMessage());
        }
    }
    
    /**
     * 支付请求DTO
     */
    public static class PaymentRequestDTO {
        private Long orderId;
        private Integer paymentMethod;
        
        public Long getOrderId() {
            return orderId;
        }
        
        public void setOrderId(Long orderId) {
            this.orderId = orderId;
        }
        
        public Integer getPaymentMethod() {
            return paymentMethod;
        }
        
        public void setPaymentMethod(Integer paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }
}