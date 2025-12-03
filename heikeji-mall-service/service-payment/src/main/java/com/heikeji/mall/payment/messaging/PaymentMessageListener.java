package com.heikeji.mall.payment.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 支付消息监听器
 * 处理支付相关的消息
 */
@Component
public class PaymentMessageListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentMessageListener.class);
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * 监听支付成功消息
     * @param message 支付消息
     */
    @RabbitListener(queues = "${rabbitmq.queue.payment.success}")
    @RabbitHandler
    public void handlePaymentSuccessMessage(PaymentMessage message) {
        try {
            log.error("收到支付成功消息: " + objectMapper.writeValueAsString(message));
            
            // 在这里可以添加额外的业务逻辑处理
            // 例如：记录日志、更新统计数据、发送通知等
            
            // 记录支付成功日志到数据库或日志文件
            logPaymentEvent(message, "支付成功");
            
            // 可以发送系统通知给用户
            // notifyUser(message.getOrderNo(), "您的订单已支付成功");
            
        } catch (Exception e) {
            log.error("处理支付成功消息失败: " + e.getMessage());
        }
    }
    
    /**
     * 监听支付失败消息
     * @param message 支付消息
     */
    @RabbitListener(queues = "${rabbitmq.queue.payment.failed}")
    @RabbitHandler
    public void handlePaymentFailedMessage(PaymentMessage message) {
        try {
            log.error("收到支付失败消息: " + objectMapper.writeValueAsString(message));
            
            // 记录支付失败日志
            logPaymentEvent(message, "支付失败: " + message.getReason());
            
            // 可以发送失败通知给用户或客服
            // notifyUser(message.getOrderNo(), "支付失败，请重新尝试支付: " + message.getReason());
            
        } catch (Exception e) {
            log.error("处理支付失败消息失败: " + e.getMessage());
        }
    }
    
    /**
     * 监听退款成功消息
     * @param message 支付消息
     */
    @RabbitListener(queues = "${rabbitmq.queue.payment.refund.success}")
    @RabbitHandler
    public void handleRefundSuccessMessage(PaymentMessage message) {
        try {
            log.error("收到退款成功消息: " + objectMapper.writeValueAsString(message));
            
            // 记录退款成功日志
            logPaymentEvent(message, "退款成功，金额: " + message.getRefundAmount());
            
            // 可以发送退款通知给用户
            // notifyUser(message.getOrderNo(), "您的订单已成功退款，金额: " + message.getRefundAmount());
            
        } catch (Exception e) {
            log.error("处理退款成功消息失败: " + e.getMessage());
        }
    }
    
    /**
     * 记录支付事件日志
     */
    private void logPaymentEvent(PaymentMessage message, String eventDescription) {
        try {
            // 这里可以将支付事件记录到数据库或日志系统
            log.error("支付事件日志 - 订单号: " + message.getOrderNo() + ", 支付ID: " + message.getPaymentId() + ", 事件: " + eventDescription);
            
            // TODO: 实现具体的日志记录逻辑，可以保存到数据库或文件系统
            // paymentLogService.savePaymentLog(message, eventDescription);
        } catch (Exception e) {
            log.error("记录支付事件日志失败: " + e.getMessage());
        }
    }
}