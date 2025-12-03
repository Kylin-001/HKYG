package com.heikeji.mall.payment.service.impl;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradeRefundModel;
import com.alipay.api.domain.AlipayTradeQueryModel;
import com.alipay.api.request.AlipayTradeRefundRequest;
import com.alipay.api.request.AlipayTradeQueryRequest;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.heikeji.mall.payment.constants.PaymentConstants;
import com.heikeji.mall.payment.entity.Payment;
import com.heikeji.mall.payment.mapper.PaymentMapper;
import com.heikeji.mall.payment.service.PaymentStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 支付宝支付策略实现
 */
@Service
public class AlipayPaymentStrategy implements PaymentStrategy {
    private static final Logger log = LoggerFactory.getLogger(AlipayPaymentStrategy.class);
    
    @Value("${alipay.appId}")
    private String appId;
    
    @Value("${alipay.privateKey}")
    private String privateKey;
    
    @Value("${alipay.publicKey}")
    private String publicKey;
    
    @Value("${alipay.gateway}")
    private String gateway;
    
    @Value("${alipay.notifyUrl}")
    private String notifyUrl;
    
    @Value("${alipay.returnUrl}")
    private String returnUrl;
    
    @Value("${alipay.charset}")
    private String charset;
    
    @Value("${alipay.signType}")
    private String signType;
    
    @Autowired
    private PaymentMapper paymentMapper;
    
    private AlipayClient alipayClient;
    
    /**
     * 初始化支付宝客户端
     */
    private AlipayClient getAlipayClient() {
        if (alipayClient == null) {
            synchronized (this) {
                if (alipayClient == null) {
                    alipayClient = new DefaultAlipayClient(
                            gateway, appId, privateKey, "json", charset, publicKey, signType
                    );
                }
            }
        }
        return alipayClient;
    }
    
    /**
     * 初始化支付宝支付
     */
    @Override
    public Map<String, Object> initPayment(Payment payment) {
        log.info("初始化支付宝支付，支付ID: {}, 订单号: {}", payment.getId(), payment.getOrderNo());
        
        try {
            // 1. 创建支付宝客户端
            AlipayClient alipayClient = getAlipayClient();
            
            // 2. 创建支付请求
            com.alipay.api.request.AlipayTradePagePayRequest request = new com.alipay.api.request.AlipayTradePagePayRequest();
            request.setNotifyUrl(notifyUrl);
            request.setReturnUrl(returnUrl);
            
            // 3. 设置业务参数
            com.alipay.api.domain.AlipayTradePagePayModel model = new com.alipay.api.domain.AlipayTradePagePayModel();
            model.setOutTradeNo(payment.getOrderNo());
            model.setTotalAmount(payment.getAmount().toString());
            model.setSubject("黑科易购订单支付");
            model.setBody("订单号：" + payment.getOrderNo() + "，支付金额：" + payment.getAmount() + "元");
            model.setProductCode("FAST_INSTANT_TRADE_PAY"); // 快速即时到账
            
            request.setBizModel(model);
            
            // 4. 生成表单字符串
            String formContent = alipayClient.pageExecute(request).getBody();
            
            // 5. 封装返回参数
            Map<String, Object> payParams = new HashMap<>();
            payParams.put("formData", formContent);
            payParams.put("paymentUrl", gateway + "?charset=" + charset + "&method=alipay.trade.page.pay&sign_type=" + signType);
            
            log.info("支付宝支付参数生成成功，订单号: {}", payment.getOrderNo());
            return payParams;
        } catch (AlipayApiException e) {
            log.error("初始化支付宝支付失败", e);
            throw new RuntimeException("初始化支付宝支付失败", e);
        }
    }
    
    /**
     * 处理支付宝支付回调
     */
    @Override
    public boolean processCallback(Map<String, String> notifyData) {
        log.info("处理支付宝支付回调: {}", notifyData);
        
        try {
            // 验证回调签名
            if (!verifyCallbackSign(notifyData)) {
                log.error("支付宝支付回调签名验证失败");
                return false;
            }
            
            // 检查支付状态
            String tradeStatus = notifyData.get("trade_status");
            
            if ("TRADE_SUCCESS".equals(tradeStatus) || "TRADE_FINISHED".equals(tradeStatus)) {
                // 支付成功，处理业务逻辑
                String orderNo = notifyData.get("out_trade_no");
                String tradeNo = notifyData.get("trade_no");
                log.info("支付宝支付成功，订单号: {}, 交易号: {}", orderNo, tradeNo);
                return true;
            } else {
                // 支付失败
                log.error("支付宝支付失败，状态: {}", tradeStatus);
                return false;
            }
        } catch (Exception e) {
            log.error("处理支付宝支付回调异常", e);
            return false;
        }
    }
    
