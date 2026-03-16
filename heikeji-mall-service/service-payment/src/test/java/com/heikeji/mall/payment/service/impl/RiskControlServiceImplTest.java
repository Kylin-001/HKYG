package com.heikeji.mall.payment.service.impl;

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
    public void testRiskControlServiceExists() {
        assertNotNull(riskControlService);
    }
}
