package com.heikeji.mall.order.service;

import com.heikeji.mall.order.constant.OrderConstant;
import com.heikeji.mall.order.entity.Order;
import com.heikeji.mall.order.entity.OrderItem;
import com.heikeji.mall.order.service.impl.OrderServiceImpl;
import com.heikeji.mall.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 库存功能测试
 * 测试库存锁定和恢复功能
 */
@ExtendWith(MockitoExtension.class)
public class InventoryTest {

    @Mock
    private ProductService productService;

    @Mock
    private OrderItemService orderItemService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Order testOrder;
    private String testOrderNo;
    private Long testProductId;
    private Integer testProductNum;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        testOrder = new Order();
        testOrder.setId(100L);
        testOrder.setUserId(1000L);
        testOrder.setStatus(OrderConstant.ORDER_STATUS_PENDING_PAYMENT);
        testOrder.setCreateTime(new Date());
        testOrder.setUpdateTime(new Date());
        
        testOrderNo = "TEST_ORDER_" + System.currentTimeMillis();
        testProductId = 1001L;
        testProductNum = 2;
    }

    /**
     * 测试库存锁定功能
     */
    @Test
    void testStockDeduction() {
        // 模拟商品信息
        List<Map<String, Object>> orderItems = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", testProductId);
        item.put("quantity", testProductNum);
        item.put("productPrice", 100.0);
        item.put("productName", "测试商品");
        item.put("productImage", "test.jpg");
        orderItems.add(item);
        
        // 模拟库存充足
        when(productService.checkStock(eq(testProductId), eq(testProductNum))).thenReturn(true);
        // 模拟库存锁定成功
        when(productService.deductStock(eq(testProductId), eq(testProductNum))).thenReturn(true);
        
        // 执行库存锁定
        Boolean result = orderService.createOrderItems(testOrder.getId(), testOrderNo, orderItems);
        
        // 验证结果
        assertTrue(result);
        // 验证调用了库存锁定方法
        verify(productService, times(1)).deductStock(eq(testProductId), eq(testProductNum));
    }

    /**
     * 测试库存不足时的处理
     */
    @Test
    void testStockInsufficient() {
        // 模拟商品信息
        List<Map<String, Object>> orderItems = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("productId", testProductId);
        item.put("productNum", testProductNum);
        item.put("productPrice", 100.0);
        item.put("productName", "测试商品");
        item.put("productImage", "test.jpg");
        orderItems.add(item);
        
        // 模拟库存不足
        when(productService.checkStock(eq(testProductId), eq(testProductNum))).thenReturn(false);
        
        // 执行库存锁定（应该抛出异常）
        assertThrows(Exception.class, () -> {
            orderService.createOrderItems(testOrder.getId(), testOrderNo, orderItems);
        });
        
        // 验证没有调用库存锁定方法
        verify(productService, never()).deductStock(anyLong(), anyInt());
    }

    /**
     * 测试取消订单时的库存恢复功能
     */
    @Test
    void testStockRestore() {
        // 模拟订单项
        OrderItem orderItem = new OrderItem();
        orderItem.setOrderId(testOrder.getId());
        orderItem.setOrderNo(testOrderNo);
        orderItem.setProductId(testProductId);
        orderItem.setProductNum(testProductNum);
        
        List<OrderItem> orderItemList = new ArrayList<>();
        orderItemList.add(orderItem);
        
        // 模拟订单信息
        when(orderService.getByOrderNo(testOrderNo)).thenReturn(testOrder);
        // 模拟获取订单项
        when(orderItemService.selectByOrderId(String.valueOf(testOrder.getId()))).thenReturn(orderItemList);
        // 模拟库存恢复成功
        when(productService.restoreStock(eq(testProductId), eq(testProductNum))).thenReturn(true);
        
        // 执行取消订单（应该恢复库存）
        Boolean result = orderService.cancelOrder(testOrderNo);
        
        // 验证结果
        assertTrue(result);
        // 验证调用了库存恢复方法
        verify(productService, times(1)).restoreStock(eq(testProductId), eq(testProductNum));
    }
}