    /**
     * 查询支付宝支付状态
     */
    @Override
    public Integer queryPaymentStatus(Long paymentId) {
        log.info("查询支付宝支付状态，支付ID: {}", paymentId);
        try {
            Payment payment = paymentMapper.selectById(paymentId);
            if (payment == null) {
                log.error("支付记录不存在，支付ID: {}", paymentId);
                return PaymentConstants.PAYMENT_STATUS.UNKNOWN;
            }
            
            String orderNo = payment.getOrderNo();
            
            // 创建查询请求
            AlipayTradeQueryRequest request = new AlipayTradeQueryRequest();
            AlipayTradeQueryModel model = new AlipayTradeQueryModel();
            model.setOutTradeNo(orderNo);
            request.setBizModel(model);
            
            // 调用支付宝查询接口
            AlipayTradeQueryResponse response = getAlipayClient().execute(request);
            
            if (response.isSuccess()) {
                String tradeStatus = response.getTradeStatus();
                log.info("支付宝支付查询结果，订单号: {}, 支付状态: {}", orderNo, tradeStatus);
                
                // 解析支付状态
                switch (tradeStatus) {
                    case "TRADE_SUCCESS":
                    case "TRADE_FINISHED":
                        return PaymentConstants.PAYMENT_STATUS.PAID;
                    case "WAIT_BUYER_PAY":
                        return PaymentConstants.PAYMENT_STATUS.WAITING;
                    case "TRADE_CLOSED":
                        return PaymentConstants.PAYMENT_STATUS.CLOSED;
                    default:
                        return PaymentConstants.PAYMENT_STATUS.UNKNOWN;
                }
            } else {
                log.error("支付宝支付查询失败，错误信息: {}", response.getMsg());
                return PaymentConstants.PAYMENT_STATUS.UNKNOWN;
            }
        } catch (AlipayApiException e) {
            log.error("查询支付宝支付状态异常", e);
            return PaymentConstants.PAYMENT_STATUS.UNKNOWN;
        }
    }
    
    /**
     * 申请支付宝退款
     */
    @Override
    public boolean refund(Long paymentId, BigDecimal refundAmount) {
        log.info("申请支付宝退款，支付ID: {}, 退款金额: {}", paymentId, refundAmount);
        try {
            Payment payment = paymentMapper.selectById(paymentId);
            if (payment == null) {
                log.error("支付记录不存在，支付ID: {}", paymentId);
                return false;
            }
            
            String orderNo = payment.getOrderNo();
            String refundNo = "REFUND_" + System.currentTimeMillis();
            
            // 创建退款请求
            AlipayTradeRefundRequest request = new AlipayTradeRefundRequest();
            AlipayTradeRefundModel model = new AlipayTradeRefundModel();
            model.setOutTradeNo(orderNo);
            model.setOutRequestNo(refundNo);
            model.setRefundAmount(refundAmount.toString());
            model.setRefundReason("用户申请退款");
            request.setBizModel(model);
            
            // 调用支付宝退款接口
            AlipayTradeRefundResponse response = getAlipayClient().execute(request);
            
            if (response.isSuccess()) {
                log.info("支付宝退款申请成功，退款单号: {}, 退款金额: {}", refundNo, refundAmount);
                return true;
            } else {
                log.error("支付宝退款申请失败，错误信息: {}", response.getMsg());
                return false;
            }
        } catch (AlipayApiException e) {
            log.error("申请支付宝退款异常", e);
            return false;
        }
    }
    
    /**
     * 获取支付方式编码
     */
    @Override
    public Integer getPaymentType() {
        return PaymentConstants.PAYMENT_TYPE.ALIPAY; // 支付宝支付类型编码
    }
    
    /**
     * 验证支付参数
     */
    @Override
    public boolean validateParams(Map<String, Object> params) {
        if (params == null) {
            return false;
        }
        
        // 验证必要参数
        return params.containsKey("paymentId") && 
               params.get("paymentId") != null && 
               params.containsKey("orderNo") && 
               StringUtils.hasText((String) params.get("orderNo"));
    }
    
    // 生成商户订单号
    private String generateOutTradeNo(String orderNo) {
        return orderNo + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
    
    // 验证回调签名
    private boolean verifyCallbackSign(Map<String, String> notifyData) {
        try {
            // 使用支付宝SDK验证签名
            return com.alipay.api.internal.util.AlipaySignature.rsaCheckV1(
                    notifyData, publicKey, charset, signType
            );
        } catch (AlipayApiException e) {
            log.error("验证支付宝回调签名异常", e);
            return false;
        }
    }
}