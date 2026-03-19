package com.heikeji.mall.member.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.member.dto.CouponDTO;
import com.heikeji.mall.member.dto.UserCouponDTO;
import com.heikeji.mall.member.entity.Coupon;
import com.heikeji.mall.member.entity.UserCoupon;
import com.heikeji.mall.member.mapper.CouponMapper;
import com.heikeji.mall.member.mapper.UserCouponMapper;
import com.heikeji.mall.member.service.impl.CouponServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CouponServiceTest {

    @Mock
    private CouponMapper couponMapper;

    @Mock
    private UserCouponMapper userCouponMapper;

    @InjectMocks
    private CouponServiceImpl couponService;

    private Coupon testCoupon;
    private UserCoupon testUserCoupon;

    @BeforeEach
    void setUp() {
        testCoupon = new Coupon();
        testCoupon.setId(1L);
        testCoupon.setName("测试优惠券");
        testCoupon.setStatus(0);
        testCoupon.setPerUserLimit(2);
        testCoupon.setTotalCount(100);
        testCoupon.setUsedCount(0);
        testCoupon.setStartTime(LocalDateTime.now().minusDays(1));
        testCoupon.setEndTime(LocalDateTime.now().plusDays(7));
        testCoupon.setCreateTime(LocalDateTime.now());
        testCoupon.setUpdateTime(LocalDateTime.now());
        
        testUserCoupon = new UserCoupon();
        testUserCoupon.setId(1L);
        testUserCoupon.setUserId(1L);
        testUserCoupon.setCouponId(1L);
        testUserCoupon.setStatus(0);
        testUserCoupon.setCreateTime(LocalDateTime.now());
        
        // 设置baseMapper
        ReflectionTestUtils.setField(couponService, "baseMapper", couponMapper);
    }

    @Test
    void testGetAvailableCoupons() {
        List<Coupon> testCoupons = new ArrayList<>();
        testCoupons.add(testCoupon);
        
        // 模拟查询操作
        when(couponMapper.selectList(any(LambdaQueryWrapper.class))).thenReturn(testCoupons);
        when(userCouponMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        
        List<CouponDTO> result = couponService.getAvailableCoupons(1L);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getCanReceive());
        
        verify(couponMapper, times(1)).selectList(any(LambdaQueryWrapper.class));
        verify(userCouponMapper, times(1)).selectCount(any(LambdaQueryWrapper.class));
    }

    @Test
    void testGetCouponDetail() {
        // 模拟查询操作
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        when(userCouponMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        
        CouponDTO result = couponService.getCouponDetail(1L, 1L);
        
        assertNotNull(result);
        assertEquals(testCoupon.getName(), result.getName());
        assertTrue(result.getCanReceive());
        
        verify(couponMapper, times(1)).selectById(1L);
        verify(userCouponMapper, times(1)).selectCount(any(LambdaQueryWrapper.class));
    }

    @Test
    void testGetCouponDetailCouponNotFound() {
        // 模拟查询操作，返回null
        when(couponMapper.selectById(1L)).thenReturn(null);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.getCouponDetail(1L, 1L);
        });
        
        assertEquals("优惠券不存在", exception.getMessage());
        
        verify(couponMapper, times(1)).selectById(1L);
    }

    @Test
    void testReceiveCoupon() {
        // 模拟查询操作
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        when(userCouponMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        when(userCouponMapper.insert(any(UserCoupon.class))).thenReturn(1);
        when(couponMapper.updateById(any(Coupon.class))).thenReturn(1);
        
        boolean result = couponService.receiveCoupon(1L, 1L);
        
        assertTrue(result);
        
        verify(couponMapper, times(1)).selectById(1L);
        verify(userCouponMapper, times(1)).selectCount(any(LambdaQueryWrapper.class));
        verify(userCouponMapper, times(1)).insert(any(UserCoupon.class));
        verify(couponMapper, times(1)).updateById(any(Coupon.class));
    }

    @Test
    void testReceiveCouponCouponNotFound() {
        // 模拟查询操作，返回null
        when(couponMapper.selectById(1L)).thenReturn(null);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.receiveCoupon(1L, 1L);
        });
        
        assertEquals("优惠券不存在", exception.getMessage());
        
        verify(couponMapper, times(1)).selectById(1L);
    }

    @Test
    void testReceiveCouponCouponExpired() {
        // 修改优惠券状态为已失效
        testCoupon.setStatus(1);
        // 模拟查询操作
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.receiveCoupon(1L, 1L);
        });
        
        assertEquals("优惠券已失效", exception.getMessage());
        
        verify(couponMapper, times(1)).selectById(1L);
    }

    @Test
    void testReceiveCouponOutOfTime() {
        // 修改优惠券时间为已过期
        testCoupon.setEndTime(LocalDateTime.now().minusDays(1));
        // 模拟查询操作
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.receiveCoupon(1L, 1L);
        });
        
        assertEquals("优惠券不在领取时间范围内", exception.getMessage());
        
        verify(couponMapper, times(1)).selectById(1L);
    }

    @Test
    void testReceiveCouponOutOfStock() {
        // 修改优惠券已使用数量为总数量
        testCoupon.setUsedCount(testCoupon.getTotalCount());
        // 模拟查询操作
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.receiveCoupon(1L, 1L);
        });
        
        assertEquals("优惠券已领完", exception.getMessage());
        
        verify(couponMapper, times(1)).selectById(1L);
    }

    @Test
    void testReceiveCouponReachedLimit() {
        // 模拟查询操作，返回已领取数量达到上限
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        when(userCouponMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn((long) testCoupon.getPerUserLimit());
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.receiveCoupon(1L, 1L);
        });
        
        assertEquals("已达到领取上限", exception.getMessage());
        
        verify(couponMapper, times(1)).selectById(1L);
        verify(userCouponMapper, times(1)).selectCount(any(LambdaQueryWrapper.class));
    }

    @Test
    void testUseCoupon() {
        // 模拟查询操作
        when(userCouponMapper.selectById(1L)).thenReturn(testUserCoupon);
        when(couponMapper.selectById(1L)).thenReturn(testCoupon);
        when(userCouponMapper.updateById(any(UserCoupon.class))).thenReturn(1);
        
        boolean result = couponService.useCoupon(1L, "TEST123456");
        
        assertTrue(result);
        
        verify(userCouponMapper, times(1)).selectById(1L);
        verify(couponMapper, times(1)).selectById(1L);
        verify(userCouponMapper, times(1)).updateById(any(UserCoupon.class));
    }

    @Test
    void testUseCouponUserCouponNotFound() {
        // 模拟查询操作，返回null
        when(userCouponMapper.selectById(1L)).thenReturn(null);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.useCoupon(1L, "TEST123456");
        });
        
        assertEquals("用户优惠券不存在", exception.getMessage());
        
        verify(userCouponMapper, times(1)).selectById(1L);
    }

    @Test
    void testUseCouponCouponUnavailable() {
        // 修改用户优惠券状态为已使用
        testUserCoupon.setStatus(1);
        // 模拟查询操作
        when(userCouponMapper.selectById(1L)).thenReturn(testUserCoupon);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.useCoupon(1L, "TEST123456");
        });
        
        assertEquals("优惠券不可用", exception.getMessage());
        
        verify(userCouponMapper, times(1)).selectById(1L);
    }

    @Test
    void testCancelCoupon() {
        // 修改用户优惠券状态为已使用
        testUserCoupon.setStatus(1);
        testUserCoupon.setOrderNo("TEST123456");
        // 模拟查询操作
        when(userCouponMapper.selectById(1L)).thenReturn(testUserCoupon);
        when(userCouponMapper.updateById(any(UserCoupon.class))).thenReturn(1);
        
        boolean result = couponService.cancelCoupon(1L, "TEST123456");
        
        assertTrue(result);
        
        verify(userCouponMapper, times(1)).selectById(1L);
        verify(userCouponMapper, times(1)).updateById(any(UserCoupon.class));
    }

    @Test
    void testCancelCouponUserCouponNotFound() {
        // 模拟查询操作，返回null
        when(userCouponMapper.selectById(1L)).thenReturn(null);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.cancelCoupon(1L, "TEST123456");
        });
        
        assertEquals("用户优惠券不存在", exception.getMessage());
        
        verify(userCouponMapper, times(1)).selectById(1L);
    }

    @Test
    void testCancelCouponCouponNotUsed() {
        // 保持用户优惠券状态为未使用
        testUserCoupon.setStatus(0);
        // 模拟查询操作
        when(userCouponMapper.selectById(1L)).thenReturn(testUserCoupon);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.cancelCoupon(1L, "TEST123456");
        });
        
        assertEquals("优惠券未使用", exception.getMessage());
        
        verify(userCouponMapper, times(1)).selectById(1L);
    }

    @Test
    void testCancelCouponOrderNoMismatch() {
        // 修改用户优惠券状态为已使用
        testUserCoupon.setStatus(1);
        testUserCoupon.setOrderNo("TEST123456");
        // 模拟查询操作
        when(userCouponMapper.selectById(1L)).thenReturn(testUserCoupon);
        
        // 验证是否抛出异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            couponService.cancelCoupon(1L, "TEST654321");
        });
        
        assertEquals("订单号不匹配", exception.getMessage());
        
        verify(userCouponMapper, times(1)).selectById(1L);
    }

    @Test
    void testGetUserCoupons() {
        List<UserCoupon> testUserCoupons = new ArrayList<>();
        testUserCoupons.add(testUserCoupon);
        
        // 模拟查询操作
        when(userCouponMapper.selectList(any(LambdaQueryWrapper.class))).thenReturn(testUserCoupons);
        
        List<UserCouponDTO> result = couponService.getUserCoupons(1L, null);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        
        verify(userCouponMapper, times(1)).selectList(any(LambdaQueryWrapper.class));
    }
}
