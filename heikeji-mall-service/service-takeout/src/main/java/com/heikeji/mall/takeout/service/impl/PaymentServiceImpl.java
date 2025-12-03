package com.heikeji.mall.takeout.service.impl;

import com.heikeji.mall.takeout.entity.TakeoutOrder;
import com.heikeji.mall.takeout.exception.TakeoutException;
import com.heikeji.mall.takeout.service.PaymentService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 支付服务实现类
 * 模拟支付平台的行为，用于开发和测试
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    // 模拟支付记录存储
    private static final Map<String, Map<String, Object>> paymentRecords = new ConcurrentHashMap<>();

    // 支付方式映射
    private static final Map<Integer, String> PAYMENT_METHOD_MAP = new HashMap<>();
    static {
        PAYMENT_METHOD_MAP.put(1, "微信支付");
        PAYMENT_METHOD_MAP.put(2, "支付宝");
        PAYMENT_METHOD_MAP.put(3, "银行卡");
    }

    @Override
    public Map<String, Object> createPayment(TakeoutOrder order, Integer paymentMethod) throws TakeoutException {
        if (order == null || paymentMethod == null || !PAYMENT_METHOD_MAP.containsKey(paymentMethod)) {
            throw new TakeoutException("无效的支付参数");
        }

        // 生成支付流水号
        String paymentNo = generatePaymentNo();

        // 创建支付记录
        Map<String, Object> paymentInfo = new HashMap<>();
        paymentInfo.put("paymentNo", paymentNo);
        paymentInfo.put("orderNo", order.getOrderNo());
        paymentInfo.put("orderId", order.getId());
        paymentInfo.put("totalAmount", order.getTotalAmount());
        paymentInfo.put("paymentMethod", paymentMethod);
        paymentInfo.put("paymentMethodName", PAYMENT_METHOD_MAP.get(paymentMethod));
        paymentInfo.put("merchantId", order.getMerchantId());
        paymentInfo.put("userId", order.getUserId());
        paymentInfo.put("paymentStatus", 0); // 0:未支付
        paymentInfo.put("createTime", new Date());
        paymentInfo.put("updateTime", new Date());

        paymentRecords.put(paymentNo, paymentInfo);

        // 构建支付参数（模拟支付平台返回的参数）
        Map<String, Object> paymentParams = new HashMap<>();
        paymentParams.put("paymentNo", paymentNo);
        paymentParams.put("orderNo", order.getOrderNo());
        paymentParams.put("totalAmount", order.getTotalAmount());
        paymentParams.put("paymentMethod", paymentMethod);
        paymentParams.put("merchantId", order.getMerchantId());
        paymentParams.put("userId", order.getUserId());
        paymentParams.put("notifyUrl", "/api/takeout/payment/callback");
        paymentParams.put("qrCodeUrl", "https://mock.payment.com/qrcode/" + paymentNo); // 模拟二维码
        paymentParams.put("redirectUrl", "/api/takeout/payment/success?paymentNo=" + paymentNo);

        return paymentParams;
    }

    @Override
    public Map<String, Object> handleCallback(Map<String, String> callbackParams) throws TakeoutException {
        if (callbackParams == null || callbackParams.isEmpty()) {
            throw new TakeoutException("回调参数不能为空");
        }

        // 获取支付流水号
        String paymentNo = callbackParams.get("paymentNo");
        if (paymentNo == null || !paymentRecords.containsKey(paymentNo)) {
            throw new TakeoutException("支付记录不存在");
        }

        // 获取支付状态
        String paymentStatusStr = callbackParams.get("paymentStatus");
        if (paymentStatusStr == null) {
            throw new TakeoutException("支付状态不能为空");
        }

        Integer paymentStatus = Integer.parseInt(paymentStatusStr);
        if (paymentStatus != 1 && paymentStatus != 2) {
            throw new TakeoutException("无效的支付状态");
        }

        // 获取第三方支付交易号
        String transactionId = callbackParams.get("transactionId");
        if (transactionId == null) {
            throw new TakeoutException("第三方交易号不能为空");
        }

        // 更新支付记录
        Map<String, Object> paymentInfo = paymentRecords.get(paymentNo);
        paymentInfo.put("paymentStatus", paymentStatus);
        paymentInfo.put("transactionId", transactionId);
        paymentInfo.put("updateTime", new Date());
        if (paymentStatus == 1) {
            paymentInfo.put("paymentTime", new Date());
        }

        // 返回处理结果
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("paymentNo", paymentNo);
        result.put("paymentStatus", paymentStatus);
        result.put("transactionId", transactionId);
        result.put("orderId", paymentInfo.get("orderId"));

        return result;
    }

    @Override
    public Integer queryPaymentStatus(String paymentNo) throws TakeoutException {
        if (paymentNo == null || !paymentRecords.containsKey(paymentNo)) {
            throw new TakeoutException("支付记录不存在");
        }

        Map<String, Object> paymentInfo = paymentRecords.get(paymentNo);
        return (Integer) paymentInfo.get("paymentStatus");
    }

    @Override
    public boolean closePayment(String paymentNo) throws TakeoutException {
        if (paymentNo == null || !paymentRecords.containsKey(paymentNo)) {
            throw new TakeoutException("支付记录不存在");
        }

        Map<String, Object> paymentInfo = paymentRecords.get(paymentNo);
        Integer paymentStatus = (Integer) paymentInfo.get("paymentStatus");

        // 只有未支付的订单才能关闭
        if (paymentStatus != 0) {
            throw new TakeoutException("当前支付状态不支持关闭操作");
        }

        paymentInfo.put("paymentStatus", 4); // 4:已关闭
        paymentInfo.put("updateTime", new Date());

        return true;
    }

    @Override
    public Map<String, Object> applyRefund(String paymentNo, Double amount, String reason) throws TakeoutException {
        if (paymentNo == null || !paymentRecords.containsKey(paymentNo)) {
            throw new TakeoutException("支付记录不存在");
        }

        if (amount == null || amount <= 0) {
            throw new TakeoutException("退款金额必须大于0");
        }

        Map<String, Object> paymentInfo = paymentRecords.get(paymentNo);
        Integer paymentStatus = (Integer) paymentInfo.get("paymentStatus");

        // 只有已支付的订单才能申请退款
        if (paymentStatus != 1) {
            throw new TakeoutException("当前支付状态不支持退款操作");
        }

        Double totalAmount = (Double) paymentInfo.get("totalAmount");
        if (amount > totalAmount) {
            throw new TakeoutException("退款金额不能超过订单总金额");
        }

        // 模拟退款处理
        String refundNo = generateRefundNo();

        paymentInfo.put("paymentStatus", 3); // 3:已退款
        paymentInfo.put("refundNo", refundNo);
        paymentInfo.put("refundAmount", amount);
        paymentInfo.put("refundReason", reason);
        paymentInfo.put("refundTime", new Date());
        paymentInfo.put("updateTime", new Date());

        Map<String, Object> refundResult = new HashMap<>();
        refundResult.put("success", true);
        refundResult.put("paymentNo", paymentNo);
        refundResult.put("refundNo", refundNo);
        refundResult.put("refundAmount", amount);
        refundResult.put("refundReason", reason);
        refundResult.put("refundTime", paymentInfo.get("refundTime"));

        return refundResult;
    }

    /**
     * 生成支付流水号
     */
    private String generatePaymentNo() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.format("%06d", new Random().nextInt(1000000));
        return "PAY" + timestamp + random;
    }

    /**
     * 生成退款流水号
     */
    private String generateRefundNo() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = String.format("%06d", new Random().nextInt(1000000));
        return "REFUND" + timestamp + random;
    }
}