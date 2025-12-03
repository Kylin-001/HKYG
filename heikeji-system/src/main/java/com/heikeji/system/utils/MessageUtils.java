package com.heikeji.system.utils;

import com.heikeji.system.websocket.WebSocketServer;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 消息发送工具类
 *
 * @author zhangkaiyuan
 * @date 2023-11-09
 */
@Component
public class MessageUtils {

    /**
     * 发送消息给指定用户
     *
     * @param userId 用户ID
     * @param message 消息内容
     * @return 是否发送成功
     */
    public boolean sendToUser(String userId, String message) {
        return WebSocketServer.sendToUser(userId, message);
    }

    /**
     * 发送消息给所有用户
     *
     * @param message 消息内容
     */
    public void sendToAll(String message) {
        WebSocketServer.sendToAll(message);
    }

    /**
     * 发送系统通知
     *
     * @param userId 用户ID
     * @param title 通知标题
     * @param content 通知内容
     * @return 是否发送成功
     */
    public boolean sendSystemNotice(String userId, String title, String content) {
        Map<String, Object> notice = new HashMap<>();
        notice.put("type", "system_notice");
        notice.put("title", title);
        notice.put("content", content);
        notice.put("timestamp", System.currentTimeMillis());
        
        String jsonMessage = JsonUtils.toJson(notice);
        return sendToUser(userId, jsonMessage);
    }

    /**
     * 发送业务通知
     *
     * @param userId 用户ID
     * @param businessType 业务类型
     * @param businessId 业务ID
     * @param title 通知标题
     * @param content 通知内容
     * @return 是否发送成功
     */
    public boolean sendBusinessNotice(String userId, String businessType, String businessId, String title, String content) {
        Map<String, Object> notice = new HashMap<>();
        notice.put("type", "business_notice");
        notice.put("businessType", businessType);
        notice.put("businessId", businessId);
        notice.put("title", title);
        notice.put("content", content);
        notice.put("timestamp", System.currentTimeMillis());
        
        String jsonMessage = JsonUtils.toJson(notice);
        return sendToUser(userId, jsonMessage);
    }

    /**
     * 发送订单通知
     *
     * @param userId 用户ID
     * @param orderId 订单ID
     * @param status 订单状态
     * @param message 消息内容
     * @return 是否发送成功
     */
    public boolean sendOrderNotice(String userId, String orderId, String status, String message) {
        Map<String, Object> notice = new HashMap<>();
        notice.put("type", "order_notice");
        notice.put("orderId", orderId);
        notice.put("status", status);
        notice.put("message", message);
        notice.put("timestamp", System.currentTimeMillis());
        
        String jsonMessage = JsonUtils.toJson(notice);
        return sendToUser(userId, jsonMessage);
    }

    /**
     * 发送支付通知
     *
     * @param userId 用户ID
     * @param payId 支付ID
     * @param status 支付状态
     * @param amount 支付金额
     * @return 是否发送成功
     */
    public boolean sendPaymentNotice(String userId, String payId, String status, double amount) {
        Map<String, Object> notice = new HashMap<>();
        notice.put("type", "payment_notice");
        notice.put("payId", payId);
        notice.put("status", status);
        notice.put("amount", amount);
        notice.put("timestamp", System.currentTimeMillis());
        
        String jsonMessage = JsonUtils.toJson(notice);
        return sendToUser(userId, jsonMessage);
    }
}
