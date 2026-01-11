package com.heikeji.mall.product.service.impl;

import com.heikeji.mall.product.entity.Product;
import com.heikeji.mall.product.mapper.ProductMapper;
import com.heikeji.mall.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryTest {

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("测试商品");
        testProduct.setStock(100); // 可用库存
        testProduct.setLockedStock(20); // 锁定库存
        testProduct.setVersion(1);
        testProduct.setStatus(1); // 已上架
        testProduct.setDelFlag(0); // 未删除
    }

    @Test
    void testDeductStockWithSufficientLockedStock() {
        // 模拟根据ID查询商品
        when(productMapper.selectById(1L)).thenReturn(testProduct);
        
        // 模拟扣减库存成功
        when(productMapper.deductStock(1L, 10, 1)).thenReturn(1);
        
        // 执行扣减锁定库存的操作
        boolean result = productService.deductStock(1L, 10);
        
        // 验证操作是否成功
        assertTrue(result);
        
        // 验证方法调用
        verify(productMapper, times(1)).selectById(1L);
        verify(productMapper, times(1)).deductStock(1L, 10, 1);
    }

    @Test
    void testDeductStockWithInsufficientLockedStock() {
        // 模拟根据ID查询商品
        when(productMapper.selectById(1L)).thenReturn(testProduct);
        
        // 执行扣减锁定库存的操作（锁定库存不足）
        Exception exception = assertThrows(Exception.class, () -> {
            productService.deductStock(1L, 30); // 尝试扣减30个，但只有20个锁定库存
        });
        
        // 验证异常信息
        assertTrue(exception.getMessage().contains("锁定库存不足"));
        
        // 验证方法调用
        verify(productMapper, times(1)).selectById(1L);
        verify(productMapper, never()).deductStock(anyLong(), anyInt(), anyInt());
    }

    @Test
    void testDeductStockWithConcurrencyConflict() {
        // 模拟根据ID查询商品
        when(productMapper.selectById(1L)).thenReturn(testProduct);
        
        // 模拟扣减库存失败（并发冲突）
        when(productMapper.deductStock(1L, 10, 1)).thenReturn(0);
        
        // 执行扣减锁定库存的操作
        Exception exception = assertThrows(Exception.class, () -> {
            productService.deductStock(1L, 10);
        });
        
        // 验证异常信息
        assertTrue(exception.getMessage().contains("库存扣减失败"));
        
        // 验证方法调用
        verify(productMapper, times(1)).selectById(1L);
        verify(productMapper, times(1)).deductStock(1L, 10, 1);
    }
}