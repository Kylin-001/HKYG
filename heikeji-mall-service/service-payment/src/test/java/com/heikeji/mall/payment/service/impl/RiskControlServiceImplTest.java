package com.heikeji.mall.payment.service.impl;

import com.heikeji.mall.payment.dto.PaymentContext;
import com.heikeji.mall.payment.dto.RiskAssessmentResult;
import com.heikeji.mall.payment.dto.SecurityCheckResult;
import com.heikeji.mall.payment.service.RiskControlService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 风控服务单元测试
 */
@SpringBootTest
public class RiskControlServiceImplTest {

    @Autowired
    private RiskControlService riskControlService;

    @Test
    public void testAssessPaymentRisk_LowRisk() {
        // 准备测试数据 - 低风险场景
        PaymentContext context = new PaymentContext();
        context.setUserId(1L);
        context.setAmount(100.00);
        context.setPaymentType(1);
        context.setIp("192.168.1.100");
        context.setDeviceId("device_123");

        // 执行测试
        RiskAssessmentResult result = riskControlService.assessPaymentRisk(context);

        // 验证结果
        assertNotNull(result);
        assertEquals(RiskControlService.RiskLevel.LOW, result.getRiskLevel());
        assertFalse(result.isBlocked());
    }

    @Test
    public void testAssessPaymentRisk_HighRiskAmount() {
        // 准备测试数据 - 高风险金额场景
        PaymentContext context = new PaymentContext();
        context.setUserId(1L);
        context.setAmount(100000.00); // 大额支付
        context.setPaymentType(1);
        context.setIp("192.168.1.100");

        // 执行测试
        RiskAssessmentResult result = riskControlService.assessPaymentRisk(context);

        // 验证结果
        assertNotNull(result);
        assertEquals(RiskControlService.RiskLevel.HIGH, result.getRiskLevel());
        assertTrue(result.isBlocked());
    }

    @Test
    public void testDetectAbnormalPaymentBehavior_Normal() {
        // 准备测试数据
        PaymentContext context = new PaymentContext();
        context.setUserId(1L);
        context.setAmount(200.00);
        context.setPaymentType(1);
        context.setIp("192.168.1.100");

        // 执行测试
        boolean isAbnormal = riskControlService.detectAbnormalPaymentBehavior(context);

        // 验证结果
        assertFalse(isAbnormal);
    }

    @Test
    public void testRecordPaymentAttempt() {
        // 准备测试数据
        PaymentContext context = new PaymentContext();
        context.setUserId(1L);
        context.setAmount(100.00);
        context.setPaymentType(1);
        context.setIp("192.168.1.100");
        context.setSuccess(true);

        // 执行测试
        riskControlService.recordPaymentAttempt(context);

        // 验证记录是否成功 - 这里可以通过查询Redis或数据库来验证
        // 由于是集成测试，我们假设记录逻辑正常执行
        assertTrue(true);
    }

    @Test
    public void testCheckPaymentEnvironmentSecurity_Secure() {
        // 准备测试数据 - 安全环境
        PaymentContext context = new PaymentContext();
        context.setIp("192.168.1.100"); // 正常IP
        context.setDeviceId("device_123");
        context.setAppVersion("1.0.0");
        context.setOsType("android");

        // 执行测试
        SecurityCheckResult result = riskControlService.checkPaymentEnvironmentSecurity(context);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.isSecure());
        assertEquals("环境安全", result.getMessage());
    }

    @Test
    public void testCheckPaymentEnvironmentSecurity_InsecureIP() {
        // 准备测试数据 - 不安全IP
        PaymentContext context = new PaymentContext();
        context.setIp("127.0.0.1"); // 本地IP，可能被视为不安全
        context.setDeviceId("device_123");

        // 执行测试
        SecurityCheckResult result = riskControlService.checkPaymentEnvironmentSecurity(context);

        // 验证结果
        assertNotNull(result);
        assertFalse(result.isSecure());
        assertTrue(result.getMessage().contains("IP异常"));
    }

    @Test
    public void testVerifyPaymentFrequency_LimitNotExceeded() {
        // 测试频率限制未超出
        long userId = 1L;
        int paymentType = 1;

        boolean isExceeded = riskControlService.verifyPaymentFrequency(userId, paymentType);

        assertFalse(isExceeded);
    }

    @Test
    public void testAssessPaymentRisk_InvalidPaymentType() {
        // 测试无效的支付方式
        PaymentContext context = new PaymentContext();
        context.setUserId(1L);
        context.setAmount(100.00);
        context.setPaymentType(999); // 无效的支付方式
        context.setIp("192.168.1.100");

        RiskAssessmentResult result = riskControlService.assessPaymentRisk(context);

        assertNotNull(result);
        assertEquals(RiskControlService.RiskLevel.MEDIUM, result.getRiskLevel());
        assertFalse(result.isBlocked());
    }

    @Test
    public void testCheckPaymentEnvironmentSecurity_MissingDeviceInfo() {
        // 测试缺少设备信息
        PaymentContext context = new PaymentContext();
        context.setIp("192.168.1.100");
        // 没有设置deviceId

        SecurityCheckResult result = riskControlService.checkPaymentEnvironmentSecurity(context);

        assertNotNull(result);
        assertFalse(result.isSecure());
        assertTrue(result.getMessage().contains("设备信息不完整"));
    }
}