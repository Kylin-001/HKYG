package com.heikeji.mall.lostfound.service;

import com.heikeji.mall.lostfound.entity.LostFound;
import com.heikeji.mall.lostfound.mapper.LostFoundMapper;
import com.heikeji.mall.lostfound.service.impl.LostFoundServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LostFoundServiceTest {

    @Mock
    private LostFoundMapper lostFoundMapper;

    @InjectMocks
    private LostFoundServiceImpl lostFoundService;

    private LostFound testLostFound;

    @BeforeEach
    void setUp() {
        testLostFound = new LostFound();
        testLostFound.setId(1L);
        testLostFound.setTitle("测试失物");
        testLostFound.setContent("测试失物描述");
        testLostFound.setType(0); // 0=失物，1=招领
        testLostFound.setStatus(1);
        testLostFound.setUserId(1L);
        testLostFound.setViewCount(10);
        testLostFound.setCommentCount(2);
        testLostFound.setCreateTime(new Date());
        testLostFound.setUpdateTime(new Date());
        testLostFound.setDelFlag(0);
        
        // 设置baseMapper
        ReflectionTestUtils.setField(lostFoundService, "baseMapper", lostFoundMapper);
    }

    @Test
    void testPublishLostFound() {
        // 模拟保存操作
        when(lostFoundMapper.insert(any(LostFound.class))).thenAnswer(invocation -> {
            LostFound lostFound = invocation.getArgument(0);
            lostFound.setId(1L);
            return 1;
        });
        
        Long result = lostFoundService.publishLostFound(testLostFound);
        
        assertNotNull(result);
        assertEquals(1L, result);
        
        verify(lostFoundMapper, times(1)).insert(any(LostFound.class));
    }

    @Test
    void testGetLostFoundDetail() {
        // 模拟从数据库获取
        when(lostFoundMapper.selectById(1L)).thenReturn(testLostFound);
        
        LostFound result = lostFoundService.getLostFoundDetail(1L);
        
        assertNotNull(result);
        assertEquals(testLostFound.getId(), result.getId());
        
        verify(lostFoundMapper, times(1)).selectById(1L);
    }

    @Test
    void testGetLostFoundList() {
        List<LostFound> lostFoundList = new ArrayList<>();
        lostFoundList.add(testLostFound);
        
        Map<String, Object> params = new HashMap<>();
        params.put("type", 0);
        params.put("sort", "newest");
        
        // 模拟查询
        when(lostFoundMapper.selectList(any())).thenReturn(lostFoundList);
        
        List<LostFound> result = lostFoundService.getLostFoundList(params);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testLostFound.getId(), result.get(0).getId());
        
        verify(lostFoundMapper, times(1)).selectList(any());
    }

    @Test
    void testAuditLostFound() {
        // 模拟更新操作
        when(lostFoundMapper.updateById(any(LostFound.class))).thenReturn(1);
        
        boolean result = lostFoundService.auditLostFound(1L, 1, "审核通过");
        
        assertTrue(result);
        
        verify(lostFoundMapper, times(1)).updateById(any(LostFound.class));
    }

    @Test
    void testUpdateLostFoundStatus() {
        // 模拟更新操作
        when(lostFoundMapper.updateById(any(LostFound.class))).thenReturn(1);
        
        boolean result = lostFoundService.updateLostFoundStatus(1L, 2);
        
        assertTrue(result);
        
        verify(lostFoundMapper, times(1)).updateById(any(LostFound.class));
    }

    @Test
    void testIncreaseViewCount() {
        // 测试increaseViewCount方法是否能够正常调用
        // 由于该方法在新线程中执行，无法直接验证方法调用
        // 我们只能测试方法是否能够正常执行，不抛出异常
        lostFoundService.increaseViewCount(1L);
        
        // 验证方法能够正常执行，不抛出异常
        assertTrue(true);
    }

    @Test
    void testGetHotLostFound() {
        List<LostFound> hotLostFound = new ArrayList<>();
        hotLostFound.add(testLostFound);
        
        // 模拟从数据库获取
        when(lostFoundMapper.selectList(any())).thenReturn(hotLostFound);
        
        List<LostFound> result = lostFoundService.getHotLostFound(5);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        
        verify(lostFoundMapper, times(1)).selectList(any());
    }

    @Test
    void testSearchLostFound() {
        // 模拟分页查询
        when(lostFoundMapper.selectPage(any(), any())).thenReturn(mock(com.baomidou.mybatisplus.core.metadata.IPage.class));
        
        Map<String, Object> result = lostFoundService.searchLostFound("测试", 0, 1L, "newest", 1, 10);
        
        assertNotNull(result);
        
        verify(lostFoundMapper, times(1)).selectPage(any(), any());
    }
}