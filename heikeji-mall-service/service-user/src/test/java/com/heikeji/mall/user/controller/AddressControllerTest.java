package com.heikeji.mall.user.controller;

import com.heikeji.common.core.security.UserContextHolderAdapter;
import com.heikeji.mall.common.response.R;
import com.heikeji.mall.user.entity.Address;
import com.heikeji.mall.user.service.AddressService;
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

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AddressControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AddressService addressService;

    @InjectMocks
    private AddressController addressController;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(addressController).build();
    }

    private Address createTestAddress() {
        Address address = new Address();
        address.setId(1L);
        address.setUserId(1L);
        address.setReceiverName("张三");
        address.setPhoneNumber("13800138000");
        address.setProvince("江苏省");
        address.setCity("南京市");
        address.setDistrict("江宁区");
        address.setDetailAddress("详细地址");
        address.setIsDefault(0);
        return address;
    }

    @Test
    public void testSaveAddress_Success() throws Exception {
        Address address = createTestAddress();
        when(addressService.addAddress(any(Address.class))).thenReturn(true);
        
        // 模拟UserContextHolder获取当前用户ID
        try (MockedStatic<UserContextHolderAdapter> mockedStatic = mockStatic(UserContextHolderAdapter.class)) {
            mockedStatic.when(UserContextHolderAdapter::getCurrentUserId).thenReturn(1L);
            
            mockMvc.perform(post("/api/address/add")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"receiverName\":\"张三\",\"phoneNumber\":\"13800138000\",\"province\":\"江苏省\",\"city\":\"南京市\",\"district\":\"江宁区\",\"detailAddress\":\"详细地址\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200));
        }
    }

    @Test
    public void testGetUserAddresses() throws Exception {
        Long userId = 1L;
        List<Address> addresses = new ArrayList<>();
        addresses.add(createTestAddress());
        when(addressService.getUserAddresses(userId)).thenReturn(addresses);
        
        // 模拟UserContextHolder获取当前用户ID
        try (MockedStatic<UserContextHolderAdapter> mockedStatic = mockStatic(UserContextHolderAdapter.class)) {
            mockedStatic.when(UserContextHolderAdapter::getCurrentUserId).thenReturn(userId);
            
            mockMvc.perform(get("/api/address/list"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.length()").value(1));
        }
    }
}
