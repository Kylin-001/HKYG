package com.heikeji.mall.payment.service.impl;

import com.github.binarywang.wxpay.bean.request.WxPayOrderQueryV3Request;
import com.github.binarywang.wxpay.bean.request.WxPayRefundV3Request;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.result.WxPayOrderQueryV3Result;
import com.github.binarywang.wxpay.bean.result.WxPayRefundV3Result;
import com.github.binarywang.wxpay.bean.result.WxPayUnifiedOrderResult;
import com.github.binarywang.wxpay.config.WxPayConfig;
import com.github.binarywang.wxpay.service.WxPayService;
import com.github.binarywang.wxpay.service.impl.WxPayServiceImpl;
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
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TimeZone;
import java.nio.charset.StandardCharsets;
import com.heikeji.mall.payment.exception.PaymentException;
import com.heikeji.mall.payment.util.PaymentSecurityUtil;

/**
 * 微信支付策略实现
 */
@Service
public class WechatPaymentStrategy implements PaymentStrategy {
    private static final Logger log = LoggerFactory.getLogger(WechatPaymentStrategy.class);
    
    @Value("${wx.pay.appId}")
    private String appId;
    
    @Value("${wx.pay.mchId}")
    private String mchId;
    
    @Value("${wx.pay.mchKey}")
    private String mchKey;
    
    @Value("${wx.pay.apiV3Key}")
    private String apiV3Key;
    
    @Value("${wx.pay.certPath}")
    private String certPath;
    
    @Value("${wx.pay.privateCertPath}")
    private String privateCertPath;
    
    @Value("${wx.pay.publicCertPath}")
    private String publicCertPath;
    
    @Value("${wx.pay.notifyUrl}")
    private String notifyUrl;
    
    @Value("${wx.pay.refundNotifyUrl}")
    private String refundNotifyUrl;
    
    @Autowired
    private PaymentMapper paymentMapper;
    
    @Autowired
    private PaymentSecurityUtil paymentSecurityUtil;
    
    private WxPayService wxPayService;
    
    /**
     * 初始化微信支付客户端
     */
    private WxPayService getWxPayService() {
        if (wxPayService == null) {
            synchronized (this) {
                if (wxPayService == null) {
                    WxPayConfig payConfig = new WxPayConfig();
                    payConfig.setAppId(appId);
                    payConfig.setMchId(mchId);
                    payConfig.setMchKey(mchKey);
                    payConfig.setApiV3Key(apiV3Key);
                    // 注意：根据wxpay-sdk版本，证书配置方式可能不同
                    // payConfig.setCertPath(certPath);
                    // payConfig.setPrivateKeyPath(privateCertPath);
                    // payConfig.setPayCertPath(publicCertPath);
                    payConfig.setNotifyUrl(notifyUrl);
                    
                    wxPayService = new WxPayServiceImpl();
                    ((WxPayServiceImpl) wxPayService).setConfig(payConfig);
                }
            }
        }
        return wxPayService;
    }
    
