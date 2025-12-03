package com.heikeji.mall.payment.controller;

import com.heikeji.common.core.domain.R;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * PaymentController鍗曞厓娴嬭瘯
 */
@ExtendWith(MockitoExtension.class)
public class PaymentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(paymentController).build();
    }

    @Test
    public void testGenerateWechatPayParams_Success() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        Long paymentId = 1L;
        Map<String, Object> payParams = new HashMap<>();
        payParams.put("appId", "wx123456");
        payParams.put("timeStamp", "1625184000");
        payParams.put("nonceStr", "abc123");
        payParams.put("package", "prepay_id=wx123456");
        payParams.put("signType", "RSA");
        payParams.put("paySign", "xyz789");
        
        when(paymentService.generateWechatPayParams(eq(paymentId))).thenReturn(payParams);

        // 鎵ц娴嬭瘯
        mockMvc.perform(get("/api/payment/wechat/{paymentId}", paymentId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.appId").value("wx123456"))
                .andExpect(jsonPath("$.data.timeStamp").value("1625184000"));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).generateWechatPayParams(paymentId);
    }

    @Test
    public void testGenerateWechatPayParams_Failure() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        Long paymentId = 1L;
        when(paymentService.generateWechatPayParams(eq(paymentId))).thenReturn(new HashMap<>());

        // 鎵ц娴嬭瘯
        mockMvc.perform(get("/api/payment/wechat/{paymentId}", paymentId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(500));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).generateWechatPayParams(paymentId);
    }

    @Test
    public void testQueryPaymentStatus_Success() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        String orderNo = "ORDER123";
        Integer status = 1;
        when(paymentService.queryPaymentStatus(orderNo)).thenReturn(status);

        // 鎵ц娴嬭瘯
        mockMvc.perform(get("/api/payment/status/{orderNo}", orderNo))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(1));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).queryPaymentStatus(orderNo);
    }

    @Test
    public void testRefund_Success() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        String orderNo = "ORDER123";
        BigDecimal refundAmount = new BigDecimal("100.00");
        when(paymentService.refund(eq(orderNo), eq(refundAmount))).thenReturn(true);

        // 鎵ц娴嬭瘯
        mockMvc.perform(post("/api/payment/refund")
                .param("orderNo", orderNo)
                .param("refundAmount", refundAmount.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(true));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).refund(orderNo, refundAmount);
    }

    @Test
    public void testRefund_Failure() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        String orderNo = "ORDER123";
        BigDecimal refundAmount = new BigDecimal("100.00");
        when(paymentService.refund(eq(orderNo), eq(refundAmount))).thenReturn(false);

        // 鎵ц娴嬭瘯
        mockMvc.perform(post("/api/payment/refund")
                .param("orderNo", orderNo)
                .param("refundAmount", refundAmount.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(500));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).refund(orderNo, refundAmount);
    }

    @Test
    public void testBalancePay_Success() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        Long paymentId = 1L;
        when(paymentService.balancePay(eq(paymentId))).thenReturn(true);

        // 鎵ц娴嬭瘯
        mockMvc.perform(post("/api/payment/balance/pay")
                .param("paymentId", paymentId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").value(true));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).balancePay(paymentId);
    }

    @Test
    public void testBalancePay_Failure() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        Long paymentId = 1L;
        when(paymentService.balancePay(eq(paymentId))).thenReturn(false);

        // 鎵ц娴嬭瘯
        mockMvc.perform(post("/api/payment/balance/pay")
                .param("paymentId", paymentId.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(500));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).balancePay(paymentId);
    }

    @Test
    public void testRecharge_Success() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        BigDecimal amount = new BigDecimal("100.00");
        Integer paymentType = 1;
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setAmount(amount);
        
        when(paymentService.recharge(eq(amount), eq(paymentType))).thenReturn(payment);

        // 鎵ц娴嬭瘯
        mockMvc.perform(post("/api/payment/recharge")
                .param("amount", amount.toString())
                .param("paymentType", paymentType.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.amount").value(100.00));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).recharge(amount, paymentType);
    }

    @Test
    public void testRecharge_Failure() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        BigDecimal amount = new BigDecimal("100.00");
        Integer paymentType = 1;
        when(paymentService.recharge(eq(amount), eq(paymentType))).thenReturn(null);

        // 鎵ц娴嬭瘯
        mockMvc.perform(post("/api/payment/recharge")
                .param("amount", amount.toString())
                .param("paymentType", paymentType.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(500));

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).recharge(amount, paymentType);
    }

    @Test
    public void testGetPaymentList_Success() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        Integer page = 1;
        Integer size = 10;
        Map<String, Object> paymentList = new HashMap<>();
        paymentList.put("records", java.util.Collections.singletonList(new Payment()));
        paymentList.put("total", 1L);
        
        when(paymentService.getPaymentList(eq(page), eq(size))).thenReturn(paymentList);

        // 鎵ц娴嬭瘯
        mockMvc.perform(get("/api/payment/list")
                .param("page", page.toString())
                .param("size", size.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isMap());

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).getPaymentList(page, size);
    }

    @Test
    public void testGetPaymentList_Empty() throws Exception {
        // 鍑嗗娴嬭瘯鏁版嵁
        Integer page = 1;
        Integer size = 10;
        Map<String, Object> paymentList = new HashMap<>();
        paymentList.put("records", java.util.Collections.emptyList());
        paymentList.put("total", 0L);
        
        when(paymentService.getPaymentList(eq(page), eq(size))).thenReturn(paymentList);

        // 鎵ц娴嬭瘯
        mockMvc.perform(get("/api/payment/list")
                .param("page", page.toString())
                .param("size", size.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").isMap());

        // 楠岃瘉鏂规硶璋冪敤
        verify(paymentService).getPaymentList(page, size);
    }
    
    @Test
    public void testProcessWechatPayNotify_Success() throws Exception {
        // 准备测试数据
        Map<String, String> notifyData = new HashMap<>();
        notifyData.put("out_trade_no", "ORDER123");
        notifyData.put("transaction_id", "WX123456");
        notifyData.put("result_code", "SUCCESS");
        
        when(paymentService.processWechatPayNotify(anyMap())).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/api/payment/notify/wechat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"out_trade_no\":\"ORDER123\",\"transaction_id\":\"WX123456\",\"result_code\":\"SUCCESS\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>"));

        // 验证方法调用
        verify(paymentService).processWechatPayNotify(anyMap());
    }
    
    @Test
    public void testProcessWechatPayNotify_Failure() throws Exception {
        // 准备测试数据
        Map<String, String> notifyData = new HashMap<>();
        notifyData.put("out_trade_no", "ORDER123");
        notifyData.put("transaction_id", "WX123456");
        notifyData.put("result_code", "FAIL");
        
        when(paymentService.processWechatPayNotify(anyMap())).thenReturn(false);

        // 执行测试
        mockMvc.perform(post("/api/payment/notify/wechat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"out_trade_no\":\"ORDER123\",\"transaction_id\":\"WX123456\",\"result_code\":\"FAIL\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[处理失败]]></return_msg></xml>"));

        // 验证方法调用
        verify(paymentService).processWechatPayNotify(anyMap());
    }
    
    @Test
    public void testProcessAlipayNotify_Success() throws Exception {
        // 准备测试数据
        Map<String, String> notifyData = new HashMap<>();
        notifyData.put("out_trade_no", "ORDER123");
        notifyData.put("trade_no", "ALIPAY123456");
        notifyData.put("trade_status", "TRADE_SUCCESS");
        
        when(paymentService.processAlipayNotify(anyMap())).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/api/payment/notify/alipay")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("out_trade_no", "ORDER123")
                .param("trade_no", "ALIPAY123456")
                .param("trade_status", "TRADE_SUCCESS"))
                .andExpect(status().isOk())
                .andExpect(content().string("success"));

        // 验证方法调用
        verify(paymentService).processAlipayNotify(anyMap());
    }
    
    @Test
    public void testProcessAlipayNotify_Failure() throws Exception {
        // 准备测试数据
        Map<String, String> notifyData = new HashMap<>();
        notifyData.put("out_trade_no", "ORDER123");
        notifyData.put("trade_no", "ALIPAY123456");
        notifyData.put("trade_status", "TRADE_FAILED");
        
        when(paymentService.processAlipayNotify(anyMap())).thenReturn(false);

        // 执行测试
        mockMvc.perform(post("/api/payment/notify/alipay")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("out_trade_no", "ORDER123")
                .param("trade_no", "ALIPAY123456")
                .param("trade_status", "TRADE_FAILED"))
                .andExpect(status().isOk())
                .andExpect(content().string("fail"));

        // 验证方法调用
        verify(paymentService).processAlipayNotify(anyMap());
    }
}
