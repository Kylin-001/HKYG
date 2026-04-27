package com.heikeji.mall.campus.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 宿舍管理WebSocket处理器
 */
@Slf4j
@Component
public class DormitoryWebSocketHandler extends TextWebSocketHandler {

    // 存储所有连接的会话，按用户ID分组
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private static final Map<String, String> userSessions = new ConcurrentHashMap<>();
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            sessions.put(userId, session);
            userSessions.put(session.getId(), userId);
            log.info("WebSocket连接建立: userId={}, sessionId={}", userId, session.getId());
            
            // 发送连接成功消息
            sendMessage(userId, Map.of(
                "type", "connected",
                "message", "连接成功",
                "timestamp", System.currentTimeMillis()
            ));
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("收到WebSocket消息: {}", payload);
        
        try {
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);
            String type = (String) data.get("type");
            
            switch (type) {
                case "ping":
                    // 心跳响应
                    session.sendMessage(new TextMessage("{\"type\":\"pong\"}"));
                    break;
                case "subscribe":
                    // 订阅通知
                    String userId = getUserIdFromSession(session);
                    log.info("用户 {} 订阅了通知", userId);
                    break;
                default:
                    log.warn("未知的消息类型: {}", type);
            }
        } catch (Exception e) {
            log.error("处理WebSocket消息失败", e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        String userId = userSessions.get(sessionId);
        if (userId != null) {
            sessions.remove(userId);
            userSessions.remove(sessionId);
            log.info("WebSocket连接关闭: userId={}, sessionId={}", userId, sessionId);
        }
    }

    /**
     * 发送消息给指定用户
     */
    public static void sendMessage(String userId, Map<String, Object> message) {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String json = mapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(json));
            } catch (IOException e) {
                log.error("发送WebSocket消息失败: userId={}", userId, e);
            }
        }
    }

    /**
     * 广播消息给所有连接的用户
     */
    public static void broadcast(Map<String, Object> message) {
        ObjectMapper mapper = new ObjectMapper();
        String json;
        try {
            json = mapper.writeValueAsString(message);
        } catch (IOException e) {
            log.error("序列化消息失败", e);
            return;
        }
        
        sessions.values().forEach(session -> {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(json));
                } catch (IOException e) {
                    log.error("广播消息失败", e);
                }
            }
        });
    }

    /**
     * 发送报修通知给管理员
     */
    public static void sendRepairNotification(String adminId, Map<String, Object> repairInfo) {
        Map<String, Object> message = Map.of(
            "type", "repair_notification",
            "title", "新报修工单",
            "data", repairInfo,
            "timestamp", System.currentTimeMillis()
        );
        sendMessage(adminId, message);
    }

    /**
     * 发送报修进度更新给学生
     */
    public static void sendRepairProgress(String studentId, Map<String, Object> progressInfo) {
        Map<String, Object> message = Map.of(
            "type", "repair_progress",
            "title", "报修进度更新",
            "data", progressInfo,
            "timestamp", System.currentTimeMillis()
        );
        sendMessage(studentId, message);
    }

    private String getUserIdFromSession(WebSocketSession session) {
        // 从URL参数或Header中获取用户ID
        String query = session.getUri().getQuery();
        if (query != null && query.contains("userId=")) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("userId=")) {
                    return param.substring(7);
                }
            }
        }
        return null;
    }
}