    /**
     * 初始化微信支付
     */
    @Override
    public Map<String, Object> initPayment(Payment payment) {
        log.info("初始化微信支付，支付ID: {}, 订单号: {}", payment.getId(), payment.getOrderNo());
        
        try {
            // 1. 创建微信支付客户端
            WxPayService wxPayService = getWxPayService();
            
            // 2. 构建统一下单请求
            com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest request = new com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest();
            
            // 3. 设置基本参数
            request.setAppid(appId);
            request.setMchId(mchId);
            request.setNonceStr(generateNonceStr());
            request.setSignType("MD5");
            
            // 4. 设置业务参数
            request.setBody("黑科易购订单支付");
            request.setOutTradeNo(payment.getOrderNo());
            request.setTotalFee(payment.getAmount().multiply(new BigDecimal(100)).intValue()); // 金额单位：分
            request.setSpbillCreateIp("127.0.0.1"); // 客户端IP
            request.setNotifyUrl(notifyUrl);
            request.setTradeType("NATIVE"); // 扫码支付
            
            // 5. 调用微信统一下单接口
            com.github.binarywang.wxpay.bean.result.WxPayUnifiedOrderResult result = wxPayService.unifiedOrder(request);
            log.info("微信统一下单成功，订单号: {}, 预支付ID: {}", 
                    payment.getOrderNo(), result.getPrepayId());
            
            // 6. 生成JSAPI支付参数（如果需要）
            Map<String, String> jsApiParams = new HashMap<>();
            jsApiParams.put("appId", appId);
            jsApiParams.put("timeStamp", String.valueOf(System.currentTimeMillis() / 1000));
            jsApiParams.put("nonceStr", generateNonceStr());
            jsApiParams.put("package", "prepay_id=" + result.getPrepayId());
            jsApiParams.put("signType", "MD5");
            jsApiParams.put("paySign", generatePaySign(jsApiParams));
            
            // 7. 封装返回参数
            Map<String, Object> payParams = new HashMap<>();
            payParams.put("jsApiParams", jsApiParams);
            // 注意：在微信支付V3版本中，getCodeUrl()方法可能已经不存在，需要根据实际库版本调整
            // payParams.put("qrCodeUrl", result.getCodeUrl());
            payParams.put("prepayId", result.getPrepayId());
            
            log.info("微信支付参数生成成功，订单号: {}", payment.getOrderNo());
            return payParams;
        } catch (Exception e) {
            log.error("初始化微信支付失败，订单号: {}", payment.getOrderNo(), e);
            throw new PaymentException("初始化微信支付失败", e);
        }
    }
    
