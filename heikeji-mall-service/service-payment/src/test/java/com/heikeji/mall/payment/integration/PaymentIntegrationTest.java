package com.heikeji.mall.payment.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.common.core.domain.R;
import com.heikeji.mall.payment.service.PaymentService;
import com.heikeji.mall.payment.service.RiskControlService;
import com.heikeji.mall.payment.service.ReconciliationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 支付模块集成测试
 */
@SpringBootTest
@AutoConfigureMockMvc
public class PaymentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private RiskControlService riskControlService;

    @Autowired
    private ReconciliationService reconciliationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCompletePaymentFlow() throws Exception {
        Map<String, Object> request = Map.of(
            "orderNo", "TEST_ORDER_" + UUID.randomUUID().toString().substring(0, 8),
            "userId", 1L,
            "amount", 100.00,
            "paymentType", 1,
            "ip", "192.168.1.100",
            "deviceId", "test_device_123"
        );

        String responseJson = mockMvc.perform(MockMvcRequestBuilders.post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        R r = objectMapper.readValue(responseJson, R.class);
        assertTrue(r.isSuccess());
    }
}
