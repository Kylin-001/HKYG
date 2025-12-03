package com.heikeji.mall.payment.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * RabbitMQ配置类
 * 配置支付服务相关的交换机、队列和绑定关系
 */
@Configuration
public class RabbitMQConfig {

    // 从配置文件读取交换机和队列名称
    public static final String PAYMENT_EXCHANGE = "payment.exchange";
    public static final String PAYMENT_SUCCESS_QUEUE = "payment.success.queue";
    public static final String PAYMENT_FAILED_QUEUE = "payment.failed.queue";
    public static final String PAYMENT_REFUND_SUCCESS_QUEUE = "payment.refund.success.queue";
    public static final String PAYMENT_REFUND_FAILED_QUEUE = "payment.refund.failed.queue";
    public static final String PAYMENT_DLX_EXCHANGE = "payment.dlx.exchange";
    
    @Value("${rabbitmq.exchange.payment}")
    private String paymentExchangeName;
    
    @Value("${rabbitmq.queue.payment.success}")
    private String paymentSuccessQueueName;
    
    @Value("${rabbitmq.queue.payment.failed}")
    private String paymentFailedQueueName;
    
    @Value("${rabbitmq.queue.payment.refund.success}")
    private String paymentRefundSuccessQueueName;
    
    @Value("${rabbitmq.queue.payment.refund.failed}")
    private String paymentRefundFailedQueueName;
    
    @Value("${rabbitmq.exchange.payment.dlx}")
    private String paymentDlxExchangeName;
    
    // 支付成功路由键
    public static final String PAYMENT_SUCCESS_ROUTING_KEY = "payment.success";
    
    // 支付失败路由键
    public static final String PAYMENT_FAILED_ROUTING_KEY = "payment.failed";
    
    // 退款成功路由键
    public static final String PAYMENT_REFUND_SUCCESS_ROUTING_KEY = "payment.refund.success";
    
    // 退款失败路由键
    public static final String PAYMENT_REFUND_FAILED_ROUTING_KEY = "payment.refund.failed";
    
    /**
     * 创建支付交换机
     * 使用Topic交换机，支持通配符路由
     */
    @Bean("paymentExchange")
    public TopicExchange paymentExchange() {
        // 创建Topic类型交换机，持久化
        return new TopicExchange(paymentExchangeName, true, false);
    }
    
    /**
     * 创建支付成功队列
     */
    @Bean("paymentSuccessQueue")
    public Queue paymentSuccessQueue() {
        // 创建持久化队列，设置死信交换机和死信路由键
        Map<String, Object> arguments = new HashMap<>();
        arguments.put("x-dead-letter-exchange", paymentDlxExchangeName);
        arguments.put("x-dead-letter-routing-key", "payment.success.dlx");
        arguments.put("x-message-ttl", 60000); // 60秒过期
        return new Queue(paymentSuccessQueueName, true, false, false, arguments);
    }
    
    /**
     * 创建支付失败队列
     */
    @Bean("paymentFailedQueue")
    public Queue paymentFailedQueue() {
        return new Queue(paymentFailedQueueName, true);
    }
    
    /**
     * 创建退款成功队列
     */
    @Bean("paymentRefundSuccessQueue")
    public Queue refundSuccessQueue() {
        return new Queue(paymentRefundSuccessQueueName, true);
    }
    
    /**
     * 创建退款失败队列
     */
    @Bean("paymentRefundFailedQueue")
    public Queue refundFailedQueue() {
        return new Queue(paymentRefundFailedQueueName, true);
    }
    
    /**
     * 绑定支付成功队列到交换机
     */
    @Bean
    public Binding bindingPaymentSuccessQueue(
            @Qualifier("paymentSuccessQueue") Queue queue,
            @Qualifier("paymentExchange") Exchange exchange) {
        return BindingBuilder.bind(queue)
                .to(exchange)
                .with(PAYMENT_SUCCESS_ROUTING_KEY)
                .noargs();
    }
    
    /**
     * 绑定支付失败队列到交换机
     */
    @Bean
    public Binding bindingPaymentFailedQueue(
            @Qualifier("paymentFailedQueue") Queue queue,
            @Qualifier("paymentExchange") Exchange exchange) {
        return BindingBuilder.bind(queue)
                .to(exchange)
                .with(PAYMENT_FAILED_ROUTING_KEY)
                .noargs();
    }
    
    /**
     * 绑定退款成功队列到交换机
     */
    @Bean
    public Binding bindingRefundSuccessQueue(
            @Qualifier("paymentRefundSuccessQueue") Queue queue,
            @Qualifier("paymentExchange") Exchange exchange) {
        return BindingBuilder.bind(queue)
                .to(exchange)
                .with(PAYMENT_REFUND_SUCCESS_ROUTING_KEY)
                .noargs();
    }
    
    /**
     * 绑定退款失败队列到交换机
     */
    @Bean
    public Binding bindingRefundFailedQueue(
            @Qualifier("paymentRefundFailedQueue") Queue queue,
            @Qualifier("paymentExchange") Exchange exchange) {
        return BindingBuilder.bind(queue)
                .to(exchange)
                .with(PAYMENT_REFUND_FAILED_ROUTING_KEY)
                .noargs();
    }
    
    /**
     * 创建死信交换机
     */
    @Bean("payment.dlx.exchange")
    public org.springframework.amqp.core.TopicExchange deadLetterExchange() {
        return new org.springframework.amqp.core.TopicExchange(PAYMENT_DLX_EXCHANGE, true, false);
    }
}