    /**
     * 将Map<String, Object>转换为Map<String, String>
     */
    private Map<String, String> convertMapType(Map<String, Object> params) {
        Map<String, String> result = new HashMap<>();
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (entry.getValue() != null) {
                result.put(entry.getKey(), entry.getValue().toString());
            }
        }
        return result;
    }
    
    /**
     * 处理微信支付回调
     */
    @Override
    public boolean processCallback(Map<String, String> notifyData) {
        log.info("处理微信支付回调: {}", notifyData);
        
        try {
            // 验证回调签名
            if (!verifyCallbackSign(notifyData)) {
                log.error("微信支付回调签名验证失败");
                return false;
            }
            
            // 检查支付状态
            String returnCode = notifyData.get("return_code");
            String resultCode = notifyData.get("result_code");
            
            if (PaymentConstants.WECHAT_PAY.SUCCESS_CODE.equals(returnCode) && 
                PaymentConstants.WECHAT_PAY.SUCCESS_CODE.equals(resultCode)) {
                // 支付成功，处理业务逻辑
                String orderNo = notifyData.get("out_trade_no");
                String transactionId = notifyData.get("transaction_id");
                log.info("微信支付成功，订单号: {}, 交易号: {}", orderNo, transactionId);
                return true;
            } else {
                // 支付失败
                String errCode = notifyData.get("err_code");
                String errMsg = notifyData.get("err_code_des");
                log.error("微信支付失败: {}, {}", errCode, errMsg);
                return false;
            }
        } catch (Exception e) {
            log.error("处理微信支付回调异常", e);
            return false;
        }
    }
    
    /**
     * 查询微信支付状态
     */
    @Override
    public Integer queryPaymentStatus(Long paymentId) {
        log.info("查询微信支付状态，支付ID: {}", paymentId);
        try {
            Payment payment = paymentMapper.selectById(paymentId);
            if (payment == null) {
                log.error("支付记录不存在，支付ID: {}", paymentId);
                return PaymentConstants.PAYMENT_STATUS.WAITING;
            }
            
            String orderNo = payment.getOrderNo();
            
            // 调用微信支付查询接口
            WxPayOrderQueryV3Request request = new WxPayOrderQueryV3Request();
            request.setOutTradeNo(orderNo);
            
            WxPayOrderQueryV3Result result = getWxPayService().queryOrderV3(request);
            
            // 解析支付状态
            String tradeState = result.getTradeState();
            log.info("微信支付查询结果，订单号: {}, 支付状态: {}", orderNo, tradeState);
            
            switch (tradeState) {
                case "SUCCESS":
                    return PaymentConstants.PAYMENT_STATUS.PAID;
                case "REFUND":
                    return PaymentConstants.PAYMENT_STATUS.REFUNDED;
                case "NOTPAY":
                case "USERPAYING":
                    return PaymentConstants.PAYMENT_STATUS.WAITING;
                case "CLOSED":
                    return PaymentConstants.PAYMENT_STATUS.CLOSED;
                case "REVOKED":
                    return PaymentConstants.PAYMENT_STATUS.CANCELLED;
                case "PAYERROR":
                    return PaymentConstants.PAYMENT_STATUS.FAIL;
                default:
                    return PaymentConstants.PAYMENT_STATUS.WAITING;
            }
        } catch (Exception e) {
            log.error("查询微信支付状态异常", e);
            return PaymentConstants.PAYMENT_STATUS.UNKNOWN;
        }
    }
    
    /**
     * 申请微信退款
     */
    @Override
    public boolean refund(Long paymentId, BigDecimal refundAmount) {
        log.info("申请微信退款，支付ID: {}, 退款金额: {}", paymentId, refundAmount);
        try {
            Payment payment = paymentMapper.selectById(paymentId);
            if (payment == null) {
                log.error("支付记录不存在，支付ID: {}", paymentId);
                return false;
            }
            
            String orderNo = payment.getOrderNo();
            String refundNo = "REFUND_" + System.currentTimeMillis();
            
            // 构建退款请求
            WxPayRefundV3Request request = new WxPayRefundV3Request();
            request.setOutTradeNo(orderNo);
            request.setOutRefundNo(refundNo);
            request.setNotifyUrl(refundNotifyUrl);
            
            // 设置金额（单位：分）
            WxPayRefundV3Request.Amount amount = new WxPayRefundV3Request.Amount();
            amount.setTotal(payment.getAmount().multiply(new BigDecimal(100)).intValue());
            amount.setRefund(refundAmount.multiply(new BigDecimal(100)).intValue());
            amount.setCurrency("CNY");
            request.setAmount(amount);
            
            // 调用微信退款接口
            WxPayRefundV3Result result = getWxPayService().refundV3(request);
            log.info("微信退款申请成功，退款单号: {}, 退款状态: {}", refundNo, result.getStatus());
            
            // 退款状态为SUCCESS或PROCESSING都视为退款申请成功
            return "SUCCESS".equals(result.getStatus()) || "PROCESSING".equals(result.getStatus());
        } catch (Exception e) {
            log.error("申请微信退款异常", e);
            return false;
        }
    }
    
    /**
     * 获取支付方式编码
     */
    @Override
    public Integer getPaymentType() {
        return PaymentConstants.PAYMENT_TYPE.WECHAT_PAY;
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
    
    // 生成随机字符串
    private String generateNonceStr() {
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 32; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    // 生成预支付ID
    private String generatePrepayId() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        return "wx" + sdf.format(new Date()) + System.currentTimeMillis();
    }
    
    // 生成支付签名
    private String generatePaySign(Map<String, String> params) {
        log.info("生成微信支付签名，参数: {}", params);
        
        try {
            return paymentSecurityUtil.generateSign(params, mchKey, "MD5");
        } catch (Exception e) {
            log.error("生成微信支付签名失败", e);
            throw new PaymentException("生成微信支付签名失败", e);
        }
    }
    
    // 验证回调签名
    private boolean verifyCallbackSign(Map<String, String> notifyData) {
        log.info("验证微信支付回调签名，参数: {}", notifyData);
        
        try {
            return paymentSecurityUtil.verifySign(notifyData, mchKey);
        } catch (Exception e) {
            log.error("验证微信支付回调签名失败", e);
            return false;
        }
    }
}