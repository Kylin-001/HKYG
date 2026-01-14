package com.heikeji.mall.user.controller;

import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.entity.User;
import com.heikeji.mall.user.entity.UserAuth;
import com.heikeji.mall.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    private User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setStudentId("20210001");
        user.setUsername("testuser");
        return user;
    }

    @Test
    public void testGetUserByPhone_Success() throws Exception {
        String phone = "13800138000";
        User user = createTestUser();
        
        when(userService.getUserByPhone(phone)).thenReturn(user);
        
        // 模拟UserContextHolder获取当前管理员ID
        try (MockedStatic<UserContextHolderAdapter> mockedStatic = mockStatic(UserContextHolderAdapter.class)) {
            mockedStatic.when(UserContextHolderAdapter::getCurrentUserId).thenReturn(1L);
            
            mockMvc.perform(get("/api/user/admin/getByPhone/{phone}", phone))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
        }
    }

    @Test
    public void testGetUserByPhone_UserNotFound() throws Exception {
        String phone = "13800138000";
        
        when(userService.getUserByPhone(phone)).thenReturn(null);
        
        // 模拟UserContextHolder获取当前管理员ID
        try (MockedStatic<UserContextHolderAdapter> mockedStatic = mockStatic(UserContextHolderAdapter.class)) {
            mockedStatic.when(UserContextHolderAdapter::getCurrentUserId).thenReturn(1L);
            
            mockMvc.perform(get("/api/user/admin/getByPhone/{phone}", phone))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(404));
        }
    }
}
