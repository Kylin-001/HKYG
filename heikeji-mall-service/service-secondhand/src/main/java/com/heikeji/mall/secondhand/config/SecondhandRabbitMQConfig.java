package com.heikeji.mall.secondhand.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class SecondhandRabbitMQConfig {

    public static final String SECONDHAND_EXCHANGE = "secondhand.exchange";
    public static final String SECONDHAND_PRODUCT_QUEUE = "secondhand.product.queue";
    public static final String SECONDHAND_ORDER_QUEUE = "secondhand.order.queue";
    public static final String SECONDHAND_NOTIFY_QUEUE = "secondhand.notify.queue";
    public static final String SECONDHAND_DLX_EXCHANGE = "secondhand.dlx.exchange";

    public static final String ROUTING_KEY_PRODUCT_PUBLISH = "secondhand.product.publish";
    public static final String ROUTING_KEY_PRODUCT_SOLD = "secondhand.product.sold";
    public static final String ROUTING_KEY_ORDER_CREATE = "secondhand.order.create";
    public static final String ROUTING_KEY_NOTIFY = "secondhand.notify";

    @Bean("secondhandExchange")
    public TopicExchange secondhandExchange() {
        return new TopicExchange(SECONDHAND_EXCHANGE, true, false);
    }

    @Bean("secondhandProductQueue")
    public Queue secondhandProductQueue() {
        Map<String, Object> arguments = new HashMap<>();
        arguments.put("x-dead-letter-exchange", SECONDHAND_DLX_EXCHANGE);
        arguments.put("x-dead-letter-routing-key", "secondhand.product.dlx");
        arguments.put("x-message-ttl", 300000);
        return new Queue(SECONDHAND_PRODUCT_QUEUE, true, false, false, arguments);
    }

    @Bean("secondhandOrderQueue")
    public Queue secondhandOrderQueue() {
        return new Queue(SECONDHAND_ORDER_QUEUE, true);
    }

    @Bean("secondhandNotifyQueue")
    public Queue secondhandNotifyQueue() {
        return new Queue(SECONDHAND_NOTIFY_QUEUE, true);
    }

    @Bean
    public Binding bindingProductQueue(
            @org.springframework.beans.factory.annotation.Qualifier("secondhandProductQueue") Queue queue,
            @org.springframework.beans.factory.annotation.Qualifier("secondhandExchange") TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_PRODUCT_PUBLISH);
    }

    @Bean
    public Binding bindingOrderQueue(
            @org.springframework.beans.factory.annotation.Qualifier("secondhandOrderQueue") Queue queue,
            @org.springframework.beans.factory.annotation.Qualifier("secondhandExchange") TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_ORDER_CREATE);
    }

    @Bean
    public Binding bindingNotifyQueue(
            @org.springframework.beans.factory.annotation.Qualifier("secondhandNotifyQueue") Queue queue,
            @org.springframework.beans.factory.annotation.Qualifier("secondhandExchange") TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_NOTIFY);
    }

    @Bean("secondhandDlxExchange")
    public TopicExchange deadLetterExchange() {
        return new TopicExchange(SECONDHAND_DLX_EXCHANGE, true, false);
    }

    @Bean
    public MessageConverter secondhandMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate secondhandRabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(secondhandMessageConverter());
        return template;
    }
}
