package com.heikeji.mall.delivery.service;

import com.heikeji.common.core.exception.BaseException;
import com.heikeji.mall.delivery.constant.DeliveryConstant;
import com.heikeji.mall.delivery.entity.DeliveryOrder;
import com.heikeji.mall.delivery.mapper.DeliveryOrderMapper;
import com.heikeji.mall.delivery.service.impl.DeliveryOrderServiceImpl;
import com.heikeji.mall.delivery.vo.DeliveryOrderDetailVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderListVO;
import com.heikeji.mall.delivery.vo.DeliveryOrderStatusVO;
import com.heikeji.mall.delivery.vo.OrderAcceptRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeliveryOrderServiceTest {

    @Mock
    private DeliveryOrderMapper deliveryOrderMapper;

    @Mock
    private DeliveryTrackingService deliveryTrackingService;

    @InjectMocks
    private DeliveryOrderServiceImpl deliveryOrderService;

    private DeliveryOrder testOrder;
    private OrderAcceptRequest testAcceptRequest;

    @BeforeEach
    void setUp() {
        testOrder = new DeliveryOrder();
        testOrder.setId(1L);
        testOrder.setOrderNo("TEST123456");
        testOrder.setUserId(1L);
        testOrder.setStartLocation("测试起始地址");
        testOrder.setEndLocation("测试目标地址");
        testOrder.setStatus(DeliveryConstant.OrderStatus.PENDING);
        testOrder.setCreateTime(new Date());
        testOrder.setUpdateTime(new Date());
        
        testAcceptRequest = new OrderAcceptRequest();
        testAcceptRequest.setOrderId(1L);
        testAcceptRequest.setDeliveryUserId(2L);
        
        // 设置baseMapper
        ReflectionTestUtils.setField(deliveryOrderService, "baseMapper", deliveryOrderMapper);
    }

    @Test
    void testCreateOrder() {
        // 模拟保存操作
        when(deliveryOrderMapper.insert(any(DeliveryOrder.class))).thenReturn(1);
        
        DeliveryOrder result = deliveryOrderService.createOrder(testOrder);
        
        assertNotNull(result);
        assertNotNull(result.getOrderNo());
        assertEquals(DeliveryConstant.OrderStatus.PENDING, result.getStatus());
        
        verify(deliveryOrderMapper, times(1)).insert(any(DeliveryOrder.class));
    }

    @Test
    void testGetOrderDetail() {
        DeliveryOrderDetailVO testDetail = new DeliveryOrderDetailVO();
        testDetail.setId(1L);
        testDetail.setOrderNo("TEST123456");
        testDetail.setStatus(DeliveryConstant.OrderStatus.PENDING);
        
        // 模拟查询操作
        when(deliveryOrderMapper.getOrderDetail(1L)).thenReturn(testDetail);
        
        DeliveryOrderDetailVO result = deliveryOrderService.getOrderDetail(1L);
        
        assertNotNull(result);
        assertEquals(testDetail.getId(), result.getId());
        assertEquals("待接单", result.getStatusText());
        
        verify(deliveryOrderMapper, times(1)).getOrderDetail(1L);
    }

    @Test
    void testGetOrderList() {
        List<DeliveryOrderListVO> testOrderList = new ArrayList<>();
        DeliveryOrderListVO testOrderVO = new DeliveryOrderListVO();
        testOrderVO.setId(1L);
        testOrderVO.setOrderNo("TEST123456");
        testOrderVO.setStatus(DeliveryConstant.OrderStatus.PENDING);
        testOrderList.add(testOrderVO);
        
        Map<String, Object> params = new HashMap<>();
        
        // 模拟查询操作
        when(deliveryOrderMapper.getOrderList(params)).thenReturn(testOrderList);
        
        List<DeliveryOrderListVO> result = deliveryOrderService.getOrderList(params);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("待接单", result.get(0).getStatusText());
        
        verify(deliveryOrderMapper, times(1)).getOrderList(params);
    }

    @Test
    void testUpdateOrderStatus() {
        // 模拟查询操作
        when(deliveryOrderMapper.selectById(1L)).thenReturn(testOrder);
        // 模拟更新操作
        when(deliveryOrderMapper.updateById(any(DeliveryOrder.class))).thenReturn(1);
        
        boolean result = deliveryOrderService.updateOrderStatus(1L, DeliveryConstant.OrderStatus.ACCEPTED);
        
        assertTrue(result);
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, times(1)).updateById(any(DeliveryOrder.class));
    }

    @Test
    void testUpdateOrderStatusOrderNotFound() {
        // 模拟查询操作，返回null
        when(deliveryOrderMapper.selectById(1L)).thenReturn(null);
        
        // 验证是否抛出异常
        BaseException exception = assertThrows(BaseException.class, () -> {
            deliveryOrderService.updateOrderStatus(1L, DeliveryConstant.OrderStatus.ACCEPTED);
        });
        
        assertEquals("订单不存在", exception.getMessage());
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, never()).updateById(any(DeliveryOrder.class));
    }

    @Test
    void testAcceptOrder() {
        // 模拟查询操作
        when(deliveryOrderMapper.selectById(1L)).thenReturn(testOrder);
        // 模拟更新操作
        when(deliveryOrderMapper.updateById(any(DeliveryOrder.class))).thenReturn(1);
        // 模拟配送跟踪服务
        when(deliveryTrackingService.createTracking(anyLong(), anyLong())).thenReturn(true);
        when(deliveryTrackingService.addTrackingEvent(anyLong(), anyInt(), anyString())).thenReturn(true);
        
        boolean result = deliveryOrderService.acceptOrder(testAcceptRequest);
        
        assertTrue(result);
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, times(1)).updateById(any(DeliveryOrder.class));
        verify(deliveryTrackingService, times(1)).createTracking(anyLong(), anyLong());
        verify(deliveryTrackingService, times(1)).addTrackingEvent(anyLong(), anyInt(), anyString());
    }

    @Test
    void testAcceptOrderOrderNotFound() {
        // 模拟查询操作，返回null
        when(deliveryOrderMapper.selectById(1L)).thenReturn(null);
        
        // 验证是否抛出异常
        BaseException exception = assertThrows(BaseException.class, () -> {
            deliveryOrderService.acceptOrder(testAcceptRequest);
        });
        
        assertEquals("订单不存在", exception.getMessage());
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, never()).updateById(any(DeliveryOrder.class));
    }

    @Test
    void testAcceptOrderOrderAlreadyAccepted() {
        // 修改订单状态为已接单
        testOrder.setStatus(DeliveryConstant.OrderStatus.ACCEPTED);
        // 模拟查询操作
        when(deliveryOrderMapper.selectById(1L)).thenReturn(testOrder);
        
        // 验证是否抛出异常
        BaseException exception = assertThrows(BaseException.class, () -> {
            deliveryOrderService.acceptOrder(testAcceptRequest);
        });
        
        assertEquals("订单已被接单或已取消", exception.getMessage());
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, never()).updateById(any(DeliveryOrder.class));
    }

    @Test
    void testStartDelivery() {
        // 修改订单状态为已接单
        testOrder.setStatus(DeliveryConstant.OrderStatus.ACCEPTED);
        testOrder.setDeliveryUserId(2L);
        // 模拟查询操作
        when(deliveryOrderMapper.selectById(1L)).thenReturn(testOrder);
        // 模拟更新操作
        when(deliveryOrderMapper.updateById(any(DeliveryOrder.class))).thenReturn(1);
        // 模拟配送跟踪服务
        when(deliveryTrackingService.updateLocation(anyLong(), any(), any(), anyInt())).thenReturn(true);
        when(deliveryTrackingService.addTrackingEvent(anyLong(), anyInt(), anyString())).thenReturn(true);
        
        boolean result = deliveryOrderService.startDelivery(1L, 2L);
        
        assertTrue(result);
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, times(1)).updateById(any(DeliveryOrder.class));
        verify(deliveryTrackingService, times(1)).updateLocation(anyLong(), any(), any(), anyInt());
        verify(deliveryTrackingService, times(1)).addTrackingEvent(anyLong(), anyInt(), anyString());
    }

    @Test
    void testCompleteDelivery() {
        // 修改订单状态为配送中
        testOrder.setStatus(DeliveryConstant.OrderStatus.DELIVERING);
        // 模拟查询操作
        when(deliveryOrderMapper.selectById(1L)).thenReturn(testOrder);
        // 模拟更新操作
        when(deliveryOrderMapper.updateById(any(DeliveryOrder.class))).thenReturn(1);
        // 模拟配送跟踪服务
        when(deliveryTrackingService.updateLocation(anyLong(), any(), any(), anyInt())).thenReturn(true);
        when(deliveryTrackingService.addTrackingEvent(anyLong(), anyInt(), anyString())).thenReturn(true);
        
        boolean result = deliveryOrderService.completeDelivery(1L);
        
        assertTrue(result);
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, times(1)).updateById(any(DeliveryOrder.class));
        verify(deliveryTrackingService, times(1)).updateLocation(anyLong(), any(), any(), anyInt());
        verify(deliveryTrackingService, times(1)).addTrackingEvent(anyLong(), anyInt(), anyString());
    }

    @Test
    void testCancelOrder() {
        // 模拟查询操作
        when(deliveryOrderMapper.selectById(1L)).thenReturn(testOrder);
        // 模拟更新操作
        when(deliveryOrderMapper.updateById(any(DeliveryOrder.class))).thenReturn(1);
        
        boolean result = deliveryOrderService.cancelOrder(1L, "测试取消原因");
        
        assertTrue(result);
        
        verify(deliveryOrderMapper, times(1)).selectById(1L);
        verify(deliveryOrderMapper, times(1)).updateById(any(DeliveryOrder.class));
    }

    @Test
    void testGetOrderStatusCount() {
        DeliveryOrderStatusVO testStatusVO = new DeliveryOrderStatusVO();
        testStatusVO.setTotalCount(10);
        testStatusVO.setPendingCount(2);
        testStatusVO.setAcceptedCount(3);
        testStatusVO.setDeliveringCount(2);
        testStatusVO.setCompletedCount(2);
        testStatusVO.setCancelledCount(1);
        
        Map<String, Object> params = new HashMap<>();
        
        // 模拟查询操作
        when(deliveryOrderMapper.getOrderStatusCount(params)).thenReturn(testStatusVO);
        
        DeliveryOrderStatusVO result = deliveryOrderService.getOrderStatusCount(params);
        
        assertNotNull(result);
        assertEquals(10, result.getTotalCount());
        
        verify(deliveryOrderMapper, times(1)).getOrderStatusCount(params);
    }

    @Test
    void testGetDeliveryPendingOrders() {
        List<DeliveryOrderListVO> testOrderList = new ArrayList<>();
        DeliveryOrderListVO testOrderVO = new DeliveryOrderListVO();
        testOrderVO.setId(1L);
        testOrderVO.setOrderNo("TEST123456");
        testOrderVO.setStatus(DeliveryConstant.OrderStatus.ACCEPTED);
        testOrderList.add(testOrderVO);
        
        // 模拟查询操作
        when(deliveryOrderMapper.getDeliveryPendingOrders(2L)).thenReturn(testOrderList);
        
        List<DeliveryOrderListVO> result = deliveryOrderService.getDeliveryPendingOrders(2L);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("已接单", result.get(0).getStatusText());
        
        verify(deliveryOrderMapper, times(1)).getDeliveryPendingOrders(2L);
    }

    @Test
    void testGetDeliveryHistoryOrders() {
        List<DeliveryOrderListVO> testOrderList = new ArrayList<>();
        DeliveryOrderListVO testOrderVO = new DeliveryOrderListVO();
        testOrderVO.setId(1L);
        testOrderVO.setOrderNo("TEST123456");
        testOrderVO.setStatus(DeliveryConstant.OrderStatus.COMPLETED);
        testOrderList.add(testOrderVO);
        
        Map<String, Object> params = new HashMap<>();
        
        // 模拟查询操作
        when(deliveryOrderMapper.getDeliveryHistoryOrders(2L, params)).thenReturn(testOrderList);
        
        List<DeliveryOrderListVO> result = deliveryOrderService.getDeliveryHistoryOrders(2L, params);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("已完成", result.get(0).getStatusText());
        
        verify(deliveryOrderMapper, times(1)).getDeliveryHistoryOrders(2L, params);
    }
}
