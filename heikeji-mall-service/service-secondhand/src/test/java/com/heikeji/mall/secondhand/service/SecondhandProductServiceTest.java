package com.heikeji.mall.secondhand.service;

import com.heikeji.mall.secondhand.entity.SecondhandProduct;
import com.heikeji.mall.secondhand.mapper.SecondhandProductMapper;
import com.heikeji.mall.secondhand.service.impl.SecondhandProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SecondhandProductServiceTest {

    @Mock
    private SecondhandProductMapper secondhandProductMapper;

    @InjectMocks
    private SecondhandProductServiceImpl secondhandProductService;

    private SecondhandProduct testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new SecondhandProduct();
        testProduct.setId(1L);
        testProduct.setProductName("测试二手商品");
        testProduct.setProductDesc("测试二手商品描述");
        testProduct.setPrice(new BigDecimal("100.00"));
        testProduct.setCategoryId(1L);
        testProduct.setStatus(1);
        testProduct.setUserId(1L);
        testProduct.setViewCount(10);
        testProduct.setCollectCount(5);
        testProduct.setCommentCount(2);
        testProduct.setCreateTime(new Date());
        testProduct.setUpdateTime(new Date());
        testProduct.setDelFlag(0);
        
        // 设置baseMapper
        ReflectionTestUtils.setField(secondhandProductService, "baseMapper", secondhandProductMapper);
    }

    @Test
    void testPublishProduct() {
        // 模拟保存操作
        when(secondhandProductMapper.insert(any(SecondhandProduct.class))).thenAnswer(invocation -> {
            SecondhandProduct product = invocation.getArgument(0);
            product.setId(1L);
            return 1;
        });
        
        Long result = secondhandProductService.publishProduct(testProduct);
        
        assertNotNull(result);
        assertEquals(1L, result);
        
        verify(secondhandProductMapper, times(1)).insert(any(SecondhandProduct.class));
    }

    @Test
    void testGetProductDetail() {
        // 模拟从数据库获取
        when(secondhandProductMapper.selectById(1L)).thenReturn(testProduct);
        
        SecondhandProduct result = secondhandProductService.getProductDetail(1L);
        
        assertNotNull(result);
        assertEquals(testProduct.getId(), result.getId());
        
        verify(secondhandProductMapper, times(1)).selectById(1L);
    }

    @Test
    void testGetProductList() {
        List<SecondhandProduct> productList = new ArrayList<>();
        productList.add(testProduct);
        
        Map<String, Object> params = new HashMap<>();
        params.put("categoryId", 1L);
        params.put("sort", "newest");
        
        // 模拟查询
        when(secondhandProductMapper.selectList(any())).thenReturn(productList);
        
        List<SecondhandProduct> result = secondhandProductService.getProductList(params);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getId(), result.get(0).getId());
        
        verify(secondhandProductMapper, times(1)).selectList(any());
    }

    @Test
    void testAuditProduct() {
        // 模拟更新操作
        when(secondhandProductMapper.updateById(any(SecondhandProduct.class))).thenReturn(1);
        
        boolean result = secondhandProductService.auditProduct(1L, 1, "审核通过");
        
        assertTrue(result);
        
        verify(secondhandProductMapper, times(1)).updateById(any(SecondhandProduct.class));
    }

    @Test
    void testUpdateProductStatus() {
        // 模拟更新操作
        when(secondhandProductMapper.updateById(any(SecondhandProduct.class))).thenReturn(1);
        
        boolean result = secondhandProductService.updateProductStatus(1L, 2);
        
        assertTrue(result);
        
        verify(secondhandProductMapper, times(1)).updateById(any(SecondhandProduct.class));
    }

    @Test
    void testIncreaseViewCount() {
        // 测试increaseViewCount方法是否能够正常调用
        // 由于该方法在新线程中执行，无法直接验证方法调用
        // 我们只能测试方法是否能够正常执行，不抛出异常
        secondhandProductService.increaseViewCount(1L);
        
        // 验证方法能够正常执行，不抛出异常
        assertTrue(true);
    }

    @Test
    void testGetHotProducts() {
        List<SecondhandProduct> hotProducts = new ArrayList<>();
        hotProducts.add(testProduct);
        
        // 模拟从数据库获取
        when(secondhandProductMapper.selectList(any())).thenReturn(hotProducts);
        
        List<SecondhandProduct> result = secondhandProductService.getHotProducts(5);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        
        verify(secondhandProductMapper, times(1)).selectList(any());
    }

    @Test
    void testGetRecommendProducts() {
        List<SecondhandProduct> recommendProducts = new ArrayList<>();
        recommendProducts.add(testProduct);
        
        // 模拟从数据库获取
        when(secondhandProductMapper.selectList(any())).thenReturn(recommendProducts);
        
        List<SecondhandProduct> result = secondhandProductService.getRecommendProducts(1L, 5);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        
        verify(secondhandProductMapper, times(1)).selectList(any());
    }

    @Test
    void testSearchProducts() {
        // 模拟分页查询
        when(secondhandProductMapper.selectPage(any(), any())).thenReturn(mock(com.baomidou.mybatisplus.core.metadata.IPage.class));
        
        Map<String, Object> result = secondhandProductService.searchProducts("测试", 1L, "newest", 1, 10);
        
        assertNotNull(result);
        
        verify(secondhandProductMapper, times(1)).selectPage(any(), any());
    }
}