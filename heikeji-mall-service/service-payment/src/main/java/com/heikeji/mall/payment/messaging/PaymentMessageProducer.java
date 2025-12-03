package com.heikeji.mall.payment.messaging;

import com.heikeji.mall.payment.config.RabbitMQConfig;
import com.heikeji.mall.payment.entity.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * 支付消息生产者
 * 负责发送支付状态变更相关的消息
 */
@Component
public class PaymentMessageProducer {
    private static final Logger log = LoggerFactory.getLogger(PaymentMessageProducer.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    /**
     * 发送支付成功消息
     * @param payment 支付信息
     */
    public void sendPaymentSuccessMessage(Payment payment) {
        if (payment == null) {
            log.error("支付信息为空，无法发送支付成功消息");
            return;
        }
        
        // 创建关联数据，用于消息确认
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        
        try {
            // 构建支付消息
        PaymentMessage paymentMessage = new PaymentMessage();
        paymentMessage.setPaymentId(payment.getId());
        paymentMessage.setOrderNo(payment.getOrderNo());
        paymentMessage.setPaymentNo(payment.getPaymentNo());
        paymentMessage.setAmount(payment.getAmount());
        paymentMessage.setPaymentType(payment.getPaymentType());
        paymentMessage.setTransactionId(payment.getTransactionId());
        paymentMessage.setPayTime(payment.getPayTime());
        paymentMessage.setStatus(payment.getStatus());
        paymentMessage.setMessageType(MessageType.PAYMENT_SUCCESS);
            
            // 发送消息到支付成功队列
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.PAYMENT_EXCHANGE,
                    RabbitMQConfig.PAYMENT_SUCCESS_ROUTING_KEY,
                    paymentMessage,
                    correlationData
            );
            
            log.info("支付成功消息发送成功，订单号: {}, 支付流水号: {}", 
                    payment.getOrderNo(), payment.getPaymentNo());
        } catch (Exception e) {
            log.error("发送支付成功消息失败，订单号: {}, 错误信息: {}", 
                    payment.getOrderNo(), e.getMessage(), e);
            // 可以在这里添加消息发送失败的重试逻辑
            handleMessageSendFailure(payment, MessageType.PAYMENT_SUCCESS, e);
        }
    }
    
    /**
     * 发送支付失败消息
     * @param payment 支付信息
     * @param reason 失败原因
     */
    public void sendPaymentFailedMessage(Payment payment, String reason) {
        if (payment == null) {
            log.error("支付信息为空，无法发送支付失败消息");
            return;
        }
        
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        
        try {
            // 构建支付失败消息内容
            PaymentMessage paymentMessage = new PaymentMessage();
            paymentMessage.setPaymentId(payment.getId());
            paymentMessage.setOrderNo(payment.getOrderNo());
            paymentMessage.setPaymentNo(payment.getPaymentNo());
            paymentMessage.setAmount(payment.getAmount());
            paymentMessage.setPaymentType(payment.getPaymentType());
            paymentMessage.setStatus(payment.getStatus());
            paymentMessage.setReason(reason);
            paymentMessage.setMessageType(MessageType.PAYMENT_FAILED);
            
            // 发送消息到支付失败队列
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.PAYMENT_EXCHANGE,
                    RabbitMQConfig.PAYMENT_FAILED_ROUTING_KEY,
                    paymentMessage,
                    correlationData
            );
            
            log.info("支付失败消息发送成功，订单号: {}, 支付流水号: {}", 
                    payment.getOrderNo(), payment.getPaymentNo());
        } catch (Exception e) {
            log.error("发送支付失败消息失败，订单号: {}, 错误信息: {}", 
                    payment.getOrderNo(), e.getMessage(), e);
            handleMessageSendFailure(payment, MessageType.PAYMENT_FAILED, e);
        }
    }
    
    /**
     * 发送退款成功消息
     * @param payment 支付信息
     * @param refundAmount 退款金额
     * @param refundNo 退款单号
     */
    public void sendRefundSuccessMessage(Payment payment, BigDecimal refundAmount, String refundNo) {
        if (payment == null) {
            log.error("支付信息为空，无法发送退款成功消息");
            return;
        }
        
        CorrelationData correlationData = new CorrelationData(UUID.randomUUID().toString());
        
        try {
            // 构建退款成功消息内容
            PaymentMessage paymentMessage = new PaymentMessage();
            paymentMessage.setPaymentId(payment.getId());
            paymentMessage.setOrderNo(payment.getOrderNo());
            paymentMessage.setPaymentNo(payment.getPaymentNo());
            paymentMessage.setAmount(payment.getAmount());
            paymentMessage.setRefundAmount(refundAmount);
            paymentMessage.setRefundNo(refundNo);
            paymentMessage.setPaymentType(payment.getPaymentType());
            paymentMessage.setStatus(payment.getStatus());
            paymentMessage.setMessageType(MessageType.REFUND_SUCCESS);
            
            // 发送消息到退款成功队列
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PAYMENT_EXCHANGE, 
                RabbitMQConfig.PAYMENT_REFUND_SUCCESS_ROUTING_KEY, 
                paymentMessage, 
                correlationData);
            
            log.info("退款成功消息发送成功，订单号: {}, 支付流水号: {}", 
                    payment.getOrderNo(), payment.getPaymentNo());
        } catch (Exception e) {
            log.error("发送退款成功消息失败，订单号: {}, 错误信息: {}", 
                    payment.getOrderNo(), e.getMessage(), e);
            handleMessageSendFailure(payment, MessageType.REFUND_SUCCESS, e);
        }
    }
    
    /**
     * 处理消息发送失败的情况
     * @param payment 支付信息
     * @param messageType 消息类型
     * @param e 异常信息
     */
    private void handleMessageSendFailure(Payment payment, MessageType messageType, Exception e) {
        // 这里可以实现消息发送失败的重试逻辑
        // 1. 记录到数据库
        // 2. 使用定时任务重试
        // 3. 发送告警通知
        log.error("消息发送失败处理，订单号: {}, 消息类型: {}", 
                payment.getOrderNo(), messageType);
        
        // TODO: 实现消息发送失败的重试机制
    }
}