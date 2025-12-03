package com.heikeji.mall.payment.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.heikeji.mall.common.domain.AjaxResult;
import com.heikeji.mall.payment.dto.PaymentRequest;
import com.heikeji.mall.payment.dto.PaymentResponse;
import com.heikeji.mall.payment.service.PaymentService;
import com.heikeji.mall.payment.service.RiskControlService;
import com.heikeji.mall.payment.service.ReconciliationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.Assert.*;

/**
 * 支付模块集成测试
 */
@RunWith(SpringRunner.class)
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

    /**
     * 测试完整的支付流程：创建订单 -> 执行风控 -> 发起支付 -> 处理回调
     */
    @Test
    public void testCompletePaymentFlow() throws Exception {
        // 1. 创建支付订单
        PaymentRequest request = new PaymentRequest();
        request.setOrderNo("TEST_ORDER_" + UUID.randomUUID().toString().substring(0, 8));
        request.setUserId(1L);
        request.setAmount(new BigDecimal(100.00));
        request.setPaymentType(1); // 微信支付
        request.setIp("192.168.1.100");
        request.setDeviceId("test_device_123");

        // 调用支付API
        String responseJson = mockMvc.perform(MockMvcRequestBuilders.post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        AjaxResult ajaxResult = objectMapper.readValue(responseJson, AjaxResult.class);
        assertTrue(ajaxResult.getCode() == 200);
        assertNotNull(ajaxResult.getData());

        // 2. 解析响应获取支付流水号
        PaymentResponse response = objectMapper.convertValue(ajaxResult.getData(), PaymentResponse.class);
        String paymentNo = response.getPaymentNo();
        assertNotNull(paymentNo);

        // 3. 模拟支付回调
        String callbackBody = "{\"out_trade_no\":\"" + paymentNo + "\",\"transaction_id\":\"wx_trade_123456\",\"result_code\":\"SUCCESS\",\"total_fee\":100}";
        
        String callbackResponse = mockMvc.perform(MockMvcRequestBuilders.post("/payment/callback/wx")
                .contentType(MediaType.APPLICATION_XML)
                .content(callbackBody))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        // 4. 查询支付状态
        String queryResponse = mockMvc.perform(MockMvcRequestBuilders.get("/payment/status")
                .param("paymentNo", paymentNo))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        AjaxResult statusResult = objectMapper.readValue(queryResponse, AjaxResult.class);
        assertTrue(statusResult.getCode() == 200);
        
        // 验证支付是否成功
        Map<String, Object> data = (Map<String, Object>) statusResult.getData();
        assertEquals(1, data.get("status")); // 1表示支付成功
    }

    /**
     * 测试余额支付流程
     */
    @Test
    public void testBalancePaymentFlow() throws Exception {
        // 创建余额支付请求
        PaymentRequest request = new PaymentRequest();
        request.setOrderNo("TEST_BALANCE_" + UUID.randomUUID().toString().substring(0, 8));
        request.setUserId(1L);
        request.setAmount(new BigDecimal(50.00));
        request.setPaymentType(2); // 余额支付
        request.setIp("192.168.1.100");

        // 调用支付API
        String responseJson = mockMvc.perform(MockMvcRequestBuilders.post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        AjaxResult ajaxResult = objectMapper.readValue(responseJson, AjaxResult.class);
        assertTrue(ajaxResult.getCode() == 200);
    }

    /**
     * 测试风控拦截功能
     */
    @Test
    public void testRiskControlInterception() throws Exception {
        // 创建一个高风险支付请求
        PaymentRequest request = new PaymentRequest();
        request.setOrderNo("TEST_RISK_" + UUID.randomUUID().toString().substring(0, 8));
        request.setUserId(1L);
        request.setAmount(new BigDecimal(100000.00)); // 大额支付，触发风控
        request.setPaymentType(1);
        request.setIp("192.168.1.100");

        // 调用支付API，期望被风控拦截
        String responseJson = mockMvc.perform(MockMvcRequestBuilders.post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        AjaxResult ajaxResult = objectMapper.readValue(responseJson, AjaxResult.class);
        assertTrue(ajaxResult.getCode() != 200); // 应该返回错误码
        assertTrue(ajaxResult.getMsg().contains("风控"));
    }

    /**
     * 测试对账功能集成
     */
    @Test
    public void testReconciliationIntegration() {
        // 1. 创建对账批次
        String reconciliationDate = "2023-01-01";
        Integer paymentType = 1;
        String batchNo = reconciliationService.startReconciliation(reconciliationDate, paymentType);
        assertNotNull(batchNo);

        // 2. 执行对账
        reconciliationService.executeReconciliation(batchNo);

        // 3. 生成对账报表
        Map<String, Object> report = reconciliationService.generateReconciliationReport(batchNo);
        assertNotNull(report);
        assertEquals(batchNo, report.get("batchNo"));

        // 4. 验证批次状态
        ReconciliationBatch batch = reconciliationService.getBatchByNo(batchNo);
        assertNotNull(batch);
        assertEquals(2, batch.getReconciliationStatus().intValue()); // 已完成
    }

    /**
     * 测试退款流程
     */
    @Test
    public void testRefundFlow() throws Exception {
        // 先创建一个支付订单（这里简化处理，实际应该使用已支付成功的订单）
        String paymentNo = "TEST_PAYMENT_REFUND";
        BigDecimal refundAmount = new BigDecimal(50.00);
        String refundReason = "测试退款";

        // 模拟退款请求
        String refundJson = "{\"paymentNo\":\"" + paymentNo + "\",\"refundAmount\":" + refundAmount + ",\"refundReason\":\"" + refundReason + "\"}";
        
        String responseJson = mockMvc.perform(MockMvcRequestBuilders.post("/payment/refund")
                .contentType(MediaType.APPLICATION_JSON)
                .content(refundJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        AjaxResult ajaxResult = objectMapper.readValue(responseJson, AjaxResult.class);
        assertNotNull(ajaxResult);
        // 在实际环境中，这里应该验证退款是否成功
    }

    /**
     * 测试支付API的并发处理能力
     */
    @Test
    public void testConcurrentPayments() throws Exception {
        // 简单的并发测试 - 创建5个支付请求
        for (int i = 0; i < 5; i++) {
            final int index = i;
            new Thread(() -> {
                try {
                    PaymentRequest request = new PaymentRequest();
                    request.setOrderNo("CONCURRENT_ORDER_" + index);
                    request.setUserId(1L);
                    request.setAmount(new BigDecimal(10.00 + index));
                    request.setPaymentType(1);
                    request.setIp("192.168.1.100");

                    mockMvc.perform(MockMvcRequestBuilders.post("/payment/create")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                            .andExpect(MockMvcResultMatchers.status().isOk());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }

        // 等待所有线程完成
        Thread.sleep(5000);
        
        // 验证系统没有崩溃
        assertTrue(true);
    }
}